import { useRoute } from 'vue-router'
import { useMenuBadgeStore } from '@/store/modules/menuBadge'
import type { MenuBadge } from '@/store/types'

/**
 * 菜单标记操作 Hook。
 */
export const useMenuBadge = () => {
  const route = useRoute()
  const menuBadgeStore = useMenuBadgeStore()

  const setBadge = (path: string, badge: MenuBadge) => {
    menuBadgeStore.setLocalBadge(path, badge)
  }

  const decreaseBadge = (path: string, step: number = 1) => {
    menuBadgeStore.decreaseLocalBadge(path, step)
  }

  const clearBadge = (path: string) => {
    menuBadgeStore.clearLocalBadge(path)
  }

  const getBadge = (path: string): MenuBadge | undefined => {
    return menuBadgeStore.resolveBadge(path)
  }

  /**
   * 更新当前路由对应菜单标记。
   */
  const setCurrentBadge = (badge: MenuBadge) => {
    setBadge(route.path, badge)
  }

  /**
   * 对当前路由对应菜单标记减 1。
   */
  const decreaseCurrentBadge = (step: number = 1) => {
    decreaseBadge(route.path, step)
  }

  return {
    setBadge,
    decreaseBadge,
    clearBadge,
    getBadge,
    setCurrentBadge,
    decreaseCurrentBadge
  }
}
