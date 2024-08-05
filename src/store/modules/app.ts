import { defineStore } from 'pinia'
import { AppState } from '../interface'

export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    sidebar: {
      opened: false,
      withoutAnimation: false,
      // 判断是否手动点击Collapse
      isClickCollapse: false
    },
    device: 'desktop',
    size: 'default'
  }),
  getters: {},
  actions: {},
  persist: {
    storage: localStorage,
    paths: ['size', 'sidebar']
  }
})
