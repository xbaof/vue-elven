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

interface Window {
  // Global vue app instance
  __APP__: App<Element>
  $message?: import('naive-ui').MessageProviderInst
  $notification?: import('naive-ui').NotificationProviderInst
  $loadingBar?: import('naive-ui').LoadingBarProviderInst
}
