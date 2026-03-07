import { useAuthStore } from '@/store/modules/auth'
import { usePermissionStore } from '@/store/modules/permission'
import { useUserStore } from '@/store/modules/user'
import type { RouteLocationNormalized, Router } from 'vue-router'

// 白名单路由
const whiteList = ['/login', '/redirect']

function createBeforeEachGuard(router: Router) {
  return async (to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
    window.$loadingBar.start()
    const authStore = useAuthStore()
    const token = authStore.getToken

    // 已登录
    if (token) {
      if (to.path === '/login') {
        return { path: '/' }
      }

      const permissionStore = usePermissionStore()
      // 首次登录或刷新时，拉取用户信息并挂载动态路由
      if (!permissionStore.isDynamicRouteAdded) {
        try {
          const userStore = useUserStore()
          await Promise.all([userStore.fetchUserInfo(), permissionStore.buildRoutes()])
          const toName = to.name
          if (!toName || !router.hasRoute(toName)) {
            if (to.path === '/404' && to.redirectedFrom !== undefined) {
              return {
                path: to.redirectedFrom?.fullPath,
                replace: true,
                query: to.query
              }
            }
            return {
              path: to.path,
              query: to.query,
              hash: to.hash,
              replace: true
            }
          }
        } catch {
          authStore.resetAuth()
          return '/login'
        }
      }
      return
    }

    if (whiteList.includes(to.path)) {
      return
    }
    return '/login'
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
