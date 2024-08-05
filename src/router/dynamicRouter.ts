import type { RouteRecordRaw } from 'vue-router'
import router, { routes } from '@/router'
export const Iframe = () => import('@/layout/routerView/iframe.vue')
export const NotFound = () => import('@/views/error/404.vue')

const modules = import.meta.glob('/src/views/**/*.vue')

// 根据路径，动态获取vue组件
const getDynamicComponent = (path: string) => {
  const component = modules[`/src/views/${path}.vue`]
  if (!component) return NotFound
  return component
}
// 首字母大写 用来生成组件Name，首字母大写后的Name要和组件name相同 不然keep-alive不生效
const nameCase = (name: string): string => name.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())

// 按照路由中meta下的sort升序来排序路由
const ascending = (arr) => {
  arr.forEach((v) => {
    if (v?.meta?.sort === null) v.meta.sort = undefined
  })
  return arr.sort((a, b) => {
    return a?.meta?.sort - b?.meta?.sort
  })
}

const filterAsyncRoute = (menus: System.Menu[], parentPaths: string[] = []): Array<RouteRecordRaw> => {
  return menus.map((menu) => {
    const {
      path,
      component,
      menuName,
      icon,
      orderSort,
      isLink,
      isAffix,
      isHidden,
      isCache,
      linkUrl,
      isIframe,
      isTagsView
    } = menu
    const route: Partial<RouteRecordRaw> = {
      meta: {
        title: menuName,
        icon: icon
      }
    }
    if (menu.children?.length > 0) {
      route.path = parentPaths.length > 0 ? `/${parentPaths.join('/')}/${path}` : `/${path}`
      route.children = filterAsyncRoute(menu.children, parentPaths.concat(path))
      route.redirect = route.children[0].path
    } else {
      route.path = parentPaths.length > 0 ? `/${parentPaths.join('/')}/${path}` : `/${path}`
      route.name = nameCase(path)
      if (!isLink) route.component = isIframe ? Iframe : getDynamicComponent(component)
      route.meta = {
        ...route.meta,
        ...{
          noTagsView: !isTagsView,
          isHide: isHidden,
          isKeepAlive: isCache,
          isAffix: isAffix,
          isLink: isLink,
          linkUrl: linkUrl,
          sort: orderSort
        }
      }
    }
    return route as RouteRecordRaw
  })
}
const filterHideRoute = (routes: RouteRecordRaw[]): RouteRecordRaw[] => {
  return ascending(
    routes
      .filter((o) => !o.meta?.isHide)
      .map((route) => {
        if (route.children?.length) {
          route.children = filterHideRoute(route.children)
        }
        return route
      })
  )
}

/**
 * 动态生成路由及菜单
 */
const generatorDynamicRouter = (asyncMenus: System.Menu[]) => {
  try {
    const asyncRoutes = filterAsyncRoute(asyncMenus)
    const layout = routes.find((item) => item.name === 'Layout')!
    const menus = [...layout.children, ...asyncRoutes]
    // 将layout路由删除
    router.removeRoute(layout.name)
    layout.children = menus
    // 重新添加
    router.addRoute(layout)
    // 返回排序并过滤隐藏的路由
    return filterHideRoute(menus)
  } catch (error) {
    console.error('生成路由时出错', error)
    return Promise.reject(`生成路由时出错: ${error}`)
  }
}

export default generatorDynamicRouter
