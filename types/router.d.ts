import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题（用于标签页 / 面包屑 / 菜单） */
    title?: string
    /** 图标 name（通常来自 iconify 或本地图标） */
    icon?: string
    /** 是否需要登录才能访问 */
    requiresAuth?: boolean
    /** 允许访问的角色编码集合，例如 ['admin', 'editor'] */
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
    /** 路由缓存的 key */
    cacheKey?: string
    /** 权限标识 */
    perm?: string
  }
}

declare interface RouteParams {
  [key: string]: string | number
}
