import type { App } from 'vue'
import SvgIcon from '@/components/SvgIcon/index.vue'

export function setupCustomComponents(app: App<Element>) {
  app.component('SvgIcon', SvgIcon)
}
