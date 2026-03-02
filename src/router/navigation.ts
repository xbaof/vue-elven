import { isNavigationFailure, type RouteLocationRaw, type Router } from 'vue-router'

const isIgnorableNavigationError = (error: unknown): boolean => {
  if (isNavigationFailure(error)) {
    return true
  }

  if (error instanceof Error) {
    return error.message.includes('Avoided redundant navigation')
  }

  return false
}

const logNavigationError = (error: unknown): void => {
  if (!isIgnorableNavigationError(error)) {
    // 仅记录需要排查的异常，忽略重复导航噪音。
    console.error('路由跳转失败:', error)
  }
}

export const safeRouterPush = async (router: Router, to: RouteLocationRaw): Promise<void> => {
  try {
    await router.push(to)
  } catch (error) {
    logNavigationError(error)
  }
}

export const safeRouterReplace = async (router: Router, to: RouteLocationRaw): Promise<void> => {
  try {
    await router.replace(to)
  } catch (error) {
    logNavigationError(error)
  }
}
