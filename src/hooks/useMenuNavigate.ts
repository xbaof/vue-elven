import type { MenuOption } from 'naive-ui'
import { useRouter, type LocationQueryRaw } from 'vue-router'
import { openLink } from '@/utils'

/**
 * 菜单项导航 Hook。
 * 统一处理外链与站内路由，减少页面重复分支。
 */
export const useMenuNavigate = () => {
  const router = useRouter()

  /**
   * 将 query 参数追加到 URL。
   */
  const appendQueryToUrl = (url: string, query?: LocationQueryRaw): string => {
    if (!query || Object.keys(query).length === 0) return url

    const [base, hash] = url.split('#')
    const params = new URLSearchParams()

    Object.entries(query).forEach(([key, value]) => {
      if (value != null) params.append(key, String(value))
    })

    const queryString = params.toString()
    if (!queryString) return url

    const connector = base.includes('?') ? '&' : '?'
    const result = `${base}${connector}${queryString}`
    return hash ? `${result}#${hash}` : result
  }

  const navigateByMenuOption = async (option: MenuOption, fallbackKey?: string): Promise<void> => {
    if (!option) return

    const { query, isLink, linkUrl, key } = option
    const routeKey = key ?? fallbackKey
    const routeQuery = query as LocationQueryRaw | undefined

    if (isLink && linkUrl) {
      openLink(appendQueryToUrl(String(linkUrl), routeQuery))
      return
    }

    if (routeKey != null) {
      await router.push(routeQuery ? { path: String(routeKey), query: routeQuery } : String(routeKey))
    }
  }

  return {
    navigateByMenuOption
  }
}
