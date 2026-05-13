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

// 部分可选类型
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// 部分必填类型
type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

// 提取对象值类型
type ValueOf<T> = T[keyof T]

// 提取特定类型的键
type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T]

// ID 类型
type ID = string | number

// 时间戳类型
type Timestamp = number

// 响应式引用类型简写
type MaybeRef<T> = T | import('vue').Ref<T>
