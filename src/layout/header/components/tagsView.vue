<template>
  <div class="tags-view">
    <span v-show="showTool" class="tool-prev" @click="displayX -= 200">
      <svg-icon :icon="DoubleLeft" :size="20" />
    </span>
    <div ref="scrollbarRef" class="scroll-container" :class="{ 'ml-10 mr-10': !showTool }">
      <div ref="tabRef" class="tab">
        <span
          v-for="(tag, index) in visitedViews"
          :ref="'dynamic' + index"
          :key="index"
          :class="{ active: isActive(tag), 'mr-5': index == visitedViews.length - 1 }"
          class="tags-view-item"
          @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
          @click="tagOnClick(tag)"
          @contextmenu.prevent="handleContextMenu(tag, $event)"
        >
          {{ tag.title }}
          <svg-icon
            v-if="!isAffix(tag)"
            class="tags-view-item-close"
            :icon="CloseSmall"
            @click.prevent.stop="closeSelectedTag(tag)"
          />
        </span>
      </div>
    </div>
    <span v-show="showTool" class="tool-next" @click="displayX += 200">
      <svg-icon :icon="DoubleRight" :size="20" />
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
import DoubleLeft from '@iconify-icons/icon-park-outline/double-left'
import DoubleRight from '@iconify-icons/icon-park-outline/double-right'
import CloseSmall from '@iconify-icons/icon-park-outline/close-small'
import Redo from '@iconify-icons/icon-park-outline/redo'
import Close from '@iconify-icons/icon-park-outline/close'
import CloseOne from '@iconify-icons/icon-park-outline/close-one'
import ToLeft from '@iconify-icons/icon-park-outline/to-left'
import ToRight from '@iconify-icons/icon-park-outline/to-right'
import Minus from '@iconify-icons/icon-park-outline/minus'
import FullScreen from '@iconify-icons/icon-park-outline/full-screen'

import SvgIcon from '@/components/SvgIcon/index.vue'
import { ref, unref, reactive, h, watch, computed, onMounted, nextTick, getCurrentInstance } from 'vue'
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router'
import { useTagsViewStore, useAppStore } from '@/store'
import { isPathAndQueryEqual } from '@/store/modules/tagsView'
import { ascending } from '@/router/dynamicRouter'
import { useScroll, useEventListener, useResizeObserver, useDebounceFn } from '@vueuse/core'
import type { DropdownOption } from 'naive-ui'
import { TagView, TagsViewState } from '@/store/interface'

const router = useRouter()
const app = useAppStore()
const tagsView = useTagsViewStore()
const visitedViews = computed<TagView[]>(() => tagsView.visitedViews as TagView[])
const instance = getCurrentInstance()
const routes = computed<RouteRecordRaw[]>(() => router.getRoutes())
const route = useRoute()

const showTool = ref(false)
const visible = ref(false)
const left = ref(0)
const top = ref(0)
const selectedTag = ref<TagView>()

const scrollbarRef = ref()
const tabRef = ref()
const { x } = useScroll(scrollbarRef, { behavior: 'smooth' })
const displayX = computed({
  get() {
    return x.value
  },
  set(val) {
    x.value = val
  }
})

const menuOptions = reactive<Array<DropdownOption>>([
  {
    label: '刷新',
    key: 'refresh',
    icon: () => h(SvgIcon, { icon: Redo })
  },
  {
    label: '关闭当前',
    key: 'close',
    icon: () => h(SvgIcon, { icon: Close })
  },
  {
    label: '关闭左侧',
    key: 'closeLeft',
    icon: () => h(SvgIcon, { icon: ToLeft })
  },
  {
    label: '关闭右侧',
    key: 'closeRight',
    icon: () => h(SvgIcon, { icon: ToRight })
  },
  {
    label: '关闭其他',
    key: 'closeOther',
    icon: () => h(SvgIcon, { icon: CloseOne })
  },
  {
    label: '关闭全部',
    key: 'closeAll',
    icon: () => h(SvgIcon, { icon: Minus })
  },
  {
    label: '全屏当前页',
    key: 'fullScreen',
    icon: () => h(SvgIcon, { icon: FullScreen })
  }
])

const isActive = (tag: TagView) => {
  return isPathAndQueryEqual(tag, route)
}
const isAffix = (tag: TagView) => {
  return tag.meta && tag.meta.isAffix
}
const tagOnClick = (tag: TagView) => {
  const { query, path } = tag
  if (isActive(tag)) return
  router.push({
    path,
    query
  })
}

const handleMenuSelect = async (key: string) => {
  const tag: TagView = unref(selectedTag)
  switch (key) {
    case 'refresh':
      {
        tagsView.delCachedView(tag)
        await nextTick()
        const { fullPath, query } = route
        router.push({
          path: '/redirect' + fullPath,
          query: query
        })
      }
      break
    case 'close':
      closeSelectedTag(tag)
      break
    case 'closeLeft':
      tagsView.delLeftViews(tag).then((res: TagsViewState) => {
        if (!res.visitedViews.find((o) => isActive(o))) {
          toLastView(res.visitedViews, tag)
        }
      })
      break
    case 'closeRight':
      tagsView.delRightViews(tag).then((res: TagsViewState) => {
        if (!res.visitedViews.find((o) => isActive(o))) {
          toLastView(res.visitedViews, tag)
        }
      })
      break
    case 'closeOther':
      tagOnClick(selectedTag.value)
      tagsView.delOtherViews(selectedTag.value)
      break
    case 'closeAll':
      tagsView.delAllViews().then((res: TagsViewState) => {
        toLastView(res.visitedViews, tag)
      })
      break
    case 'fullScreen':
      tagOnClick(selectedTag.value)
      app.tagsView.fullScreen = true
      break
    default:
      break
  }
  visible.value = false
}
const handleContextMenu = (tag: TagView, e: MouseEvent) => {
  left.value = e.clientX
  top.value = e.clientY
  // 刷新
  menuOptions[0].show = isActive(tag)
  // 关闭当前
  menuOptions[1].show = !isAffix(tag)
  const index = visitedViews.value.findIndex((v) => isActive(tag))
  // 关闭左侧
  menuOptions[2].show = visitedViews.value.filter((v, i) => i < index && !v?.meta?.isAffix).length > 0
  // 关闭右侧
  menuOptions[3].show = visitedViews.value.filter((v, i) => i > index && !v?.meta?.isAffix).length > 0
  // 关闭其他
  menuOptions[4].show = visitedViews.value.filter((v) => !v?.meta?.isAffix && v.path !== tag.path).length > 0
  // 关闭全部
  menuOptions[5].show = visitedViews.value.filter((v) => !v?.meta?.isAffix).length > 0
  visible.value = true
  selectedTag.value = tag
}
// 关闭当前
const closeSelectedTag = (view: TagView) => {
  tagsView.delView(view).then((res: TagsViewState) => {
    if (isActive(view)) {
      toLastView(res.visitedViews, view)
    }
  })
}
const toLastView = (visitedViews: TagView[], view?: TagView) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView && latestView.path) {
    tagOnClick(latestView)
  } else {
    if (view.name === 'Dashboard') {
      router.replace({ path: '/redirect' + view.path })
    } else {
      router.push('/')
    }
  }
}
const dynamicTagView = () => {
  const index = visitedViews.value.findIndex((item) => isActive(item))
  moveToTarget(index)
}
const moveToTarget = (index: number) => {
  nextTick(() => {
    const tabNavPadding = 10
    if (!instance.refs['dynamic' + index]) return
    const tabItemEl = instance.refs['dynamic' + index][0]
    const tabItemElOffsetLeft = (tabItemEl as HTMLElement)?.offsetLeft
    // tag宽度
    const tabItemOffsetWidth = (tabItemEl as HTMLElement)?.offsetWidth
    // 标签页导航栏可视长度（不包含溢出部分）
    const scrollbarRefWidth = scrollbarRef.value ? scrollbarRef.value?.offsetWidth : 0
    // 已有标签页总长度（包含溢出部分）
    const tabRefWidth = tabRef.value ? tabRef.value?.offsetWidth : 0
    if (scrollbarRefWidth <= tabRefWidth !== showTool.value) {
      showTool.value = scrollbarRefWidth <= tabRefWidth
      moveToTarget(index)
      return
    }
    if (tabRefWidth < scrollbarRefWidth || tabItemElOffsetLeft === 0) {
      displayX.value = 0
    } else if (tabItemElOffsetLeft < displayX.value) {
      // 标签在可视区域左侧
      displayX.value = tabItemElOffsetLeft - tabNavPadding
    } else if (
      tabItemElOffsetLeft + tabItemOffsetWidth < scrollbarRefWidth + displayX.value &&
      tabItemElOffsetLeft > displayX.value
    ) {
      displayX.value = Math.max(
        displayX.value,
        tabItemOffsetWidth + tabItemElOffsetLeft + tabNavPadding - scrollbarRefWidth
      )
    } else {
      // 标签在可视区域右侧
      displayX.value = tabItemElOffsetLeft - (scrollbarRefWidth - tabNavPadding - tabItemOffsetWidth)
    }
  })
}
const initTags = () => {
  const tags: TagView[] = ascending(
    routes.value
      .filter((route) => route.meta && route.meta.isAffix)
      .map((route) => {
        return {
          path: route.path,
          name: route.name,
          meta: { ...route.meta }
        }
      })
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
    if (tagsView.visitedViews.length === 0) initTags()
    if (route.name) {
      tagsView.addView(route)
    }
    if (!app.tagsView.fullScreen) dynamicTagView()
  },
  {
    //初始化立即执行
    immediate: true
  }
)
watch(
  () => visible.value,
  () => {
    useEventListener(document, 'click', () => {
      visible.value = false
    })
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

  &-menu {
    position: absolute;
    z-index: 3000;
    padding: 5px 0;
    margin: 0;
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    list-style-type: none;
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 2px 2px 3px 0 rgb(0 0 0 / 30%);

    li {
      padding: 7px 16px;
      margin: 0;
      cursor: pointer;

      &:hover {
        color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
      }

      .icon.el-icon {
        margin-right: 3px;
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
