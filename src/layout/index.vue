<template>
  <n-layout ref="layoutRef" class="wh-full" :has-sider="hasSider" content-class="flex">
    <LayoutSiderOrDrawer />
    <n-layout content-class="layout-main-scrollbar">
      <n-layout-header
        ref="layoutHeaderRef"
        :inverted="layout === 'horizontal' && sidebar.inverted && device !== 'mobile'"
      >
        <LayoutHeader />
      </n-layout-header>
      <n-layout-content
        ref="layoutContentRef"
        :class="{ 'layout-content-fullScreen': tagsView.fullScreen }"
        content-class="layout-content-scrollbar"
        embedded
        :native-scrollbar="false"
      >
        <LayoutMain />
        <n-back-top />
        <CloseFull />
      </n-layout-content>
      <n-layout-footer v-if="isShowFooter">
        <Footer />
      </n-layout-footer>
    </n-layout>
  </n-layout>
</template>
<script setup lang="ts">
import { ref, computed, watchEffect, defineComponent, h, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useResizeObserver } from '@vueuse/core'
import LayoutMain from './routerView/main.vue'
import LayoutHeader from './header/index.vue'
import CloseFull from './header/components/closeFull.vue'
import Footer from './footer/index.vue'
import Vertical from './sidebar/vertical.vue'
import { NLayoutSider, NDrawer, NLayout, type LayoutSiderProps, LayoutInst } from 'naive-ui'
import { useAppStore } from '@/store/modules/app'

defineOptions({
  name: 'Layout'
})

const app = useAppStore()
const { device, layout, sidebar, showFooter, tagsView } = storeToRefs(app)
const route = useRoute()

const hasSider = computed(() => layout.value !== 'horizontal' && device.value === 'desktop')
const isShowFooter = computed(() => showFooter.value && !route.meta?.isIframe)

const layoutContentRef = ref<LayoutInst | null>()

/**
 * 监听路由变化，等待页面切换完成后重置滚动位置
 */
watch(
  () => route.fullPath,
  async () => {
    await nextTick()
    layoutContentRef.value?.scrollTo({ top: 0, left: 0 })
  },
  {
    immediate: true
  }
)

// 侧边栏折叠后的默认宽度
const sideBarCollapsedWidth = 58

// 响应式断点
const responsiveBreakpoints = {
  mobile: 760,
  tablet: 990
} as const

/**
 * 侧边栏渲染组件
 * 根据设备类型和布局模式在 Sider 与 Drawer 间切换
 */
const LayoutSiderOrDrawer = defineComponent({
  name: 'LayoutSiderOrDrawer',
  setup() {
    const siderProps = computed<LayoutSiderProps>(() => ({
      collapsedWidth: sideBarCollapsedWidth,
      width: sidebar.value.sidebarWidth,
      inverted: sidebar.value.inverted,
      contentClass: 'flex flex-col',
      collapseMode: 'width'
    }))

    const siderContent = computed(() => ({
      default: () => h(Vertical)
    }))

    return () => {
      if (hasSider.value) {
        return h(
          NLayoutSider,
          {
            ...siderProps.value,
            collapsed: !sidebar.value.opened
          },
          siderContent.value
        )
      }

      if (device.value === 'mobile') {
        return h(
          NDrawer,
          {
            show: sidebar.value.opened,
            placement: 'left',
            width: sidebar.value.sidebarWidth,
            'onUpdate:show': (val: boolean) => {
              sidebar.value.opened = val
            }
          },
          {
            default: () =>
              h(
                NLayout,
                { class: 'wh-full', hasSider: true },
                {
                  default: () => h(NLayoutSider, { ...siderProps.value, collapsed: false }, siderContent.value)
                }
              )
          }
        )
      }

      return null
    }
  }
})

/**
 * 同步主题与侧边栏相关的 CSS 变量
 */
const updateThemeAndSidebar = (): void => {
  app.toggleTheme(app.overrideColor)

  const widthValue = hasSider.value ? (sidebar.value.opened ? sidebar.value.sidebarWidth : sideBarCollapsedWidth) : 0

  document.body.style.setProperty('--sidebar-width', `${widthValue}px`)
  document.body.style.setProperty(
    '--layout-content-height',
    `calc(100% - var(--header-height) - ${isShowFooter.value ? 40 : 0}px)`
  )
}

// 配置变更时同步主题与布局变量
watchEffect(updateThemeAndSidebar)

/**
 * 根据容器宽度切换设备模式与侧边栏状态
 */
const layoutRef = ref<HTMLElement>()
useResizeObserver(layoutRef, ([entry]) => {
  const { width } = entry.contentRect

  if (width <= responsiveBreakpoints.mobile) {
    app.toggleSidebar(false, 'mobile')
  } else if (width <= responsiveBreakpoints.tablet) {
    app.toggleSidebar(false, 'desktop')
  } else {
    app.toggleSidebar(!sidebar.value.isClickCollapse, 'desktop')
  }
})

/**
 * 将头部高度同步到 CSS 变量，供内容区域计算高度使用
 */
const layoutHeaderRef = ref<HTMLElement>()
useResizeObserver(layoutHeaderRef, ([entry]) => {
  const { height } = entry.contentRect
  document.body.style.setProperty('--header-height', `${height || 0}px`)
})
</script>
