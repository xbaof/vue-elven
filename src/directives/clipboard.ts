import { useEventListener, useClipboard } from '@vueuse/core'
import { Directive, type DirectiveBinding } from 'vue'

interface ClipEl extends HTMLElement {
  clipValue: string
}
const { copy, isSupported } = useClipboard()

export const clipboard: Directive = {
  mounted(el: ClipEl, binding: DirectiveBinding) {
    el.clipValue = binding.value
    const arg = binding.arg ?? 'dblclick'
    useEventListener(el, arg, async () => {
      if (!el.clipValue) return false
      if (isSupported.value) {
        await copy(el.clipValue)
        window.$message.success('复制成功')
      } else {
        window.$message.error('您的浏览器不支持Clipboard API，请手动复制内容。')
      }
    })
  },
  updated(el: ClipEl, binding: DirectiveBinding) {
    el.clipValue = binding.value
  }
}
