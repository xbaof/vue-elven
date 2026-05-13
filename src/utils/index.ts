import type { RouteRecordRaw, RouteLocationNormalizedLoaded } from 'vue-router'
import type { TagView } from '@/store/types'

// ==================== 对象工具 ====================

/**
 * @description 对比两个对象的值是否完全相等
 * @param a:对象1 b:对象2
 * @returns 返回值 true/false
 */
export function isObjectValueEqual(a: Recordable, b: Recordable): boolean {
  if (a === b) return true
  if (!a || !b) return false
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)
  if (aProps.length !== bProps.length) return false
  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i]
    const propA = a[propName]
    const propB = b[propName]
    if (!Object.prototype.hasOwnProperty.call(b, propName)) return false
    if (propA instanceof Object && propB instanceof Object) {
      if (!isObjectValueEqual(propA as Recordable, propB as Recordable)) return false
    } else if (propA !== propB) {
      return false
    }
  }
  return true
}

// ==================== 路由工具 ====================

/**
 * 比较两个路由的路径和查询参数是否相等
 */
export const isSameRoute = (a: TagView, b: TagView): boolean => {
  return decodeURI(a.path) === decodeURI(b.path) && isObjectValueEqual(a.query || {}, b.query || {})
}

/**
 * 获取标签页标题
 */
export const getTagTitle = (tag: TagView): string => {
  const { query, params, meta } = tag
  if (query?.tagViewTitle || params?.tagViewTitle) {
    return query?.tagViewTitle?.toString() || params?.tagViewTitle?.toString() || ''
  }
  return meta?.title || ''
}

/**
 * @description 下载文件
 * @param data 文件数据
 * @param filename 文件名
 * @param mime 文件类型
 * @param bom bom
 */
export const routeToTag = (route: RouteRecordRaw | RouteLocationNormalizedLoaded): TagView => {
  const routeName =
    typeof route.name === 'string' ? route.name : typeof route.name === 'symbol' ? (route.name.description ?? '') : ''
  const routeTitle = typeof route.meta?.title === 'string' ? route.meta.title : routeName
  const query = 'query' in route ? (route.query ?? {}) : {}
  const params = 'params' in route ? (route.params ?? {}) : {}

  return {
    path: route.path,
    name: routeName,
    title: routeTitle,
    meta: { ...(route.meta || {}) },
    query,
    params
  }
}

/**
 * 转大驼峰命名（用于生成组件 name）
 */
export const toPascal = (str: string): string => {
  return str.replace(/( |^)[a-z]/g, (letter) => letter.toUpperCase())
}

// ==================== DOM 工具 ====================

/**
 * 打开超链接
 */
export const openLink = (href: string, target: '_blank' | '_self' | '_parent' | '_top' = '_blank'): void => {
  const linkEl = document.createElement('a')
  linkEl.setAttribute('href', href)
  linkEl.setAttribute('target', target)
  linkEl.setAttribute('rel', 'noreferrer noopener')
  document.body.appendChild(linkEl)
  linkEl.click()
  linkEl.remove()
}

/**
 * 下载文件
 */
export const downloadFile = (data: BlobPart, filename: string, mime?: string, bom?: BlobPart): void => {
  const blobData = typeof bom !== 'undefined' ? [bom, data] : [data]
  const blob = new Blob(blobData, { type: mime || 'application/octet-stream' })

  const blobURL = window.URL.createObjectURL(blob)
  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = blobURL
  tempLink.setAttribute('download', filename)
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank')
  }
  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
  window.URL.revokeObjectURL(blobURL)
}
