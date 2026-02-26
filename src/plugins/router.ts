import type { App } from 'vue'
import router from '../router'
import { setupRouterGuard } from '../router/guard'

export async function setupRouter(app: App<Element>) {
  setupRouterGuard(router)
  app.use(router)
  await router.isReady()
}
