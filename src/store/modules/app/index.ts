import { defineStore } from 'pinia'
import { createHoverColor, createPressedColor } from 'naive-ui/lib/_utils/color'
import type { AppState } from '../../types'
import { ELV_APP } from '@/enums/cacheEnum'
import defaultState from './defaultState'

export const useAppStore = defineStore('app', {
  state: defaultState,
  getters: {
    getThemeOverridesCommon: (state) => {
      const themeOverridesCommon: Recordable<string> = {}

      Object.entries(state.overrideColor).forEach(([key, color]) => {
        themeOverridesCommon[`${key}Color`] = color
        themeOverridesCommon[`${key}ColorHover`] = createHoverColor(color)
        themeOverridesCommon[`${key}ColorPressed`] = createPressedColor(color)
        themeOverridesCommon[`${key}ColorSuppl`] = createHoverColor(color)
      })

      return themeOverridesCommon
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
    toggleTheme(colors: Recordable<string>) {
      const html = document.documentElement as HTMLElement
      html.classList.toggle('dark', this.isDark)

      const colorKeys = Object.keys(this.overrideColor) as (keyof typeof this.overrideColor)[]
      colorKeys.forEach((key) => {
        const color = colors[key]
        if (color) {
          this.overrideColor[key] = color
          document.body.style.setProperty(`--${key}-color`, color)
        }
      })
    }
  },
  persist: {
    key: ELV_APP,
    storage: localStorage
  }
})
