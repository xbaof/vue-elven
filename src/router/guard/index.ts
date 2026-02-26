import { useAuthStore, usePermissionStore, useUserStore } from '@/store'
import type { Router } from 'vue-router'

// 白名单路由
const whiteList = ['/login', '/redirect']

function createBeforeEachGuard(router: Router) {
  return async (to: any, from: any, next: any) => {
    window.$loadingBar.start()
    const authStore = useAuthStore()
    const token = authStore.getToken

    // 已登录
    if (token) {
      if (to.path === '/login') {
        next({ path: '/' })
        return
      }

      const permissionStore = usePermissionStore()
      // 首次登录或刷新页面时，拉取用户权限并生成动态路由
      if (!permissionStore.isDynamicRouteAdded) {
        try {
          const userStore = useUserStore()
          await Promise.all([userStore.fetchUserInfo(), permissionStore.buildRoutes()])
          if (!router.hasRoute(to.name || '')) {
            if (to.path === '/404' && to.redirectedFrom !== undefined) {
              next({
                path: to.redirectedFrom?.fullPath,
                replace: true,
                query: to.query
              })
            } else {
              next({ ...to, replace: true })
            }
          } else {
            next()
          }
        } catch {
          authStore.resetAuth()
          next('/login')
        }
      } else {
        next()
      }
    } else {
      if (whiteList.includes(to.path)) {
        next()
      } else {
        next('/login')
      }
    }
  }
}

function createAfterEachGuard() {
  return () => {
    window.$loadingBar.finish()
  }
}

export function setupRouterGuard(router: Router) {
  router.beforeEach(createBeforeEachGuard(router))
  router.afterEach(createAfterEachGuard())
}

export default setupRouterGuard
