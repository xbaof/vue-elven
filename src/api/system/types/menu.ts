export type MenuType = '0' | '1' | '2' | '3'

interface MenuBase {
  id: number
  parentId?: number
  /** 菜单名称 */
  menuName?: string
  /** 排序 */
  orderSort: number
  /** 路由名称 */
  name?: string
  /** 路由路径 */
  path?: string
  /** 组件路径 */
  component?: string | null
  /** 是否缓存 */
  isKeepAlive: boolean
  /** 是否隐藏 */
  isHidden: boolean
  /** 外链地址 */
  linkUrl?: string
  /** 图标 */
  icon?: string
  /** 是否显示标签页 */
  isTagsView: boolean
  /** 是否固定标签 */
  isAffix: boolean
  /** 状态 */
  status: '0' | '1'
  /** 激活路径 */
  activePath?: string
  /** 子菜单 */
  children?: Menu[]
}

export interface MenuDirectory extends MenuBase {
  menuType: '0'
}

export interface MenuIframe extends MenuBase {
  menuType: '1'
}

export interface MenuExternalLink extends MenuBase {
  menuType: '2'
}

export interface MenuButton extends MenuBase {
  menuType: '3'
}

export type Menu = MenuDirectory | MenuIframe | MenuExternalLink | MenuButton

export type MenuId = MenuBase['id']
export type MenuIdInput = MenuId | `${MenuId}`
export type MenuMutationPayload = Partial<Omit<Menu, 'children'>>
