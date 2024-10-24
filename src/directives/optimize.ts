import { useEventListener, useDebounceFn, useThrottleFn } from '@vueuse/core'
import { isFunction } from '@/utils/is'
import { Directive, type DirectiveBinding } from 'vue'

export interface OptimizeOptions {
  /** 事件名 */
  event: string
  /** 事件触发的方法 */
  fn: (...params: any) => any
  /** 防抖或节流的延迟时间（防抖默认：`200`毫秒、节流默认：`1000`毫秒） */
  timeout?: number
}
/**
 * @description 防抖、节流指令
 * 防抖：v-optimize或v-optimize:debounce
 * 节流：v-optimize:throttle
 */
export const optimize: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<OptimizeOptions>) {
    const { arg, value } = binding
    const type = arg ?? 'debounce'
    if (['debounce', 'throttle'].includes(type)) {
      if (value && value.event && isFunction(value.fn)) {
        useEventListener(
          el,
          value.event,
          type === 'debounce'
            ? useDebounceFn(value.fn, value?.timeout ?? 200)
            : useThrottleFn(value.fn, value?.timeout ?? 1000, true)
        )
      } else {
        throw new Error('Directive v-optimize: `event` and `fn` are required, and `fn` must be a function')
      }
    } else {
      throw new Error('Directive v-optimize: only `debounce` and `throttle` are supported')
    }
  }
}
