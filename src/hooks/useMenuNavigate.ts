import type { MenuOption } from 'naive-ui'
import { openLink } from '@/utils'
import { useSafeNavigation } from '@/hooks/useSafeNavigation'

/**
 * 菜单项导航 Hook：
 * 统一处理外链与站内路由，减少页面重复分支。
 */
export const useMenuNavigate = () => {
  const { push } = useSafeNavigation()

  const navigateByMenuOption = async (option: MenuOption | undefined, fallbackKey?: string): Promise<void> => {
    if (!option) {
      return
    }

    if (option.isLink && option.linkUrl) {
      openLink(String(option.linkUrl))
      return
    }

    const routeKey = option.key ?? fallbackKey
    if (routeKey == null) {
      return
    }

    await push(String(routeKey))
  }

  return {
    navigateByMenuOption
  }
}
