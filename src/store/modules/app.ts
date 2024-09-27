import { defineStore } from 'pinia'
import { createHoverColor, createPressedColor } from 'naive-ui/lib/_utils/color'
import { AppState } from '../interface'
import { useThemeVars } from 'naive-ui'

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    layout: 'vertical',
    device: 'desktop',
    isDark: false,
    overrideColor: {
      primary: '#409eff',
      info: '#909399',
      success: '#67c23a',
      warning: '#e6a23c',
      error: '#f56c6c'
    },
    sidebar: {
      // 展开
      opened: true,
      // 判断是否手动点击Collapse
      isClickCollapse: false,
      // 显示logo
      showLogo: true,
      // 侧边栏宽度
      sidebarWidth: 210,
      // 菜单手风琴
      accordion: true,
      // 主题反转
      inverted: true
    },
    // 显示Footer
    showFooter: false,
    // 显示标签页
    showTagsView: true,
    watermark: {
      show: false,
      content: 'vue-elven'
    },
    breadcrumb: {
      // 面包屑图标
      showIcon: true,
      // 面包屑下拉
      dropdown: false
    }
  }),
  getters: {
    getThemeOverridesCommon(state) {
      const result = {}
      Object.keys(state.overrideColor).forEach((key) => {
        const color = state.overrideColor[key]
        result[`${key}Color`] = color
        result[`${key}ColorHover`] = createHoverColor(color)
        result[`${key}ColorPressed`] = createPressedColor(color)
        result[`${key}ColorSuppl`] = createHoverColor(color)
      })
      return result
    }
  },
  actions: {
    toggleSidebar(opened: boolean, device?: AppState['device']) {
      if (device) {
        this.sidebar.opened = opened
        this.device = device
      } else {
        this.sidebar.opened = !opened
        this.sidebar.isClickCollapse = opened
      }
    },
    toggleOverrideColor(colors: {
      primary?: string
      success?: string
      warning?: string
      info?: string
      error?: string
    }) {
      Object.keys(colors).forEach((key) => {
        this.overrideColor[key] = colors[key]
        document.body.style.setProperty(`--${key}-color`, colors[key])
      })
    }
  },
  persist: {
    storage: localStorage
  }
})
