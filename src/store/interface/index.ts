import type { MenuOption } from 'naive-ui'
import type { RouteLocationNormalized } from 'vue-router'

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
    /** 判断是否手动点击Collapse*/
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
  name: string
  nickName: string
  avatar: string
  // like [ 'sys:user:add', 'sys:user:update' ]
  perms: string[]
  menus: MenuOption[]
}

export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string
}

export interface TagsViewState {
  visitedViews: TagView[]
  cachedViews: string[]
}
