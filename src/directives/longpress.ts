import { useEventListener } from '@vueuse/core'
import { Directive, type DirectiveBinding } from 'vue'
import { isFunction } from '@/utils/is'

export const longpress: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<Function>) {
    const { arg, value } = binding
    if (isFunction(value)) {
      const milliseconds = arg ? Number(arg) : 1000
      let timer = null
      const clear = () => {
        if (clear) {
          clearTimeout(timer)
          timer = null
        }
      }
      const onDown = (ev: PointerEvent) => {
        clear()
        ev.preventDefault()
        if (timer === null) {
          timer = setTimeout(() => value(), milliseconds)
        }
      }
      useEventListener(el, 'pointerdown', onDown)
      useEventListener(el, 'pointerup', clear)
      useEventListener(el, 'pointerleave', clear)
    } else {
      throw new Error('Directive: longpress: callback must be a function')
    }
  }
}
