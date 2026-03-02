import type { App } from 'vue'

declare global {
  interface ImportMetaEnv {
    VITE_PORT: string
    VITE_GLOB_TITLE: string
    VITE_OPEN: 'true' | 'false'
    VITE_PUBLIC_PATH: string
    VITE_DROP_CONSOLE: 'true' | 'false'
    VITE_API_BASE_URL: string
    VITE_OPEN_VISUALIZER: 'true' | 'false'
    VITE_CRYPTO_SECRET_KEY: string
    VITE_CRYPTO_IV_KEY: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  interface Window {
    __APP__: App<Element>
    $message: import('naive-ui').MessageProviderInst
    $notification: import('naive-ui').NotificationProviderInst
    $loadingBar: import('naive-ui').LoadingBarProviderInst
  }
}
