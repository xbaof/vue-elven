import type { App } from 'vue'
import { setupPinia } from './pinia'
import { setupNaive } from './naive-ui'
import { setupNaiveDiscreteApi } from './naiveDiscreteApi'
import { setupRouter } from './router'
import { setupCustomComponents } from './customComponents'
import { setupDirectives } from './directives'

export default {
  install(app: App<Element>) {
    setupPinia(app)
    setupNaive(app)
    setupNaiveDiscreteApi()
    setupRouter(app)
    setupCustomComponents(app)
    setupDirectives(app)
  }
}
