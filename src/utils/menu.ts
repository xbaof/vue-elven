import type { MenuOption } from 'naive-ui'
import { NBadge } from 'naive-ui'
import { h, type VNodeChild } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useMenuBadgeStore } from '@/store/modules/menuBadge'
import type { RouteRecordRaw } from 'vue-router'
import type { MenuBadge } from '@/store/types'
import { isNumericText } from '@/utils/is'

/**
 * 从动态路由树中提取菜单标记数据。
 */
export const collectRouteBadgeMap = (routeList: RouteRecordRaw[]): Recordable<MenuBadge> => {
  const result: Recordable<MenuBadge> = {}

  const walk = (routes: RouteRecordRaw[]) => {
    routes.forEach((route) => {
      const { path, meta, children } = route
      const extraText = meta?.extraText

      if (path && typeof extraText === 'string' && extraText.trim()) {
        result[path] = { extraText, extraType: meta?.extraType }
      }

      if (children?.length) walk(children)
    })
  }

  walk(routeList)
  return result
}

/**
 * 统一渲染菜单右侧额外内容。
 */
export const renderMenuOptionExtra = (option: MenuOption): VNodeChild => {
  const { extra } = option
  return typeof extra === 'function' ? extra() : (extra ?? null)
}

// 创建菜单项
const createMenuOption = (
  route: RouteRecordRaw,
  badgeStore: ReturnType<typeof useMenuBadgeStore>,
  label: MenuOption['label'] = route.meta?.title
): Partial<MenuOption> => {
  const { path, meta } = route
  const badge = badgeStore.resolveBadge(path)
  const extraText = badge?.extraText ?? meta?.extraText
  const extraType = badge?.extraType ?? meta?.extraType

  return {
    key: path,
    label,
    icon: meta?.icon ? () => h(SvgIcon, { icon: meta.icon as string }) : undefined,
    extra:
      extraText && extraText.trim()
        ? () =>
            h(NBadge, {
              type: extraType || 'default',
              value: isNumericText(extraText) ? Number(extraText) : extraText,
              class: 'ml-4'
            })
        : undefined,
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
}

/**
 * @description 将路由树转换为 naive-ui 菜单数据。
 */
export function transformRoutesToMenus(routes: RouteRecordRaw[]): MenuOption[] {
  const badgeStore = useMenuBadgeStore()

  return routes.map((route) => {
    const menu = createMenuOption(route, badgeStore)
    const children = route.children?.filter((item) => !item.meta?.isHidden)

    if (children?.length) {
      menu.children = transformRoutesToMenus(children)
    }

    return menu as MenuOption
  })
}

/**
 * @description 扁平化路由。
 */
export function flatRoutesToMenus(routes: RouteRecordRaw[], parentLabel?: Nullable<string>): MenuOption[] {
  const badgeStore = useMenuBadgeStore()
  const result: MenuOption[] = []

  routes
    .filter((item) => !item.meta?.isHidden)
    .forEach((route) => {
      const label = parentLabel ? `${parentLabel} > ${route.meta?.title}` : route.meta?.title

      if (route.children?.length) {
        result.push(...flatRoutesToMenus(route.children, label))
      } else {
        result.push(createMenuOption(route, badgeStore, label) as MenuOption)
      }
    })

  return result
}
