<template>
  <div class="tags-view">
    <span v-show="showTool" class="tool-prev" @click="displayX -= 200">
      <svg-icon :icon="doubleLeftIcon" :size="20" />
    </span>
    <div ref="scrollbarRef" class="scroll-container" :class="{ 'ml-10 mr-10': !showTool }">
      <div ref="tabRef" class="tab">
        <span
          v-for="(tag, index) in visitedViews"
          :ref="'dynamic' + index"
          :key="index"
          :class="{
            active: isActive(tag),
            'mr-5': index == visitedViews.length - 1
          }"
          class="tags-view-item"
          @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
          @click="tagOnClick(tag)"
          @contextmenu.prevent="handleContextMenu(tag, $event)"
        >
          {{ tag.title }}
          <svg-icon
            v-if="!isAffix(tag)"
            class="tags-view-item-close"
            :icon="closeSmallIcon"
            @click.prevent.stop="closeSelectedTag(tag)"
          />
        </span>
      </div>
    </div>
    <span v-show="showTool" class="tool-next" @click="displayX += 200">
      <svg-icon :icon="doubleRightIcon" :size="20" />
    </span>
    <n-dropdown
      class="tags-view-menu"
      placement="bottom-start"
      trigger="manual"
      size="small"
      :x="left"
      :y="top"
      :options="menuOptions"
      :show="visible"
      :on-clickoutside="
        () => {
          visible = false
        }
      "
      @select="handleMenuSelect"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed, getCurrentInstance, h, nextTick, onMounted, reactive, ref, unref, watch } from 'vue'
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router'
import { useDebounceFn, useEventListener, useResizeObserver, useScroll } from '@vueuse/core'
import doubleLeftIcon from '@iconify-icons/icon-park-outline/double-left'
import doubleRightIcon from '@iconify-icons/icon-park-outline/double-right'
import closeSmallIcon from '@iconify-icons/icon-park-outline/close-small'
import refreshIcon from '@iconify-icons/icon-park-outline/redo'
import closeIcon from '@iconify-icons/icon-park-outline/close'
import closeOtherIcon from '@iconify-icons/icon-park-outline/close-one'
import closeLeftIcon from '@iconify-icons/icon-park-outline/to-left'
import closeRightIcon from '@iconify-icons/icon-park-outline/to-right'
import closeAllIcon from '@iconify-icons/icon-park-outline/minus'
import fullScreenIcon from '@iconify-icons/icon-park-outline/full-screen'
import type { DropdownOption } from 'naive-ui'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useAppStore, useTagsViewStore } from '@/store'
import { isPathAndQueryEqual, toTagView } from '@/store/modules/tagsView'
import { sortRoutesByMetaOrder } from '@/router/dynamicRouter'
import { safeRouterPush, safeRouterReplace } from '@/router/navigation'
import type { TagView, TagsViewState } from '@/store/types'

defineOptions({
  name: 'TagsView'
})

const router = useRouter()
const app = useAppStore()
const tagsView = useTagsViewStore()
const visitedViews = computed<TagView[]>(() => tagsView.visitedViews as TagView[])
const instance = getCurrentInstance()
const routes = computed<RouteRecordRaw[]>(() => router.getRoutes())
const route = useRoute()

const currentRouteTag = computed<TagView>(() => toTagView(route))

const showTool = ref(false)
const visible = ref(false)
const left = ref(0)
const top = ref(0)
const selectedTag = ref<TagView>()

const scrollbarRef = ref<HTMLElement | null>(null)
const tabRef = ref<HTMLElement | null>(null)
const { x } = useScroll(scrollbarRef, { behavior: 'smooth' })
const displayX = computed({
  get() {
    return x.value
  },
  set(value) {
    x.value = value
  }
})

const menuOptions = reactive<Array<DropdownOption>>([
  {
    label: '刷新',
    key: 'refresh',
    icon: () => h(SvgIcon, { icon: refreshIcon })
  },
  {
    label: '关闭当前',
    key: 'close',
    icon: () => h(SvgIcon, { icon: closeIcon })
  },
  {
    label: '关闭左侧',
    key: 'closeLeft',
    icon: () => h(SvgIcon, { icon: closeLeftIcon })
  },
  {
    label: '关闭右侧',
    key: 'closeRight',
    icon: () => h(SvgIcon, { icon: closeRightIcon })
  },
  {
    label: '关闭其他',
    key: 'closeOther',
    icon: () => h(SvgIcon, { icon: closeOtherIcon })
  },
  {
    label: '关闭全部',
    key: 'closeAll',
    icon: () => h(SvgIcon, { icon: closeAllIcon })
  },
  {
    label: '全屏当前页',
    key: 'fullScreen',
    icon: () => h(SvgIcon, { icon: fullScreenIcon })
  }
])

const isActive = (tag: TagView): boolean => {
  return isPathAndQueryEqual(tag, currentRouteTag.value)
}

const isAffix = (tag: TagView): boolean => {
  return Boolean(tag.meta?.isAffix)
}

const tagOnClick = (tag: TagView): void => {
  const { path, query } = tag
  if (isActive(tag)) {
    return
  }
  void safeRouterPush(router, { path, query })
}

const handleMenuSelect = async (key: string): Promise<void> => {
  const tag = unref(selectedTag)
  if (!tag) {
    return
  }

  switch (key) {
    case 'refresh': {
      tagsView.delCachedView(tag)
      await nextTick()
      const { fullPath, query } = route
      await safeRouterPush(router, {
        path: '/redirect' + fullPath,
        query
      })
      break
    }
    case 'close':
      closeSelectedTag(tag)
      break
    case 'closeLeft':
      tagsView.delLeftViews(tag).then((result: TagsViewState) => {
        if (!result.visitedViews.find((item) => isActive(item))) {
          toLastView(result.visitedViews, tag)
        }
      })
      break
    case 'closeRight':
      tagsView.delRightViews(tag).then((result: TagsViewState) => {
        if (!result.visitedViews.find((item) => isActive(item))) {
          toLastView(result.visitedViews, tag)
        }
      })
      break
    case 'closeOther':
      if (!selectedTag.value) {
        break
      }
      tagOnClick(selectedTag.value)
      tagsView.delOtherViews(selectedTag.value)
      break
    case 'closeAll':
      tagsView.delAllViews().then((result: TagsViewState) => {
        toLastView(result.visitedViews, tag)
      })
      break
    case 'fullScreen':
      if (selectedTag.value) {
        tagOnClick(selectedTag.value)
        app.tagsView.fullScreen = true
      }
      break
    default:
      break
  }

  visible.value = false
}

/**
 * 处理右键菜单项显示状态。
 */
const handleContextMenu = (tag: TagView, event: MouseEvent): void => {
  left.value = event.clientX
  top.value = event.clientY
  const index = visitedViews.value.findIndex((item) => isPathAndQueryEqual(item, tag))

  menuOptions[0].show = isActive(tag)
  menuOptions[1].show = !isAffix(tag)
  menuOptions[2].show =
    visitedViews.value.filter((item, itemIndex) => itemIndex < index && !item?.meta?.isAffix).length > 0
  menuOptions[3].show =
    visitedViews.value.filter((item, itemIndex) => itemIndex > index && !item?.meta?.isAffix).length > 0
  menuOptions[4].show =
    visitedViews.value.filter((item) => !item?.meta?.isAffix && !isPathAndQueryEqual(item, tag)).length > 0
  menuOptions[5].show = visitedViews.value.filter((item) => !item?.meta?.isAffix).length > 0

  visible.value = true
  selectedTag.value = tag
}

const closeSelectedTag = (view: TagView): void => {
  tagsView.delView(view).then((result: TagsViewState) => {
    if (isActive(view)) {
      toLastView(result.visitedViews, view)
    }
  })
}

const toLastView = (viewList: TagView[], view?: TagView): void => {
  const latestView = viewList.at(-1)
  if (latestView && latestView.path) {
    tagOnClick(latestView)
    return
  }

  if (view?.name === 'Dashboard') {
    void safeRouterReplace(router, { path: '/redirect' + view.path })
  } else {
    void safeRouterPush(router, '/')
  }
}

/**
 * 将滚动条定位到当前激活标签。
 */
const dynamicTagView = (): void => {
  const index = visitedViews.value.findIndex((item) => isActive(item))
  if (index >= 0) {
    moveToTarget(index)
  }
}

/**
 * 计算并移动滚动条位置。
 */
const moveToTarget = (index: number): void => {
  if (!instance) {
    return
  }

  nextTick(() => {
    const tabNavPadding = 10
    const dynamicRefs = instance.refs['dynamic' + index] as HTMLElement[] | undefined
    if (!dynamicRefs?.length) {
      return
    }

    const tabItemElement = dynamicRefs[0]
    const tabItemOffsetLeft = tabItemElement.offsetLeft
    const tabItemOffsetWidth = tabItemElement.offsetWidth
    const scrollbarRefWidth = scrollbarRef.value ? scrollbarRef.value.offsetWidth : 0
    const tabRefWidth = tabRef.value ? tabRef.value.offsetWidth : 0

    if (scrollbarRefWidth <= tabRefWidth !== showTool.value) {
      showTool.value = scrollbarRefWidth <= tabRefWidth
      moveToTarget(index)
      return
    }

    if (tabRefWidth < scrollbarRefWidth || tabItemOffsetLeft === 0) {
      displayX.value = 0
    } else if (tabItemOffsetLeft < displayX.value) {
      displayX.value = tabItemOffsetLeft - tabNavPadding
    } else if (
      tabItemOffsetLeft + tabItemOffsetWidth < scrollbarRefWidth + displayX.value &&
      tabItemOffsetLeft > displayX.value
    ) {
      displayX.value = Math.max(
        displayX.value,
        tabItemOffsetWidth + tabItemOffsetLeft + tabNavPadding - scrollbarRefWidth
      )
    } else {
      displayX.value = tabItemOffsetLeft - (scrollbarRefWidth - tabNavPadding - tabItemOffsetWidth)
    }
  })
}

useEventListener(document, 'click', () => {
  visible.value = false
})

const initTags = (): void => {
  const tags: TagView[] = sortRoutesByMetaOrder(
    routes.value.filter((item) => item.meta?.isAffix).map((item) => toTagView(item))
  )

  for (const tag of tags) {
    if (tag.name) {
      tagsView.addVisitedView(tag)
    }
  }
}

watch(
  route,
  () => {
    if (tagsView.visitedViews.length === 0) {
      initTags()
    }
    if (route.name) {
      tagsView.addView(currentRouteTag.value)
    }
    if (!app.tagsView.fullScreen) {
      dynamicTagView()
    }
  },
  {
    immediate: true
  }
)

onMounted(() => {
  useResizeObserver(
    scrollbarRef,
    useDebounceFn(() => {
      dynamicTagView()
    }, 200)
  )
})
</script>
<style lang="scss" scoped>
.refresh-button {
  animation: rotate 600ms infinite linear;
}

.tags-view {
  display: flex;
  align-items: center;
  width: 100%;
  height: 34px;
  background-color: var(--card-color);
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 12%),
    0 0 3px 0 rgb(0 0 0 / 4%);

  &-item {
    position: relative;
    top: 1px;
    padding: 0 8px;
    margin-left: 5px;
    font-size: 12px;
    line-height: 24px;
    color: var(--text-color-2);
    cursor: pointer;
    border: 1px solid var(--border-color);

    &-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      font-style: normal;
      vertical-align: -0.15em;
      color: var(--icon-color-hover);
      text-align: center;
      border-radius: 50%;
      transform-origin: 100% 50%;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

      &:hover {
        color: #ffffff !important;
        background-color: var(--icon-color);
      }
    }

    &.active {
      color: #ffffff;
      background-color: var(--primary-color);
      border-color: var(--primary-color);

      .tags-view-item-close {
        color: #ffffff !important;
      }

      &::before {
        position: relative;
        display: inline-block;
        width: 8px;
        height: 8px;
        margin-right: 4px;
        content: '';
        background: #ffffff;
        border-radius: 50%;
      }
    }
  }

  .scroll-container {
    position: relative;
    flex: 1;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;

    .tab {
      float: left;
      display: flex;
      align-items: center;
      height: 100%;
      overflow: visible;
      white-space: nowrap;
      list-style: none;
    }
  }
}

.tool {
  &-prev,
  &-next {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 100%;
    line-height: 34px;
    color: var(--icon-color);
    text-align: center;
    cursor: pointer;

    &:hover {
      color: var(--icon-color-hover);
    }

    .icon {
      vertical-align: middle !important;
    }
  }

  &-prev {
    box-shadow: 5px 0 5px -6px var(--icon-color);
  }

  &-next {
    box-shadow: -5px 0 5px -6px var(--icon-color);
  }
}
</style>

<style lang="scss">
.tags-view-menu {
  --n-option-icon-size: 13px !important;
  --n-font-size: 13px !important;
}
</style>
