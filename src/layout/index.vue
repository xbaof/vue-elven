<template>
  <n-layout
    ref="layoutRef"
    class="wh-full"
    :has-sider="hasSider"
    content-class="flex"
    content-style="position: relative"
  >
    <n-layout-sider
      v-show="!tagsView.fullScreen"
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
    <n-layout content-class="flex flex-col">
      <n-layout-header
        v-show="!tagsView.fullScreen"
        :inverted="layout === 'horizontal' && sidebar.inverted && device !== 'mobile'"
      >
        <LayoutHeader />
      </n-layout-header>
      <n-layout-content embedded :native-scrollbar="false">
        <LayoutMain />
        <n-back-top />
        <CloseFull />
      </n-layout-content>
      <n-layout-footer v-if="showFooter">
        <LayoutFooter />
      </n-layout-footer>
    </n-layout>
  </n-layout>
</template>
<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useResizeObserver } from '@vueuse/core'
import LayoutMain from './routerView/main.vue'
import LayoutHeader from './header/index.vue'
import CloseFull from './header/components/closeFull.vue'
import LayoutFooter from './footer/index.vue'
import Vertical from './sidebar/vertical.vue'
import { useAppStore } from '@/store'
const app = useAppStore()
const { device, layout, sidebar, showFooter, tagsView } = storeToRefs(app)
const hasSider = computed(() => layout.value !== 'horizontal' && device.value === 'desktop')
watchEffect(() => {
  app.toggleOverrideColor(app.overrideColor)
})

const layoutRef = ref()
useResizeObserver(layoutRef, (entries) => {
  const entry = entries[0]
  const { width } = entry.contentRect
  if (width <= 760) {
    app.toggleSidebar(false, 'mobile')
  } else if (width > 760 && width <= 990) {
    app.toggleSidebar(false, 'desktop')
  } else if (width > 990 && !sidebar.value.isClickCollapse) {
    app.toggleSidebar(true, 'desktop')
  } else {
    app.toggleSidebar(false, 'desktop')
  }
})
</script>
