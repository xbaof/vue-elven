<template>
  <div
    class="navbar-container"
    :class="{
      isInverted: layout === 'horizontal' && sidebar.inverted && device !== 'mobile'
    }"
    :style="{ height }"
  >
    <navbarLeft />
    <div class="navbar-right">
      <!-- 菜单搜索 -->
      <search-menu class="navbar-right-item" />
      <!-- 系统消息 -->
      <notify-center class="navbar-right-item" />
      <!-- 布局配置 -->
      <theme-mode class="navbar-right-item" />
      <!-- 布局配置 -->
      <settings class="navbar-right-item" />
      <!-- 全屏 -->
      <full-screen class="navbar-right-item" />
      <!-- GitHub 链接 -->
      <github-link class="navbar-right-item" />
      <!-- 头像菜单 -->
      <Avatar />
    </div>
  </div>
  <TagsView v-if="app.tagsView.show" />
</template>
<script lang="ts" setup>
import { defineComponent, h, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/modules/app'
import Logo from '../sidebar/logo.vue'
import Collapse from '../sidebar/collapse.vue'
import Horizontal from '../sidebar/horizontal.vue'
import FullScreen from './components/fullScreen.vue'
import GithubLink from './components/githubLink.vue'
import NotifyCenter from './components/notifyCenter.vue'
import Breadcrumb from './components/breadcrumb.vue'
import Settings from './components/settings.vue'
import Avatar from './components/avatar.vue'
import ThemeMode from './components/themeMode.vue'
import TagsView from './components/tagsView.vue'
import SearchMenu from './components/searchMenu.vue'

defineOptions({
  name: 'LayoutHeader'
})

const app = useAppStore()
const { device, layout, sidebar } = storeToRefs(app)

// 头部高度常量
const HEADER_HEIGHT = {
  horizontal: '57px',
  default: '50px'
} as const

const height = computed(() =>
  layout.value === 'horizontal' && device.value === 'desktop' ? HEADER_HEIGHT.horizontal : HEADER_HEIGHT.default
)

/**
 * 导航栏左侧内容
 * 根据设备和布局模式动态渲染
 */
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
                    ? h(Logo, {
                        style: {
                          height: '100%',
                          'min-width': `${app.sidebar.sidebarWidth}px`
                        }
                      })
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
