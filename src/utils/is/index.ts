const toString = Object.prototype.toString

/**
 * 判断值是否为指定类型
 */
export function is(val: unknown, type: string): boolean {
  return toString.call(val) === `[object ${type}]`
}

/**
 * 是否为函数
 */
export function isFunction<T = Fn>(val: unknown): val is T {
  return typeof val === 'function' || is(val, 'Function')
}

/**
 * 是否已定义
 */
export const isDef = <T = unknown>(val?: T): val is Exclude<T, undefined> => {
  return typeof val !== 'undefined'
}

export const isUnDef = <T = unknown>(val?: T): val is undefined => {
  return !isDef(val)
}

/**
 * 是否为对象
 */
export const isObject = (val: unknown): val is AnyObject => {
  return val !== null && is(val, 'Object')
}

/**
 * 是否为时间对象
 */
export function isDate(val: unknown): val is Date {
  return is(val, 'Date')
}

/**
 * 是否为数字
 */
export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

/**
 * 是否为异步函数
 */
export function isAsyncFunction<T = unknown, TArgs extends unknown[] = unknown[]>(
  val: unknown
): val is (...args: TArgs) => Promise<T> {
  return is(val, 'AsyncFunction')
}

/**
 * 是否为 Promise
 */
export function isPromise<T = unknown>(val: unknown): val is Promise<T> {
  return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

/**
 * 是否为字符串
 */
export function isString(val: unknown): val is string {
  return is(val, 'String')
}

/**
 * 是否为布尔值
 */
export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

/**
 * 是否为数组
 */
export function isArray<T = unknown>(val: unknown): val is T[] {
  return Array.isArray(val)
}

/**
 * 是否为客户端环境
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined'
}

/**
 * 是否为 window 对象
 */
export const isWindow = (val: unknown): val is Window => {
  return typeof window !== 'undefined' && is(val, 'Window')
}

/**
 * 是否为 DOM 元素
 */
export const isElement = (val: unknown): val is Element => {
  return isObject(val) && 'tagName' in val
}

export const isServer = typeof window === 'undefined'

/**
 * 是否为图片元素节点
 */
export function isImageDom(o: unknown): o is HTMLImageElement {
  return isElement(o) && ['IMAGE', 'IMG'].includes(o.tagName)
}

export function isNull(val: unknown): val is null {
  return val === null
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val)
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

/**
 * 是否为外部链接
 */
export function isUrl(path: string): boolean {
  return /^(https?|ftp|mailto|tel):/.test(path)
}

/** 空数组 | 空字符串 | 空对象 | 空 Map | 空 Set */
export function isEmpty(val: unknown): boolean {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}
