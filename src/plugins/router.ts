import type { App } from 'vue'
import router from '../router'
import '../router/routerGuard'

export function setRouter(app: App<Element>) {
  app.use(router)
}
