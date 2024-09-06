import { computed } from 'vue'
import { createDiscreteApi, darkTheme, type ConfigProviderProps } from 'naive-ui'
import { useAppStore } from '@/store'

export function setupNaiveDiscreteApi() {
  const app = useAppStore()

  const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
    theme: app.isDark ? darkTheme : null,
    themeOverrides: {
      common: { ...app.getThemeOverridesCommon }
    }
  }))
  const { message, notification, loadingBar } = createDiscreteApi(['message', 'notification', 'loadingBar'], {
    configProviderProps: configProviderPropsRef
  })

  window.$message = message
  window.$notification = notification
  window.$loadingBar = loadingBar
}
