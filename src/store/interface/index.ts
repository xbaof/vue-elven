import { RouteRecordRaw, RouteLocationNormalized } from 'vue-router'

export interface AppState {
  sidebar: {
    opened: boolean
    withoutAnimation: boolean
    /** 判断是否手动点击Collapse*/
    isClickCollapse: boolean
  }
  device: string
  size: 'default' | 'large' | 'small'
}

export interface SettingState {
  layout: 'vertical' | 'horizontal' | 'mix'
  showLogo: boolean
  showTagsView: boolean
  uniqueOpened: boolean
  primary: string
  theme?: 'light'
  isUnFold: boolean
}

export interface AuthState {
  token: string
  name: string
  nickName: string
  avatar: string
  // like [ 'sys:user:add', 'sys:user:update' ]
  perms: string[]
  /** 用来渲染菜单的路由(去掉隐藏属性的路由) */
  menus: RouteRecordRaw[]
}
