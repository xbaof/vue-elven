import { defineStore } from 'pinia'
import { createHoverColor, createPressedColor } from 'naive-ui/lib/_utils/color'
import { AppState } from '../../interface'
import { ELV_APP } from '@/enums/cacheEnum'
import defaultState from './defaultState'

export const useAppStore = defineStore({
  id: 'app',
  state: defaultState,
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
    toggleTheme(colors: { primary?: string; success?: string; warning?: string; info?: string; error?: string }) {
      const html = document.documentElement as HTMLElement
      if (this.isDark) html.classList.add('dark')
      else html.classList.remove('dark')
      Object.keys(colors).forEach((key) => {
        this.overrideColor[key] = colors[key]
        document.body.style.setProperty(`--${key}-color`, colors[key])
      })
    }
  },
  persist: {
    key: ELV_APP,
    storage: localStorage
  }
})
