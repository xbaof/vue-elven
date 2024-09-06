import type { MenuOption } from 'naive-ui'

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
  breadcrumb: {
    showIcon: boolean
    dropdown: boolean
  }
  showTagsView: boolean
}

export interface AuthState {
  token: string
  name: string
  nickName: string
  avatar: string
  // like [ 'sys:user:add', 'sys:user:update' ]
  perms: string[]
  /** 用来渲染菜单的路由(去掉隐藏属性的路由) */
  menus: MenuOption[]
}
