<template>
  <n-layout ref="layoutRef" class="wh-full" :has-sider="hasSider" content-class="flex">
    <n-layout-sider
      v-if="hasSider"
      :collapsed-width="58"
      :width="sidebar.sidebarWidth"
      :collapsed="!sidebar.opened"
      :inverted="sidebar.inverted"
      content-class="flex flex-col"
      collapse-mode="width"
    >
      <vertical />
    </n-layout-sider>
    <n-drawer
      v-else-if="device === 'mobile'"
      v-model:show="sidebar.opened"
      placement="left"
      :width="sidebar.sidebarWidth"
    >
      <n-layout class="wh-full" has-sider>
        <n-layout-sider
          :collapsed-width="58"
          :width="sidebar.sidebarWidth"
          :collapsed="false"
          :inverted="sidebar.inverted"
          content-class="flex flex-col"
          collapse-mode="width"
        >
          <vertical />
        </n-layout-sider>
      </n-layout>
    </n-drawer>
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
import { ref, computed, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useResizeObserver } from '@vueuse/core'
import LayoutMain from './routerView/main.vue'
import LayoutHeader from './header/index.vue'
import CloseFull from './header/components/closeFull.vue'
import Footer from './footer/index.vue'
import Vertical from './sidebar/vertical.vue'
import { useAppStore } from '@/store'

const app = useAppStore()
const { device, layout, sidebar, showFooter, tagsView } = storeToRefs(app)
const hasSider = computed(() => layout.value !== 'horizontal' && device.value === 'desktop')
const route = useRoute()
const isShowFooter = computed(() => showFooter.value && !route.meta.isIframe)

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
