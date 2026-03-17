declare module '@wangeditor/editor-for-vue' {
  import type { DefineComponent } from 'vue'

  export const Editor: DefineComponent<Recordable<unknown>, Recordable<unknown>, unknown>
  export const Toolbar: DefineComponent<Recordable<unknown>, Recordable<unknown>, unknown>
}
