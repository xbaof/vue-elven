import { computed } from 'vue'
import { createDiscreteApi, darkTheme, lightTheme, type ConfigProviderProps } from 'naive-ui'
import { useSettingStore } from '@/store'

export function setupNaiveDiscreteApi() {
  const setting = useSettingStore()

  const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
    theme: setting.theme ? lightTheme : darkTheme
  }))
  const { message, notification, loadingBar } = createDiscreteApi(['message', 'notification', 'loadingBar'], {
    configProviderProps: configProviderPropsRef
  })

  window.$message = message
  window.$notification = notification
  window.$loadingBar = loadingBar
}
