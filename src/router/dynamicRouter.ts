import type { RouteRecordRaw } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import router, { routes } from '@/router'
import { h } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

const Iframe = () => import('@/layout/routerView/iframe.vue')
const NotFound = () => import('@/views/error/404.vue')

const modules = import.meta.glob('/src/views/**/*.vue')

// 根据路径，动态获取vue组件
const getDynamicComponent = (path: string) => {
  const component = modules[`/src/views/${path}.vue`]
  if (!component) return NotFound
  return component
}
// 首字母大写 用来生成组件Name，首字母大写后的Name要和组件name相同 不然keep-alive不生效
const nameCase = (name: string): string => name.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())

export const ascending = (arr) => {
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
      path: parentPaths.length > 0 ? `/${parentPaths.join('/')}/${path}` : `/${path}`,
      meta: {
        title: menuName,
        icon: icon
      }
    }

    if (menu.children?.length > 0) {
      route.children = filterAsyncRoute(menu.children, parentPaths.concat(path))
      route.redirect = route.children[0].path
    } else {
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

const filterMenuOptions = (routes: RouteRecordRaw[]): MenuOption[] => {
  return routes.map((route) => {
    const { path, meta } = route
    const menuOption: Partial<MenuOption> = {
      key: path,
      label: meta?.title,
      icon: meta?.icon ? () => h(SvgIcon, { icon: meta?.icon as string }) : null,
      noTagsView: !meta?.isTagsView,
      show: !meta?.isHide,
      isKeepAlive: meta?.isCache,
      isAffix: meta?.isAffix,
      isLink: meta?.isLink,
      linkUrl: meta?.linkUrl,
      sort: meta?.orderSort
    }
    if (route.children && route.children.length > 0) {
      menuOption.children = filterMenuOptions(route.children)
    }
    return menuOption
  })
}

/**
 * @description 动态生成路由并返回菜单
 */
const generatorDynamicRouter = (asyncMenus: System.Menu[]) => {
  try {
    const asyncRoutes = filterAsyncRoute(asyncMenus)
    const layout = routes.find((item) => item.name === 'Layout')!
    const allRoutes = [...layout.children, ...asyncRoutes]
    // 将layout路由删除
    router.removeRoute(layout.name)
    layout.children = allRoutes
    // 重新添加
    router.addRoute(layout)
    // 返回排序并过滤隐藏的菜单
    return filterMenuOptions(ascending(allRoutes))
  } catch (error) {
    console.error('生成路由时出错', error)
    return Promise.reject(`生成路由时出错: ${error}`)
  }
}

export default generatorDynamicRouter
