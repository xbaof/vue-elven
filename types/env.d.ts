/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare interface ImportMeta {
  VITE_PORT: number
  VITE_GLOB_TITLE: string
  VITE_OPEN: boolean
  VITE_PUBLIC_PATH: string
  VITE_DROP_CONSOLE: boolean
  VITE_API_URL: string
  VITE_OPEN_VISUALIZER: boolean
}

interface ImportMetaEnv extends ImportMeta {
  __: unknown
}
/**
 * Window 的类型提示
 */
interface Window {
  // Global vue app instance
  __APP__: App<Element>
  $message: MessageApiInjection
  $dialog: DialogApiInjection
  $notification: NotificationApiInjection
  $loading: LoadingBarInst
}
