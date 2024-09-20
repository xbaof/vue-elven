<template>
  <n-layout ref="layoutRef" class="wh-full" :has-sider="hasSider">
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
    <n-layout>
      <n-layout-header :inverted="layout === 'horizontal' && sidebar.inverted && device !== 'mobile'">
        <LayoutHeader />
      </n-layout-header>
      <n-layout-content>
        <LayoutMain />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useResizeObserver } from '@vueuse/core'
import LayoutMain from './routerView/main.vue'
import LayoutHeader from './header/index.vue'
import Vertical from './sidebar/vertical.vue'
import { useAppStore } from '@/store'
const app = useAppStore()
const { device, layout, sidebar } = storeToRefs(app)
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
