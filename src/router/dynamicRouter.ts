import type { RouteRecordRaw } from 'vue-router'
import type { Menu } from '@/api/system/types'
import router from '@/router'

const Iframe = () => import('@/layout/routerView/iframe.vue')
const NotFound = () => import('@/views/error/404.vue')

const modules = import.meta.glob('/src/views/**/*.vue')

// 根据路径，动态获取vue组件
const getDynamicComponent = (path: string) => modules[`/src/views/${path}.vue`] || NotFound

// 首字母大写 用来生成组件Name，首字母大写后的Name要和组件name相同 不然keep-alive不生效
const toPascalCase = (name: string): string => name.replace(/( |^)[a-z]/g, (letter) => letter.toUpperCase())

/**
 * 根据路由数据中的sort字段对路由进行升序排序
 * @param arr 要排序的路由数组
 * @param addDefaultSort 是否为没有sort值的路由添加默认sort值
 */
export const sortRoutesByMetaOrder = <T extends { meta?: { sort?: number | string } }>(
  arr: T[],
  addDefaultSort: boolean = false
) => {
  if (addDefaultSort) {
    arr.forEach((v, index) => {
      if (v?.meta && v.meta.sort == null) v.meta.sort = index + 2
    })
  }
  return arr.sort((a, b) => {
    return (Number(a.meta?.sort) || 0) - (Number(b.meta?.sort) || 0)
  })
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
      isTagsView
    } = menu

    const route: Partial<RouteRecordRaw> = {
      path: path?.startsWith('/') ? path : `/${path}`,
      meta: {
        title: menuName,
        icon,
        sort: orderSort
      }
    }

    if (menu?.children && menu.children.length > 0) {
      route.children = transformMenusToRoutes(menu.children)
      route.redirect = route.children[0].path
    } else {
      route.name = toPascalCase(name || 'RouteName')
      const isLink = menuType === '2'
      const isIframe = menuType === '1'
      if (!isLink) route.component = isIframe ? Iframe : getDynamicComponent(component || '')
      route.meta = {
        ...route.meta,
        ...{
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
    }
    return route as RouteRecordRaw
  })
}

/**
 * 根据后端菜单生成动态路由，并挂载到 Layout 下
 * 返回值：最终的 Layout children 路由数组
 */
const generatorDynamicRouter = (asyncMenus: Menu[], layoutRoutes: RouteRecordRaw[]) => {
  const asyncRoutes = transformMenusToRoutes(asyncMenus)
  const layout = layoutRoutes.find((item) => item.name === 'Layout')
  if (!layout) {
    throw new Error('Layout route not found')
  }
  const layoutClone: RouteRecordRaw = {
    ...layout,
    children: [...(layout.children || [])]
  }
  const allChildren = sortRoutesByMetaOrder([...(layoutClone.children || []), ...asyncRoutes])

  // 先移除旧的 Layout，再添加新的 Layout 及其子路由
  if (router.hasRoute(layoutClone.name!)) {
    router.removeRoute(layoutClone.name!)
  }
  layoutClone.children = allChildren
  router.addRoute(layoutClone)

  return allChildren
}

export default generatorDynamicRouter
