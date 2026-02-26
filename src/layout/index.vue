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
import { ref, computed, watchEffect, defineComponent, h } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useResizeObserver } from '@vueuse/core'
import LayoutMain from './routerView/main.vue'
import LayoutHeader from './header/index.vue'
import CloseFull from './header/components/closeFull.vue'
import Footer from './footer/index.vue'
import Vertical from './sidebar/vertical.vue'
import { NLayoutSider, NDrawer, NLayout, type LayoutSiderProps } from 'naive-ui'
import { useAppStore } from '@/store'

defineOptions({
  name: 'Layout'
})

const app = useAppStore()
const { device, layout, sidebar, showFooter, tagsView } = storeToRefs(app)
const route = useRoute()

const hasSider = computed(() => layout.value !== 'horizontal' && device.value === 'desktop')
const isShowFooter = computed(() => showFooter.value && !route.meta?.isIframe)

// 侧边栏配置常量
const SIDEBAR_COLLAPSED_WIDTH = 58
const RESPONSIVE_BREAKPOINTS = {
  mobile: 760,
  tablet: 990
} as const

/**
 * 侧边栏或抽屉组件
 * 根据设备和布局模式动态渲染
 */
const LayoutSiderOrDrawer = defineComponent({
  name: 'LayoutSiderOrDrawer',
  setup() {
    const siderProps = computed<LayoutSiderProps>(() => ({
      collapsedWidth: SIDEBAR_COLLAPSED_WIDTH,
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
 * 同步主题和侧边栏宽度的设置
 */
const updateThemeAndSidebar = () => {
  app.toggleTheme(app.overrideColor)

  const widthValue = hasSider.value ? (sidebar.value.opened ? sidebar.value.sidebarWidth : SIDEBAR_COLLAPSED_WIDTH) : 0

  document.body.style.setProperty('--sidebar-width', `${widthValue}px`)
  document.body.style.setProperty(
    '--layout-content-height',
    `calc(100% - var(--header-height) - ${isShowFooter.value ? 40 : 0}px)`
  )
}

// 每次设置更新时同步主题及侧边栏宽度
watchEffect(updateThemeAndSidebar)

/**
 * 响应式布局处理
 * 根据窗口宽度自动调整侧边栏和设备类型
 */
const layoutRef = ref<HTMLElement>()
useResizeObserver(layoutRef, ([entry]) => {
  const { width } = entry.contentRect

  if (width <= RESPONSIVE_BREAKPOINTS.mobile) {
    app.toggleSidebar(false, 'mobile')
  } else if (width <= RESPONSIVE_BREAKPOINTS.tablet) {
    app.toggleSidebar(false, 'desktop')
  } else {
    // 宽度大于990时，若未点击折叠则保持打开状态，否则关闭
    app.toggleSidebar(!sidebar.value.isClickCollapse, 'desktop')
  }
})

/**
 * 同步头部高度到 CSS 变量
 */
const layoutHeaderRef = ref<HTMLElement>()
useResizeObserver(layoutHeaderRef, ([entry]) => {
  const { height } = entry.contentRect
  document.body.style.setProperty('--header-height', `${height || 0}px`)
})
</script>
