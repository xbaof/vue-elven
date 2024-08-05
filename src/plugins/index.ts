import type { App } from 'vue'
import { setPinia } from './pinia'
import { setupNaive } from './naive-ui'
import { setupNaiveDiscreteApi } from './naiveDiscreteApi'
import { setRouter } from './router'
import { setSvgIcon } from './svgIcon'

export default {
  install(app: App<Element>) {
    setPinia(app)
    setupNaive(app)
    setupNaiveDiscreteApi()
    setRouter(app)
    setSvgIcon(app)
  }
}
