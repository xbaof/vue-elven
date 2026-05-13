import { computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { isSameRoute, routeToTag } from '@/utils'
import { useSafeNavigation } from '@/hooks/useSafeNavigation'
import type { TagView, TagsViewState } from '@/store/types'

export type TagActionKey = 'refresh' | 'close' | 'closeLeft' | 'closeRight' | 'closeOther' | 'closeAll' | 'fullScreen'

export const useTagsActions = () => {
  const route = useRoute()
  const { push, replace } = useSafeNavigation()
  const appStore = useAppStore()
  const tagsViewStore = useTagsViewStore()

  const currentRouteTag = computed<TagView>(() => routeToTag(route))

  const currentTag = computed<TagView>(() => {
    const matchedTag = tagsViewStore.visitedViews.find((item) => isSameRoute(item, currentRouteTag.value))
    return matchedTag ?? currentRouteTag.value
  })

  const isCurrentTag = (tag: TagView): boolean => isSameRoute(tag, currentRouteTag.value)

  const isAffixTag = (tag: TagView): boolean => Boolean(tag.meta?.isAffix)

  const openTag = async (tag: TagView): Promise<void> => {
    if (!isCurrentTag(tag)) {
      await push({ path: tag.path, query: tag.query })
    }
  }

  const navigateToLastView = async (visitedViews: TagView[], fallbackView?: TagView): Promise<void> => {
    const latestView = visitedViews.at(-1)
    if (latestView?.path) {
      await openTag(latestView)
    } else if (fallbackView?.name === 'Dashboard') {
      await replace({ path: '/redirect' + fallbackView.path })
    } else {
      await push('/')
    }
  }

  const refreshCurrentTag = async (tag: TagView): Promise<void> => {
    await tagsViewStore.delCachedView(tag)
    await nextTick()
    await push({ path: '/redirect' + route.fullPath, query: route.query })
  }

  const closeCurrentTag = async (tag: TagView): Promise<TagsViewState> => {
    const result = await tagsViewStore.delView(tag)
    if (isCurrentTag(tag)) {
      await navigateToLastView(result.visitedViews, tag)
    }
    return result
  }

  const closeDirectionalTags = async (
    tag: TagView,
    delMethod: (tag: TagView) => Pick<TagsViewState, 'visitedViews'>
  ): Promise<Pick<TagsViewState, 'visitedViews'>> => {
    const result = delMethod(tag)
    if (!result.visitedViews.some((item) => isCurrentTag(item))) {
      await navigateToLastView(result.visitedViews, tag)
    }
    return result
  }

  const closeLeftTags = (tag: TagView) => closeDirectionalTags(tag, tagsViewStore.delLeftViews)

  const closeRightTags = (tag: TagView) => closeDirectionalTags(tag, tagsViewStore.delRightViews)

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
    const actions: Record<TagActionKey, () => Promise<void | TagsViewState | Pick<TagsViewState, 'visitedViews'>>> = {
      refresh: () => refreshCurrentTag(tag),
      close: () => closeCurrentTag(tag),
      closeLeft: () => closeLeftTags(tag),
      closeRight: () => closeRightTags(tag),
      closeOther: () => closeOtherTags(tag),
      closeAll: () => closeAllTags(tag),
      fullScreen: () => openTagInFullScreen(tag)
    }
    await actions[actionKey]?.()
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
