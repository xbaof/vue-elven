type Recordable<T = any> = Record<string, T>

type AnyObject = Recordable<any>

type Fn<T = void> = (...args: any[]) => T

type Noop = () => void

type Nullable<T> = T | null | undefined

type Arrayable<T> = T | T[]

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type PromiseFn<T = any> = (...args: any[]) => Promise<T>

type StringNumber = string | number
