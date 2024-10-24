import type { App } from 'vue'
import router from '../router'
import '../router/routerGuard'

export function setupRouter(app: App<Element>) {
  app.use(router)
}
