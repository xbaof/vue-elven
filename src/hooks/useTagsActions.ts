import { computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { isPathAndQueryEqual, toTagView } from '@/store/modules/tagsView'
import { useSafeNavigation } from '@/hooks/useSafeNavigation'
import type { TagView, TagsViewState } from '@/store/types'

export type TagActionKey = 'refresh' | 'close' | 'closeLeft' | 'closeRight' | 'closeOther' | 'closeAll' | 'fullScreen'

export const useTagsActions = () => {
  const route = useRoute()
  const { push, replace } = useSafeNavigation()
  const appStore = useAppStore()
  const tagsViewStore = useTagsViewStore()

  const currentRouteTag = computed<TagView>(() => toTagView(route))

  const currentTag = computed<TagView>(() => {
    const matchedTag = tagsViewStore.visitedViews.find((item) => isPathAndQueryEqual(item, currentRouteTag.value))
    return matchedTag ?? currentRouteTag.value
  })

  const isCurrentTag = (tag: TagView): boolean => {
    return isPathAndQueryEqual(tag, currentRouteTag.value)
  }

  const isAffixTag = (tag: TagView): boolean => {
    return Boolean(tag.meta?.isAffix)
  }

  const openTag = async (tag: TagView): Promise<void> => {
    if (isCurrentTag(tag)) {
      return
    }

    const { path, query } = tag
    await push({ path, query })
  }

  const navigateToLastView = async (visitedViews: TagView[], fallbackView?: TagView): Promise<void> => {
    const latestView = visitedViews.at(-1)
    if (latestView?.path) {
      await openTag(latestView)
      return
    }

    if (fallbackView?.name === 'Dashboard') {
      await replace({ path: '/redirect' + fallbackView.path })
      return
    }

    await push('/')
  }

  const refreshCurrentTag = async (tag: TagView): Promise<void> => {
    await tagsViewStore.delCachedView(tag)
    await nextTick()
    await push({
      path: '/redirect' + route.fullPath,
      query: route.query
    })
  }

  const closeCurrentTag = async (tag: TagView): Promise<TagsViewState> => {
    const result = await tagsViewStore.delView(tag)
    if (isCurrentTag(tag)) {
      await navigateToLastView(result.visitedViews, tag)
    }
    return result
  }

  const closeLeftTags = async (tag: TagView): Promise<Pick<TagsViewState, 'visitedViews'>> => {
    const result = await tagsViewStore.delLeftViews(tag)
    if (!result.visitedViews.some((item) => isCurrentTag(item))) {
      await navigateToLastView(result.visitedViews, tag)
    }
    return result
  }

  const closeRightTags = async (tag: TagView): Promise<Pick<TagsViewState, 'visitedViews'>> => {
    const result = await tagsViewStore.delRightViews(tag)
    if (!result.visitedViews.some((item) => isCurrentTag(item))) {
      await navigateToLastView(result.visitedViews, tag)
    }
    return result
  }

  const closeOtherTags = async (tag: TagView): Promise<TagsViewState> => {
    await openTag(tag)
    return tagsViewStore.delOtherViews(tag)
  }

  const closeAllTags = async (tag: TagView): Promise<TagsViewState> => {
    const result = await tagsViewStore.delAllViews()
    await navigateToLastView(result.visitedViews, tag)
    return result
  }

  const openTagInFullScreen = async (tag: TagView): Promise<void> => {
    await openTag(tag)
    appStore.tagsView.fullScreen = true
  }

  const executeTagAction = async (actionKey: TagActionKey, tag: TagView): Promise<void> => {
    switch (actionKey) {
      case 'refresh':
        await refreshCurrentTag(tag)
        break
      case 'close':
        await closeCurrentTag(tag)
        break
      case 'closeLeft':
        await closeLeftTags(tag)
        break
      case 'closeRight':
        await closeRightTags(tag)
        break
      case 'closeOther':
        await closeOtherTags(tag)
        break
      case 'closeAll':
        await closeAllTags(tag)
        break
      case 'fullScreen':
        await openTagInFullScreen(tag)
        break
      default:
        break
    }
  }

  return {
    currentRouteTag,
    currentTag,
    isCurrentTag,
    isAffixTag,
    openTag,
    closeCurrentTag,
    executeTagAction
  }
}
