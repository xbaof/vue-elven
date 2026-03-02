import { defineStore } from 'pinia'
import type { PermissionState } from '../types'
import { getPermission } from '@/api/system/auth'
import { basicLayoutRoutes } from '@/router/staticRoutes'
import generatorDynamicRouter from '@/router/dynamicRouter'
import type { RouteRecordRaw, Router } from 'vue-router'

let buildingRoutesPromise: Promise<RouteRecordRaw[]> | null = null

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    isDynamicRouteAdded: false,
    routes: [],
    roles: [],
    perms: []
  }),
  actions: {
    /**
     * 从后端拉取菜单与权限，并基于菜单生成动态路由。
     */
    async buildRoutes(): Promise<RouteRecordRaw[]> {
      if (this.isDynamicRouteAdded && this.routes.length > 0) {
        return this.routes
      }

      if (buildingRoutesPromise) {
        return buildingRoutesPromise
      }

      buildingRoutesPromise = (async (): Promise<RouteRecordRaw[]> => {
        const permissionResponse = await getPermission()
        const { perms, menus, roles } = permissionResponse.data
        this.perms = perms
        if (roles && roles.length) {
          this.roles = roles
        }

        const asyncRoutes = generatorDynamicRouter(menus, basicLayoutRoutes)
        this.routes = asyncRoutes
        this.isDynamicRouteAdded = true
        return asyncRoutes
      })()

      try {
        return await buildingRoutesPromise
      } finally {
        buildingRoutesPromise = null
      }
    },
    /**
     * 重置路由，仅移除 Layout 相关动态子路由。
     */
    resetRoutes(router: Router): void {
      const layoutRoute = basicLayoutRoutes.find((item) => item.name === 'Layout')
      if (layoutRoute && router.hasRoute(layoutRoute.name!)) {
        router.removeRoute(layoutRoute.name!)
      }
    },
    /**
     * 重置权限状态。
     */
    resetPermission(router?: Router): void {
      if (router) {
        this.resetRoutes(router)
      }
      buildingRoutesPromise = null
      this.$reset()
    }
  }
})
