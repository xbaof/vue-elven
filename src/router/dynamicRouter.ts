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
  arr.forEach((v, index) => {
    if (v?.meta?.sort === null) v.meta.sort = index + 2
  })
  return arr.sort((a, b) => {
    return a?.meta?.sort - b?.meta?.sort
  })
}

const filterAsyncRoute = (menus: System.Menu[]): Array<RouteRecordRaw> => {
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
      isCache,
      linkUrl,
      isTagsView
    } = menu
    const route: Partial<RouteRecordRaw> = {
      path: path.charAt(0) !== '/' ? `/${path}` : path,
      meta: {
        title: menuName,
        icon,
        sort: orderSort
      }
    }

    if (menu.children?.length > 0) {
      route.children = filterAsyncRoute(menu.children)
      route.redirect = route.children[0].path
    } else {
      route.name = nameCase(name)
      const isLink = menuType === '2'
      const isIframe = menuType === '1'
      if (!isLink) route.component = isIframe ? Iframe : getDynamicComponent(component)
      route.meta = {
        ...route.meta,
        ...{
          activePath,
          noTagsView: !isTagsView,
          isHidden,
          isKeepAlive: isCache,
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

const filterMenuOptions = (routes: RouteRecordRaw[]): MenuOption[] => {
  return routes.map((route) => {
    const { path, meta } = route
    const menuOption: Partial<MenuOption> = {
      key: path,
      label: meta?.title,
      icon: meta?.icon ? () => h(SvgIcon, { icon: meta?.icon as string }) : null,
      noTagsView: meta?.noTagsView,
      isKeepAlive: meta?.isKeepAlive,
      isAffix: meta?.isAffix,
      isLink: meta?.isLink,
      linkUrl: meta?.linkUrl,
      sort: meta?.sort
    }
    const showChild = (route.children || []).filter((o) => !o.meta?.isHidden)
    if (showChild?.length > 0) {
      menuOption.children = filterMenuOptions(showChild)
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
    const allRoutes = ascending([...layout.children, ...asyncRoutes])
    // 将layout路由删除
    router.removeRoute(layout.name)
    layout.children = allRoutes
    // 重新添加
    router.addRoute(layout)
    // 返回排序并过滤隐藏的菜单
    return filterMenuOptions(allRoutes.filter((o) => !o.meta?.isHidden))
  } catch (error) {
    console.error('生成路由时出错', error)
    return Promise.reject(`生成路由时出错: ${error}`)
  }
}

export default generatorDynamicRouter
