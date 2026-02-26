import { defineStore } from 'pinia'
import type { PermissionState } from '../types'
import { getPermission } from '@/api/system/auth'
import { basicLayoutRoutes } from '@/router/staticRoutes'
import generatorDynamicRouter from '@/router/dynamicRouter'
import { useRouter } from 'vue-router'

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    isDynamicRouteAdded: false,
    routes: [],
    roles: [],
    perms: []
  }),
  actions: {
    /**
     * 从后端拉取菜单与权限，并基于菜单构建动态路由
     */
    async buildRoutes() {
      const permissionRes = await getPermission()
      const { perms, menus, roles } = permissionRes.data
      this.perms = perms
      if (roles && roles.length) {
        this.roles = roles
      }

      const asyncRoutes = generatorDynamicRouter(menus, basicLayoutRoutes)
      this.routes = asyncRoutes
      this.isDynamicRouteAdded = true
      return asyncRoutes
    },
    /** 重置路由 */
    resetRoutes() {
      const router = useRouter()
      // 仅重置 Layout 相关的动态子路由
      const layout = basicLayoutRoutes.find((item) => item.name === 'Layout')
      if (layout && router.hasRoute(layout.name!)) {
        router.removeRoute(layout.name!)
      }
    },
    resetPermission() {
      this.resetRoutes()
      this.isDynamicRouteAdded = false
      this.$reset()
    }
  }
})
