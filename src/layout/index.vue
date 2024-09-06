<template>
  <n-layout ref="layoutRef" :class="['wh-full', set.classes]" content-class="app-wapper" :has-sider="set.hasSider">
    <div v-show="device === 'mobile' && sidebar.opened" class="app-mask" @click="app.toggleSidebar(sidebar.opened)" />
    <n-layout-sider
      v-if="set.hasSider"
      :collapsed-width="58"
      :width="sidebar.sidebarWidth"
      :collapsed="set.collapsed"
      :inverted="sidebar.inverted"
      content-class="flex flex-col"
      collapse-mode="width"
    >
      <vertical />
    </n-layout-sider>
    <n-layout content-class="main-container">
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
import { ref, reactive, computed, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useResizeObserver } from '@vueuse/core'
import LayoutMain from './routerView/main.vue'
import LayoutHeader from './header/index.vue'
import Vertical from './sidebar/vertical.vue'
import { useAppStore } from '@/store'
const app = useAppStore()
const { device, layout, sidebar } = storeToRefs(app)

const set = reactive({
  hasSider: computed(() => layout.value !== 'horizontal' || device.value === 'mobile'),
  headerHeight: computed(() => (layout.value === 'horizontal' && device.value === 'desktop' ? '57px' : '50px')),
  collapsed: computed(() => !sidebar.value.opened && device.value !== 'mobile'),
  mainLeft: computed(() => (layout.value === 'horizontal' ? '0px' : `${sidebar.value.sidebarWidth}px`)),
  sidebarTransform: computed(() => `translate3d(-${sidebar.value.opened ? 0 : sidebar.value.sidebarWidth}px, 0, 0)`),
  classes: computed(() => {
    return {
      collapsed: set.collapsed && layout.value !== 'horizontal',
      mobile: device.value === 'mobile'
    }
  })
})

const overrideColor = computed(() => app.overrideColor)
watchEffect(() => {
  app.toggleOverrideColor(overrideColor.value)
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

<style lang="scss">
.app-mask {
  position: absolute;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background: #000000;
  opacity: 0.3;
}

.collapsed {
  .main-container {
    margin-left: 58px;
  }
}

.n-layout-header {
  height: v-bind('set.headerHeight');
}

.main-container {
  margin-left: v-bind('set.mainLeft');
  transition: all 0.3s;
}

.mobile {
  .main-container {
    margin-left: 0 !important;
  }

  .n-layout-sider {
    transform: v-bind('set.sidebarTransform');
  }
}
</style>
