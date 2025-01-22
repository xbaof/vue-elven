import { TagView } from '@/store/interface'

/**
 * @description 创建超链接
 * @param href 超链接地址
 * @param target Target
 */
export function openLink(href: string, target: '_blank' | '_self' | '_parent' | '_top' | 'framename' = '_blank') {
  const n = document.createElement('a')
  n.setAttribute('href', href)
  n.setAttribute('target', target)
  n.setAttribute('rel', 'noreferrer noopener'), n.setAttribute('id', 'external')
  const r = document.getElementById('external')
  document.body.appendChild(n)
  n.click()
  n.remove()
}

/**
 * @description 获取标签页标题
 * @param item
 * @returns 标签页标题
 */
export function getTagViewTitle(item: TagView) {
  const { query, params, meta } = item
  if (query?.tagViewTitle || params?.tagViewTitle) {
    return query?.tagViewTitle?.toString() || params?.tagViewTitle?.toString()
  }
  return meta?.title || ''
}

/**
 * @description 对比两个对象的值是否完全相等
 * @param a:对象1 b:对象2
 * @returns 返回值 true/false
 */
export function isObjectValueEqual<T>(a: T, b: T): boolean {
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
    if (propA instanceof Object) {
      if (!isObjectValueEqual(propA, propB)) return false
    } else if (propA !== propB) {
      return false
    }
  }
  return true
}
