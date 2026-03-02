type Recordable<T = unknown> = Record<string, T>

type AnyObject = Recordable<unknown>

type Fn<T = void, TArgs extends unknown[] = unknown[]> = (...args: TArgs) => T

type Noop = () => void

type Nullable<T> = T | null | undefined

type Arrayable<T> = T | T[]

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

type PromiseFn<T = unknown, TArgs extends unknown[] = unknown[]> = (...args: TArgs) => Promise<T>

type StringNumber = string | number
