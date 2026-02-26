import type { MenuOption } from 'naive-ui'
import { h } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import type { RouteRecordRaw } from 'vue-router'

/**
 * @description 获取标签页标题
 * @param routes
 * @returns naive-ui 菜单数据源
 */
export function transformRoutesToMenus(routes: RouteRecordRaw[]): MenuOption[] {
  return routes.map((route) => {
    const { path, meta } = route
    const menuOption: Partial<MenuOption> = {
      key: path,
      label: meta?.title,
      icon: meta?.icon ? () => h(SvgIcon, { icon: meta?.icon as string }) : undefined,
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
  let reslut: MenuOption[] = []
  options
    .filter((o) => !o.meta?.isHidden)
    .forEach((route) => {
      const { path, meta } = route
      const label = parentLabel ? `${parentLabel} > ${meta?.title}` : meta?.title
      if (route.children && route.children.length > 0) {
        reslut = reslut.concat(flatRoutesToMenus(route.children, label))
      } else {
        reslut.push({
          key: path,
          label: label,
          isLink: meta?.isLink,
          icon: meta?.icon ? () => h(SvgIcon, { icon: meta?.icon as string }) : undefined,
          linkUrl: meta?.linkUrl
        })
      }
    })
  return reslut
}
