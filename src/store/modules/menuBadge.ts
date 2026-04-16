import { defineStore } from 'pinia'
import type { MenuBadgeState, MenuBadge } from '../types'
import { isNumericText } from '@/utils/is'

export const useMenuBadgeStore = defineStore('menuBadge', {
  state: (): MenuBadgeState => ({
    serverMap: {},
    localMap: {}
  }),
  actions: {
    /**
     * 用后端返回的菜单标记全量覆盖基线数据。
     */
    hydrateServerBadges(record: Recordable<MenuBadge>) {
      this.serverMap = { ...record }
    },
    /**
     * 设置本地运行时标记覆盖值。
     */
    setLocalBadge(path: string, badge: MenuBadge) {
      if (!path) {
        return
      }

      const mergedBadge: MenuBadge = {
        ...(this.localMap[path] || {}),
        ...badge
      }

      const hasRenderableText = typeof mergedBadge.extraText === 'string' && mergedBadge.extraText.trim().length > 0
      if (!hasRenderableText) {
        delete this.localMap[path]
        return
      }

      this.localMap[path] = mergedBadge
    },
    /**
     * 清除单个本地标记覆盖值。
     */
    clearLocalBadge(path: string) {
      if (!path) {
        return
      }
      delete this.localMap[path]
    },
    /**
     * 清空全部本地标记覆盖值。
     */
    clearLocalBadges() {
      this.localMap = {}
    },
    /**
     * 获取菜单最终标记（本地覆盖优先）。
     */
    resolveBadge(path: string): MenuBadge | undefined {
      if (!path) {
        return undefined
      }

      const resolvedBadge: MenuBadge = {
        ...(this.serverMap[path] || {}),
        ...(this.localMap[path] || {})
      }

      if (typeof resolvedBadge.extraText !== 'string' || resolvedBadge.extraText.trim().length === 0) {
        return undefined
      }

      return resolvedBadge
    },
    /**
     * 对数字标记执行减法，仅更新本地覆盖值。
     */
    decreaseLocalBadge(path: string, step: number = 1) {
      if (!path) {
        return
      }

      const currentBadge = this.resolveBadge(path)
      if (typeof currentBadge?.extraText !== 'string' || !isNumericText(currentBadge?.extraText)) {
        return
      }

      const normalizedStep = Number.isFinite(step) && step > 0 ? Math.floor(step) : 1
      const nextValue = Math.max(0, Number(currentBadge?.extraText) - normalizedStep)

      this.setLocalBadge(path, {
        extraText: String(nextValue),
        extraType: currentBadge?.extraType
      })
    },
    /**
     * 同步后端标记（占位实现）。
     */
    async syncBadgesFromServer(): Promise<void> {
      console.warn('[menuBadge] 当前未接入后端刷新接口，syncBadgesFromServer 为占位实现。')
    },
    /**
     * 清空全部菜单标记状态（登出使用）。
     */
    resetAllBadges() {
      this.serverMap = {}
      this.localMap = {}
    }
  }
})
