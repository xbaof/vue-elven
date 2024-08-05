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
