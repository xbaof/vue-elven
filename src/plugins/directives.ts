import type { App } from 'vue'
import { clipboard } from '../directives/clipboard'
import { optimize } from '../directives/optimize'
import { longpress } from '../directives/longpress'
import { permission } from '../directives/permission'

export function setupDirectives(app: App<Element>) {
  app.directive('clipboard', clipboard)
  app.directive('optimize', optimize)
  app.directive('longpress', longpress)
  app.directive('permission', permission)
}
