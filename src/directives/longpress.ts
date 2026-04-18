import { onLongPress } from '@vueuse/core'
import type { Directive, DirectiveBinding } from 'vue'
import { isFunction } from '@/utils/is'

const DEFAULT_LONGPRESS_DELAY = 1000

/**
 * 解析长按延迟参数，非法值时回退默认值。
 */
const parseLongpressDelay = (arg?: string): number => {
  const parsedDelay = Number(arg)
  if (!Number.isFinite(parsedDelay) || parsedDelay <= 0) {
    return DEFAULT_LONGPRESS_DELAY
  }
  return parsedDelay
}

export const longpress: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<(evt: PointerEvent) => void>) {
    const { arg, value } = binding

    if (!isFunction(value)) {
      throw new Error('Directive longpress: callback must be a function')
    }

    onLongPress(el, value, {
      delay: parseLongpressDelay(arg),
      modifiers: { stop: true }
    })
  }
}
