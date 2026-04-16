import type { MenuOption, BadgeProps } from 'naive-ui'
import { NBadge } from 'naive-ui'
import { h } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 安全创建菜单图标渲染函数。
 */
const createMenuIcon = (icon: Nullable<string>): MenuOption['icon'] => {
  if (typeof icon !== 'string' || !icon) {
    return undefined
  }
  return () => h(SvgIcon, { icon })
}

/**
 * 创建菜单右侧额外标记渲染函数。
 */
const createMenuExtra = (extraText: Nullable<string>, extraType: Nullable<BadgeProps['type']>): MenuOption['extra'] => {
  if (typeof extraText !== 'string' || !extraText.trim()) {
    return undefined
  }

  return () =>
    h(NBadge, {
      type: extraType || 'default',
      value: extraText,
      class: 'ml-4'
    })
}

/**
 * @description 将路由树转换为 naive-ui 菜单数据。
 */
export function transformRoutesToMenus(routes: RouteRecordRaw[]): MenuOption[] {
  return routes.map((route) => {
    const { path, meta } = route
    const menuOption: Partial<MenuOption> = {
      key: path,
      label: meta?.title,
      icon: createMenuIcon(meta?.icon),
      extra: createMenuExtra(meta?.extraText, meta?.extraType),
      isTagsView: meta?.isTagsView,
      isKeepAlive: meta?.isKeepAlive,
      isAffix: meta?.isAffix,
      isLink: meta?.isLink,
      linkUrl: meta?.linkUrl,
      sort: meta?.sort,
      activePath: meta?.activePath,
      extraText: meta?.extraText,
      extraType: meta?.extraType,
      query: meta?.query,
      show: !meta?.isHidden
    }

    const showChild = (route.children || []).filter((item) => !item.meta?.isHidden)
    if (showChild.length > 0) {
      menuOption.children = transformRoutesToMenus(showChild)
    }

    return menuOption
  })
}

/**
 * @description 扁平化路由。
 */
export function flatRoutesToMenus(options: RouteRecordRaw[], parentLabel?: Nullable<string>): MenuOption[] {
  let result: MenuOption[] = []
  options
    .filter((item) => !item.meta?.isHidden)
    .forEach((route) => {
      const { path, meta } = route
      const label = parentLabel ? `${parentLabel} > ${meta?.title}` : meta?.title
      if (route.children && route.children.length > 0) {
        result = result.concat(flatRoutesToMenus(route.children, label))
      } else {
        result.push({
          key: path,
          label,
          isLink: meta?.isLink,
          icon: createMenuIcon(meta?.icon),
          extra: createMenuExtra(meta?.extraText, meta?.extraType),
          linkUrl: meta?.linkUrl,
          query: meta?.query
        })
      }
    })

  return result
}
