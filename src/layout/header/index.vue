<template>
  <div
    class="navbar-container"
    :class="{ isInverted: layout === 'horizontal' && sidebar.inverted && device !== 'mobile' }"
    :style="{ height }"
  >
    <navbarLeft />
    <div class="navbar-right">
      <!-- 菜单搜索 -->
      <search-menu class="navbar-right-item" />
      <!-- 布局配置 -->
      <theme-mode class="navbar-right-item" />
      <!-- 布局配置 -->
      <settings class="navbar-right-item" />
      <!-- 全屏 -->
      <full-screen class="navbar-right-item" />
      <!-- 头像菜单 -->
      <avater />
    </div>
  </div>
  <TagsView v-if="app.tagsView.show" />
</template>
<script lang="ts" setup>
defineOptions({
  name: 'LayoutHeader'
})
import Logo from '../sidebar/logo.vue'
import Collapse from '../sidebar/collapse.vue'
import Horizontal from '../sidebar/horizontal.vue'
import FullScreen from './components/fullScreen.vue'
import Breadcrumb from './components/breadcrumb.vue'
import Settings from './components/settings.vue'
import Avater from './components/avater.vue'
import ThemeMode from './components/themeMode.vue'
import TagsView from './components/tagsView.vue'
import SearchMenu from './components/searchMenu.vue'
import { defineComponent, h, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store'
const app = useAppStore()
const { device, layout, sidebar } = storeToRefs(app)
const height = computed(() => (layout.value === 'horizontal' && device.value === 'desktop' ? '57px' : '50px'))

const navbarLeft = defineComponent({
  render() {
    return h(
      'div',
      {
        class: ['navbar-left']
      },
      {
        default: () => [
          device.value === 'mobile'
            ? h(Collapse, {
                iconSize: 22,
                class: 'navbar-right-item pl-14 pr-14',
                style: { width: 'auto' },
                onClick: () => {
                  app.toggleSidebar(app.sidebar.opened)
                }
              })
            : layout.value === 'horizontal'
              ? [
                  app.sidebar.showLogo
                    ? h(Logo, { style: { height: '100%', 'min-width': `${app.sidebar.sidebarWidth}px` } })
                    : null,
                  h(Horizontal)
                ]
              : layout.value === 'vertical'
                ? h(Breadcrumb, { class: 'ml-14' })
                : h(Horizontal)
        ]
      }
    )
  }
})
</script>
