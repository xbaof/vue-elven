declare namespace System {
  interface Menu {
    id: number
    parentId?: number
    menuName?: string
    orderSort: number
    name?: string
    /** 路由地址 */
    path?: string
    /** 组件路径 */
    component?: string
    /** 是否缓存 */
    isCache: boolean
    /** 是否隐藏 */
    isHidden: boolean
    /** 类型 '0': 菜单 | '1': 内嵌 | '2': 外链 | '3': 按钮*/
    menuType: '0' | '1' | '2' | '3'
    /** 状态 '0': 正常 | '1': 停用  */
    status: '0' | '1'
    activePath?: string
    icon?: string
    /** 是否在tag中显示 */
    isTagsView: boolean
    /** 是否在固定在tag上 */
    isAffix: boolean
    /** 外链地址 */
    linkUrl?: string
    description?: string
    perms?: string
    createdUserId?: number
    modifiedUserId?: number
    createdUserName?: string
    modifiedUserName?: string
    createdTime?: Date
    modifiedTime?: Date
    children?: Array<Menu>
  }
}
