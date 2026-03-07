import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { setTokenGetter } from '@/api/http/tokenProvider'
import { useAuthStore } from '@/store/modules/auth'

export function setupPinia(app: App<Element>) {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  app.use(pinia)
  setTokenGetter(() => useAuthStore().getToken)
}
