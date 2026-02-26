/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any> & {
    // 可以添加全局组件的静态属性
  }
  export default component
}
