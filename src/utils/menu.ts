import type { MenuOption } from 'naive-ui'
import { h } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 安全创建菜单图标渲染函数。
 */
const createMenuIcon = (icon: unknown): MenuOption['icon'] => {
  if (typeof icon !== 'string' || !icon) {
    return undefined
  }
  return () => h(SvgIcon, { icon })
}

/**
 * @description 将路由树转换为 naive-ui 菜单数据
 * @param routes
 * @returns naive-ui 菜单数据源
 */
export function transformRoutesToMenus(routes: RouteRecordRaw[]): MenuOption[] {
  return routes.map((route) => {
    const { path, meta } = route
    const menuOption: Partial<MenuOption> = {
      key: path,
      label: meta?.title,
      icon: createMenuIcon(meta?.icon),
      isTagsView: meta?.isTagsView,
      isKeepAlive: meta?.isKeepAlive,
      isAffix: meta?.isAffix,
      isLink: meta?.isLink,
      linkUrl: meta?.linkUrl,
      sort: meta?.sort,
      show: !meta?.isHidden
    }
    const showChild = (route.children || []).filter((o) => !o.meta?.isHidden)
    if (showChild?.length > 0) {
      menuOption.children = transformRoutesToMenus(showChild)
    }
    return menuOption
  })
}

/**
 * @description 扁平化路由
 * @param {RouteRecordRaw[]} options
 * @returns {MenuOption[]}
 */
export function flatRoutesToMenus(options: RouteRecordRaw[], parentLabel?: Nullable<string>): MenuOption[] {
  let result: MenuOption[] = []
  options
    .filter((o) => !o.meta?.isHidden)
    .forEach((route) => {
      const { path, meta } = route
      const label = parentLabel ? `${parentLabel} > ${meta?.title}` : meta?.title
      if (route.children && route.children.length > 0) {
        result = result.concat(flatRoutesToMenus(route.children, label))
      } else {
        result.push({
          key: path,
          label: label,
          isLink: meta?.isLink,
          icon: createMenuIcon(meta?.icon),
          linkUrl: meta?.linkUrl
        })
      }
    })
  return result
}
