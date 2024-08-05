declare namespace System {
  interface Menu {
    id: number
    parentId?: number
    menuName?: string
    orderSort: number
    /** 路由地址 */
    path?: string
    /** 组件路径 */
    component?: string
    /** 是否内嵌 */
    isIframe: boolean
    // 是否为外链页面
    isLink?: boolean
    /** 是否缓存 */
    isCache: boolean
    /** 是否隐藏 */
    isHidden: boolean
    /** 类型 '0': 目录 | '1': 菜单 | '2': 权限 */
    menuType: '0' | '1' | '2'
    /** 状态 '0': 正常 | '1': 停用  */
    status: '0' | '1'
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
