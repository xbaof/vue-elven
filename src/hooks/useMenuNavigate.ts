import type { MenuOption } from 'naive-ui'
import { openLink } from '@/utils'
import { useSafeNavigation } from '@/hooks/useSafeNavigation'
import type { LocationQueryRaw } from 'vue-router'

/**
 * 菜单项导航 Hook。
 * 统一处理外链与站内路由，减少页面重复分支。
 */
export const useMenuNavigate = () => {
  const { push } = useSafeNavigation()

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

    if (isLink && linkUrl) {
      openLink(appendQueryToUrl(String(linkUrl), query as LocationQueryRaw))
      return
    }

    if (routeKey != null) {
      await push(query ? { path: String(routeKey), query: query as LocationQueryRaw } : String(routeKey))
    }
  }

  return {
    navigateByMenuOption
  }
}
