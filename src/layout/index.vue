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

const app = useAppStore()
const { device, layout, sidebar, showFooter, tagsView } = storeToRefs(app)
const hasSider = computed(() => layout.value !== 'horizontal' && device.value === 'desktop')
const route = useRoute()
const isShowFooter = computed(() => showFooter.value && !route.meta.isIframe)

const LayoutSiderOrDrawer = defineComponent(() => {
  return () => {
    const siderProps: LayoutSiderProps = {
      collapsedWidth: 58,
      width: sidebar.value.sidebarWidth,
      inverted: sidebar.value.inverted,
      contentClass: 'flex flex-col',
      collapseMode: 'width'
    }
    const siderContent = { default: () => h(Vertical) }

    return hasSider.value
      ? h(NLayoutSider, { ...siderProps, collapsed: !sidebar.value.opened }, siderContent)
      : device.value === 'mobile'
        ? h(
            NDrawer,
            {
              show: sidebar.value.opened,
              placement: 'left',
              width: sidebar.value.sidebarWidth,
              'onUpdate:show': (val: boolean) => (sidebar.value.opened = val)
            },
            {
              default: () =>
                h(
                  NLayout,
                  { class: 'wh-full', hasSider: true },
                  {
                    default: () => h(NLayoutSider, { ...siderProps, collapsed: false }, siderContent)
                  }
                )
            }
          )
        : null
  }
})

// 抽离函数：同步主题和侧边栏宽度的设置
const updateThemeAndSidebar = () => {
  app.toggleTheme(app.overrideColor)
  const widthValue = hasSider.value ? (sidebar.value.opened ? sidebar.value.sidebarWidth : 58) : 0
  document.body.style.setProperty('--sidebar-width', `${widthValue}px`)
  document.body.style.setProperty(
    '--layout-content-height',
    `calc(100% - var(--header-height) - ${isShowFooter.value ? 40 : 0}px)`
  )
}

// 每次依赖更新时同步主题及侧边栏宽度
watchEffect(updateThemeAndSidebar)

const layoutRef = ref()
useResizeObserver(layoutRef, ([entry]) => {
  const { width } = entry.contentRect
  if (width <= 760) {
    app.toggleSidebar(false, 'mobile')
  } else if (width <= 990) {
    app.toggleSidebar(false, 'desktop')
  } else {
    // 宽度大于990时，若未点击折叠则保持打开状态，否则关闭
    app.toggleSidebar(!sidebar.value.isClickCollapse, 'desktop')
  }
})

const layoutHeaderRef = ref()
useResizeObserver(layoutHeaderRef, ([entry]) => {
  const { height } = entry.contentRect
  document.body.style.setProperty('--header-height', `${height || 0}px`)
})
</script>
