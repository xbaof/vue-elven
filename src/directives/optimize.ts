import { useDebounceFn, useEventListener, useThrottleFn } from '@vueuse/core'
import type { Directive, DirectiveBinding } from 'vue'
import { isFunction } from '@/utils/is'

type OptimizeMode = 'debounce' | 'throttle'

export interface OptimizeOptions {
  /** 事件名 */
  event: string
  /** 触发函数 */
  fn: Fn<unknown, unknown[]>
  /** 延迟时间 */
  timeout?: number
}

const DEFAULT_DEBOUNCE_TIMEOUT = 200
const DEFAULT_THROTTLE_TIMEOUT = 1000

/**
 * 解析指令模式，非法值时回退为 debounce。
 */
const parseOptimizeMode = (arg?: string): OptimizeMode => {
  if (arg === 'debounce' || arg === 'throttle') {
    return arg
  }
  return 'debounce'
}

/**
 * 解析延迟参数，非法值时按模式使用默认值。
 */
const parseOptimizeTimeout = (timeout: number | undefined, mode: OptimizeMode): number => {
  if (typeof timeout === 'number' && Number.isFinite(timeout) && timeout > 0) {
    return timeout
  }
  return mode === 'debounce' ? DEFAULT_DEBOUNCE_TIMEOUT : DEFAULT_THROTTLE_TIMEOUT
}

/**
 * 防抖与节流指令：
 * `v-optimize` 或 `v-optimize:debounce` 为防抖，
 * `v-optimize:throttle` 为节流。
 */
export const optimize: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<OptimizeOptions>) {
    const { arg, value } = binding
    const mode = parseOptimizeMode(arg)
    if (arg && mode !== arg) {
      throw new Error('Directive v-optimize: only `debounce` and `throttle` are supported')
    }

    if (!value || !value.event || !isFunction(value.fn)) {
      throw new Error('Directive v-optimize: `event` and `fn` are required, and `fn` must be a function')
    }

    const timeout = parseOptimizeTimeout(value.timeout, mode)

    useEventListener(
      el,
      value.event,
      mode === 'debounce' ? useDebounceFn(value.fn, timeout) : useThrottleFn(value.fn, timeout, true)
    )
  }
}
