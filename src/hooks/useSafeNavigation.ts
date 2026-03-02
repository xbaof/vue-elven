import { useRouter, type RouteLocationRaw } from 'vue-router'
import { safeRouterPush, safeRouterReplace } from '@/router/navigation'

/**
 * 路由跳转 Hook：
 * 在组件内直接提供安全 push/replace，避免重复传 router 实例。
 */
export const useSafeNavigation = () => {
  const router = useRouter()

  const push = async (to: RouteLocationRaw): Promise<void> => {
    await safeRouterPush(router, to)
  }

  const replace = async (to: RouteLocationRaw): Promise<void> => {
    await safeRouterReplace(router, to)
  }

  return {
    push,
    replace
  }
}
