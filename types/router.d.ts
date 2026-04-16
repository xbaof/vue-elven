import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题（用于标签页 / 面包屑 / 菜单） */
    title?: string
    /** 图标名称（通常来自 iconify 或本地图标） */
    icon?: string
    /** 是否需要登录 */
    requiresAuth?: boolean
    /** 允许访问角色 */
    roles?: string[]
    /** 是否固定在标签页 */
    isAffix?: boolean
    /** 是否在菜单中隐藏 */
    isHidden?: boolean
    /** 是否被 keep-alive 缓存 */
    isKeepAlive?: boolean
    /** 是否在标签页中显示 */
    isTagsView?: boolean
    /** 是否外链 */
    isLink?: boolean
    /** 外链地址 */
    linkUrl?: string
    /** 是否 iframe 内嵌 */
    isIframe?: boolean
    /** 菜单排序，数字越小越靠前 */
    sort?: number
    /** 高亮的菜单路径（用于详情页等场景） */
    activePath?: string
    /** 路由缓存键 */
    cacheKey?: string
    /** 权限标识 */
    perm?: string
    /** 菜单右侧额外标记文本 */
    extraText?: string
    /** 菜单右侧额外标记类型 */
    extraType?: 'default' | 'success' | 'error' | 'warning' | 'info'
    /** 菜单导航附带的 URL 参数 */
    query?: AnyObject
  }
}

declare interface RouteParams {
  [key: string]: string | number
}
