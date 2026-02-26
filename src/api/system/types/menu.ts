// 菜单类型
export interface Menu {
  id: number
  parentId?: number
  /** 菜单名称 */
  menuName?: string
  /** 排序 */
  orderSort: number
  /** 名称 */
  name?: string
  /** 路径 */
  path?: string
  /** 组件 */
  component?: string | null
  /** 是否缓存 */
  isKeepAlive: boolean
  /** 是否隐藏 */
  isHidden: boolean
  /** 链接地址 */
  linkUrl?: string
  /** 类型 '0': 菜单 | '1': 内嵌 | '2': 外链 | '3': 按钮*/
  menuType: '0' | '1' | '2' | '3'
  /** 图标 */
  icon?: string
  /** 是否标签视图 */
  isTagsView: boolean
  /** 是否固定 */
  isAffix: boolean
  /** 状态 '0': 正常 | '1': 停用  */
  status: '0' | '1'
  /** 激活路径 */
  activePath?: string
  /** 子菜单 */
  children?: Menu[]
}
