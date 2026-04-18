import { useEventListener, useClipboard } from '@vueuse/core'
import type { Directive, DirectiveBinding } from 'vue'

interface ClipEl extends HTMLElement {
  clipValue: string
}

const { copy, isSupported } = useClipboard()

export const clipboard: Directive = {
  mounted(el: ClipEl, binding: DirectiveBinding<string | undefined>) {
    el.clipValue = binding.value ?? ''
    const eventName = binding.arg ?? 'dblclick'

    useEventListener(el, eventName, async () => {
      if (!el.clipValue) return

      if (!isSupported.value) {
        window.$message?.error('您的浏览器不支持 Clipboard API，请手动复制内容。')
        return
      }

      await copy(el.clipValue)
      window.$message?.success('复制成功')
    })
  },
  updated(el: ClipEl, binding: DirectiveBinding<string | undefined>) {
    el.clipValue = binding.value ?? ''
  }
}
