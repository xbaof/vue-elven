import { defineStore } from 'pinia'
import { SettingState } from '../interface'

export const useSettingStore = defineStore({
  id: 'setting',
  state: (): SettingState => ({
    theme: 'light',
    primary: '#409eff',
    // 显示标签页
    showTagsView: true,
    // 显示logo
    showLogo: true,
    // 侧边栏宽度
    sidebarWidth: 210,
    // 菜单手风琴
    accordion: true,
    // 菜单主题反转
    inverted: true,
    isUnFold: false
  }),
  getters: {},
  actions: {
    setLayout(value: 'vertical' | 'horizontal' | 'mix') {
      this.layout = value
    }
  },
  persist: {
    storage: localStorage,
    paths: ['layout']
  }
})
