/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Recordable<unknown>, Recordable<unknown>, unknown>
  export default component
}
