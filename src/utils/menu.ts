import type { MenuOption, BadgeProps } from 'naive-ui'
import { NBadge } from 'naive-ui'
import { h } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useMenuBadgeStore } from '@/store/modules/menuBadge'
import type { RouteRecordRaw } from 'vue-router'
import type { MenuBadge } from '@/store/types'
import { isNumericText } from '@/utils/is'

/**
 * 从动态路由树中提取菜单标记基线数据。
 */
export const collectRouteBadgeMap = (routeList: RouteRecordRaw[]): Recordable<MenuBadge> => {
  const serverBadgeMap: Recordable<MenuBadge> = {}

  const walkRouteTree = (routes: RouteRecordRaw[]) => {
    routes.forEach((routeItem) => {
      const extraText = routeItem.meta?.extraText
      const extraType = routeItem.meta?.extraType

      if (routeItem.path && typeof extraText === 'string' && extraText.trim().length > 0) {
        serverBadgeMap[routeItem.path] = {
          extraText,
          extraType
        }
      }

      if (routeItem.children && routeItem.children.length > 0) {
        walkRouteTree(routeItem.children)
      }
    })
  }

  walkRouteTree(routeList)
  return serverBadgeMap
}

/**
 * 统一解析菜单标记，优先使用本地覆盖值，再回退到路由元信息。
 */
const resolveRouteBadge = (
  routePath: string,
  routeMeta: RouteRecordRaw['meta'],
  menuBadgeStore: ReturnType<typeof useMenuBadgeStore>
): MenuBadge => {
  const resolvedBadge = menuBadgeStore.resolveBadge(routePath)
  return {
    extraText: resolvedBadge?.extraText ?? routeMeta?.extraText,
    extraType: resolvedBadge?.extraType ?? routeMeta?.extraType
  }
}

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
      value: isNumericText(extraText) ? Number(extraText) : extraText,
      class: 'ml-4'
    })
}

/**
 * @description 将路由树转换为 naive-ui 菜单数据。
 */
export function transformRoutesToMenus(routes: RouteRecordRaw[]): MenuOption[] {
  const menuBadgeStore = useMenuBadgeStore()

  return routes.map((route) => {
    const { path, meta } = route
    const { extraText, extraType } = resolveRouteBadge(path, meta, menuBadgeStore)

    const menuOption: Partial<MenuOption> = {
      key: path,
      label: meta?.title,
      icon: createMenuIcon(meta?.icon),
      extra: createMenuExtra(extraText, extraType),
      isTagsView: meta?.isTagsView,
      isKeepAlive: meta?.isKeepAlive,
      isAffix: meta?.isAffix,
      isLink: meta?.isLink,
      linkUrl: meta?.linkUrl,
      sort: meta?.sort,
      activePath: meta?.activePath,
      extraText,
      extraType,
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
  const menuBadgeStore = useMenuBadgeStore()
  let result: MenuOption[] = []

  options
    .filter((item) => !item.meta?.isHidden)
    .forEach((route) => {
      const { path, meta } = route
      const { extraText, extraType } = resolveRouteBadge(path, meta, menuBadgeStore)
      const label = parentLabel ? `${parentLabel} > ${meta?.title}` : meta?.title

      if (route.children && route.children.length > 0) {
        result = result.concat(flatRoutesToMenus(route.children, label))
      } else {
        result.push({
          key: path,
          label,
          isLink: meta?.isLink,
          icon: createMenuIcon(meta?.icon),
          extra: createMenuExtra(extraText, extraType),
          linkUrl: meta?.linkUrl,
          query: meta?.query
        })
      }
    })

  return result
}
