import { isNavigationFailure, useRouter, type NavigationFailure, type RouteLocationRaw } from 'vue-router'

/**
 * 路由跳转 Hook。
 * 在组件中提供安全 push/replace，避免重复实现异常处理。
 */
export const useSafeNavigation = () => {
  const router = useRouter()

  const navigateSafely = async (navigateFn: () => Promise<void | NavigationFailure | undefined>): Promise<void> => {
    try {
      await navigateFn()
    } catch (error) {
      if (
        !isNavigationFailure(error) &&
        !(error instanceof Error && error.message.includes('Avoided redundant navigation'))
      ) {
        // 仅记录需要排查的导航异常，忽略重复导航噪音
        console.error('路由跳转失败:', error)
      }
    }
  }

  const push = async (to: RouteLocationRaw): Promise<void> => {
    await navigateSafely(() => router.push(to))
  }

  const replace = async (to: RouteLocationRaw): Promise<void> => {
    await navigateSafely(() => router.replace(to))
  }

  return {
    push,
    replace
  }
}
