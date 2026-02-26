import { defineStore } from 'pinia'
import { createHoverColor, createPressedColor } from 'naive-ui/lib/_utils/color'
import type { AppState } from '../../types'
import { ELV_APP } from '@/enums/cacheEnum'
import defaultState from './defaultState'

export const useAppStore = defineStore('app', {
  state: defaultState,
  getters: {
    getThemeOverridesCommon: (state) => {
      return Object.entries(state.overrideColor).reduce((result, [key, color]) => {
        return {
          ...result,
          [`${key}Color`]: color,
          [`${key}ColorHover`]: createHoverColor(color),
          [`${key}ColorPressed`]: createPressedColor(color),
          [`${key}ColorSuppl`]: createHoverColor(color)
        }
      }, {})
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
