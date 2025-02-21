import { onLongPress } from '@vueuse/core'
import { Directive, type DirectiveBinding } from 'vue'
import { isFunction } from '@/utils/is'

export const longpress: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<(evt: PointerEvent) => void>) {
    const { arg, value } = binding

    if (isFunction(value)) {
      const delay = arg ? Number(arg) : 1000
      onLongPress(el, value, {
        delay,
        modifiers: {
          stop: true
        }
      })
    } else {
      throw new Error('Directive: longpress: callback must be a function')
    }
  }
}
