import type { RouteRecordRaw, RouteMeta, LocationQuery, RouteParamsRawGeneric } from 'vue-router'
import type { BadgeProps } from 'naive-ui'

export interface AppState {
  layout: 'vertical' | 'horizontal' | 'mix'
  device: 'mobile' | 'desktop'
  isDark: boolean
  overrideColor: {
    primary: string
    success: string
    warning: string
    info: string
    error: string
  }
  sidebar: {
    showLogo: boolean
    sidebarWidth: number
    accordion: boolean
    inverted: boolean
    opened: boolean
    /** 是否由用户手动触发折叠 */
    isClickCollapse: boolean
  }
  showFooter: boolean
  tagsView: {
    show: boolean
    fullScreen: boolean
  }
  watermark: {
    show: boolean
    content: string
  }
  breadcrumb: {
    showIcon: boolean
    dropdown: boolean
  }
}

export interface AuthState {
  token: string
}

export interface UserState {
  name: string
  nickName: string
  avatar: string
}

export interface PermissionState {
  /** 是否已基于权限生成并挂载动态路由 */
  isDynamicRouteAdded: boolean
  routes: RouteRecordRaw[]
  roles: string[]
  /** like [ 'sys:user:add', 'sys:user:update' ] */
  perms: string[]
}

export interface TagView {
  title: string
  path: string
  name: string
  meta: RouteMeta
  query: LocationQuery
  params: RouteParamsRawGeneric
}

export interface TagsViewState {
  visitedViews: TagView[]
  cachedViews: string[]
}

export interface MenuBadge {
  extraText?: string
  extraType?: BadgeProps['type']
}

export interface MenuBadgeState {
  serverMap: Recordable<MenuBadge>
  localMap: Recordable<MenuBadge>
}
