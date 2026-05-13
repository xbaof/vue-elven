import type { Menu, MenuType } from '@/api/system/types'
import router from '@/router'
import { toPascal } from '@/utils'
import type { RouteRecordRaw } from 'vue-router'

const Iframe = () => import('@/layout/routerView/iframe.vue')
const NotFound = () => import('@/views/error/404.vue')
const modules = import.meta.glob('/src/views/**/*.vue')

// 根据组件路径动态获取视图组件
const getDynamicComponent = (path: string) => modules[`/src/views/${path}.vue`] || NotFound

/**
 * 根据 meta.sort 升序排序路由
 */
export const sortRoutesByMetaOrder = <T extends { meta?: { sort?: number | string } }>(
  routeList: T[],
  addDefaultSort: boolean = false
) => {
  if (addDefaultSort) {
    routeList.forEach((routeItem, index) => {
      if (routeItem.meta && routeItem.meta.sort == null) {
        routeItem.meta.sort = index + 2
      }
    })
  }

  return routeList.sort((a, b) => (Number(a.meta?.sort) || 0) - (Number(b.meta?.sort) || 0))
}

const resolveRouteFlags = (menuType: MenuType): { isLink: boolean; isIframe: boolean } => {
  if (menuType === '1') return { isLink: false, isIframe: true }
  if (menuType === '2') return { isLink: true, isIframe: false }
  return { isLink: false, isIframe: false }
}

const transformMenusToRoutes = (menus: Menu[]): Array<RouteRecordRaw> => {
  return menus.map((menu) => {
    const {
      menuType,
      menuName,
      name,
      path,
      component,
      icon,
      orderSort,
      activePath,
      isAffix,
      isHidden,
      isKeepAlive,
      linkUrl,
      isTagsView,
      extraText,
      extraType,
      query
    } = menu

    const route: Partial<RouteRecordRaw> = {
      path: path?.startsWith('/') ? path : `/${path}`,
      meta: { title: menuName, icon, sort: orderSort, extraText, extraType, query }
    }

    if (menu.children?.length) {
      route.children = transformMenusToRoutes(menu.children)
      route.redirect = route.children[0].path
    } else {
      route.name = toPascal(name || 'RouteName')
      const { isLink, isIframe } = resolveRouteFlags(menuType)

      if (!isLink) {
        route.component = isIframe ? Iframe : getDynamicComponent(component || '')
      }

      route.meta = {
        ...route.meta,
        activePath,
        isTagsView,
        isHidden,
        isKeepAlive,
        isAffix,
        isLink,
        linkUrl,
        isIframe
      }
    }

    return route as RouteRecordRaw
  })
}

/**
 * 根据后端菜单生成动态路由，并挂载到 Layout 下。
 * 返回值：最终 Layout children 路由数组。
 */
const generatorDynamicRouter = (asyncMenus: Menu[], layoutRoutes: RouteRecordRaw[]) => {
  const asyncRoutes = transformMenusToRoutes(asyncMenus)
  const layoutRoute = layoutRoutes.find((item) => item.name === 'Layout')
  if (!layoutRoute) {
    throw new Error('Layout route not found')
  }

  const allChildren = sortRoutesByMetaOrder([...(layoutRoute.children || []), ...asyncRoutes])

  if (router.hasRoute(layoutRoute.name!)) {
    router.removeRoute(layoutRoute.name!)
  }

  router.addRoute({ ...layoutRoute, children: allChildren })

  return allChildren
}

export default generatorDynamicRouter
