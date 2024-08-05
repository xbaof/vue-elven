import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export function setPinia(app: App<Element>) {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  app.use(pinia)
}
