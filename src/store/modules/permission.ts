import { defineStore } from 'pinia'
import type { PermissionState } from '../types'
import { getPermission } from '@/api/system/auth'
import { basicLayoutRoutes } from '@/router/staticRoutes'
import generatorDynamicRouter from '@/router/dynamicRouter'
import { collectRouteBadgeMap } from '@/utils/menu'
import { useMenuBadgeStore } from './menuBadge'
import type { RouteRecordRaw, Router } from 'vue-router'

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    isDynamicRouteAdded: false,
    buildingPromise: null,
    routes: [],
    roles: [],
    perms: []
  }),
  actions: {
    /**
     * 从后端拉取菜单与权限，并基于菜单生成动态路由。
     */
    async buildRoutes(): Promise<RouteRecordRaw[]> {
      if (this.isDynamicRouteAdded && this.routes.length) return this.routes
      if (this.buildingPromise) return this.buildingPromise

      this.buildingPromise = (async () => {
        const { data } = await getPermission()
        const { perms, menus, roles } = data
        const menuBadgeStore = useMenuBadgeStore()

        this.perms = perms
        this.roles = roles || []

        const asyncRoutes = generatorDynamicRouter(menus, basicLayoutRoutes)
        menuBadgeStore.clearLocalBadges()
        menuBadgeStore.hydrateServerBadges(collectRouteBadgeMap(asyncRoutes))
        this.routes = asyncRoutes
        this.isDynamicRouteAdded = true
        return asyncRoutes
      })()

      try {
        return await this.buildingPromise
      } finally {
        this.buildingPromise = null
      }
    },

    /**
     * 重置路由，仅移除 Layout 相关动态子路由。
     */
    resetRoutes(router: Router): void {
      const layoutRoute = basicLayoutRoutes.find((r) => r.name === 'Layout')
      if (layoutRoute?.name && router.hasRoute(layoutRoute.name)) {
        router.removeRoute(layoutRoute.name)
      }
    },

    /**
     * 重置权限状态。
     */
    resetPermission(router?: Router): void {
      if (router) this.resetRoutes(router)
      this.buildingPromise = null
      this.$reset()
    }
  }
})
