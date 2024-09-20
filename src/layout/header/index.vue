<template>
  <div class="navbar-container" :style="{ height }">
    <navbarLeft />
    <div class="navbar-right">
      <!-- 菜单搜索 -->
      <search-menu class="navbar-right-item" />
      <!-- 布局配置 -->
      <theme-mode class="navbar-right-item" />
      <!-- 布局配置 -->
      <settings class="navbar-right-item" />
      <!-- 全屏 -->
      <screenfull class="navbar-right-item" />
      <!-- 头像菜单 -->
      <avater />
    </div>
  </div>
  <TagsView v-if="app.showTagsView" />
</template>
<script lang="ts" setup>
defineOptions({
  name: 'LayoutHeader'
})
import Logo from '../sidebar/logo.vue'
import Collapse from '../sidebar/collapse.vue'
import Horizontal from '../sidebar/horizontal.vue'
import Screenfull from './components/screenfull.vue'
import Breadcrumb from './components/breadcrumb.vue'
import Settings from './components/settings.vue'
import Avater from './components/avater.vue'
import ThemeMode from './components/themeMode.vue'
import TagsView from './components/tagsView.vue'
import SearchMenu from './components/searchMenu.vue'
import { defineComponent, h, computed } from 'vue'
import { useAppStore } from '@/store'
const app = useAppStore()
const height = computed(() => (app.layout === 'horizontal' && app.device === 'desktop' ? '57px' : '50px'))

const navbarLeft = defineComponent({
  render() {
    return h(
      'div',
      {
        class: ['navbar-left']
      },
      {
        default: () => [
          app.device === 'mobile'
            ? h(Collapse, {
                iconSize: 22,
                class: 'navbar-right-item pl-14 pr-14',
                style: { width: 'auto' },
                onClick: () => {
                  app.toggleSidebar(app.sidebar.opened)
                }
              })
            : app.layout === 'horizontal'
              ? [
                  app.sidebar.showLogo
                    ? h(Logo, { style: { height: '100%', 'min-width': `${app.sidebar.sidebarWidth}px` } })
                    : null,
                  h(Horizontal)
                ]
              : app.layout === 'vertical'
                ? h(Breadcrumb, { class: 'pl-14' })
                : h(Horizontal)
        ]
      }
    )
  }
})
</script>
