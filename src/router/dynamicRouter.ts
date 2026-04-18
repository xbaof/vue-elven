import type { Menu, MenuType } from '@/api/system/types'
import router from '@/router'
import type { RouteRecordRaw } from 'vue-router'

const Iframe = () => import('@/layout/routerView/iframe.vue')
const NotFound = () => import('@/views/error/404.vue')

const modules = import.meta.glob('/src/views/**/*.vue')

// 根据组件路径动态获取视图组件
const getDynamicComponent = (path: string) => modules[`/src/views/${path}.vue`] || NotFound

// 首字母大写，用于生成与组件一致的 name
const toPascalCase = (name: string): string => name.replace(/( |^)[a-z]/g, (letter) => letter.toUpperCase())

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

  return routeList.sort((a, b) => {
    return (Number(a.meta?.sort) || 0) - (Number(b.meta?.sort) || 0)
  })
}

const resolveRouteFlags = (menuType: MenuType): { isLink: boolean; isIframe: boolean } => {
  switch (menuType) {
    case '1':
      return { isLink: false, isIframe: true }
    case '2':
      return { isLink: true, isIframe: false }
    default:
      return { isLink: false, isIframe: false }
  }
}

const transformMenusToRoutes = (menus: Menu[]): Array<RouteRecordRaw> => {
  return menus.map((menu) => {
    const {
      menuType,
      menuName,
      name,
      path,
      activePath,
      component,
      icon,
      orderSort,
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
      meta: {
        title: menuName,
        icon,
        sort: orderSort,
        extraText,
        extraType,
        query
      }
    }

    if (menu.children?.length) {
      route.children = transformMenusToRoutes(menu.children)
      route.redirect = route.children[0].path
    } else {
      route.name = toPascalCase(name || 'RouteName')
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
        isIframe,
        extraText,
        extraType,
        query
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

  const layoutClone: RouteRecordRaw = {
    ...layoutRoute,
    children: [...(layoutRoute.children || [])]
  }

  const allChildren = sortRoutesByMetaOrder([...(layoutClone.children || []), ...asyncRoutes])

  if (router.hasRoute(layoutClone.name!)) {
    router.removeRoute(layoutClone.name!)
  }

  layoutClone.children = allChildren
  router.addRoute(layoutClone)

  return allChildren
}

export default generatorDynamicRouter
