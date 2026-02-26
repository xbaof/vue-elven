/**
 * API 通用类型定义
 * 所有 API 请求和响应的基础类型
 */

/**
 * 基础响应结构
 */
export interface Res {
  /** 业务状态码，通常 200 为成功 */
  code: number
  /** 是否成功 */
  success?: boolean
  /** 提示信息 */
  msg: string
}

/**
 * 带数据的响应结构
 * @template T 数据类型
 */
export interface ResData<T = any> extends Res {
  /** 具体数据 */
  data: T
}

/**
 * 分页基础参数
 */
export interface PageBase {
  /** 页码，从 1 开始 */
  pageNum?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 分页请求额外参数（用于扩展）
 * @template T 扩展字段类型
 */
export type ReqPageExtra<T = any> = {
  [P in keyof T]?: T[P]
}

/**
 * 分页请求参数
 * @template T 扩展字段类型
 */
export type ReqPage<T = any> = PageBase & ReqPageExtra<T>

/**
 * 分页响应结构
 * @template T 列表项类型
 */
export interface ResPage<T = any> extends PageBase {
  /** 数据列表 */
  list: T[]
  /** 总记录数 */
  total: number
}

/**
 * 排序参数
 */
export interface SortParams {
  /** 排序字段 */
  orderBy?: string
  /** 排序方式：asc 升序 | desc 降序 */
  orderType?: 'asc' | 'desc'
}

/**
 * 时间范围查询参数
 */
export interface TimeRangeParams {
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
}

/**
 * 带排序的分页请求
 * @template T 扩展字段类型
 */
export type ReqPageWithSort<T = any> = ReqPage<T> & SortParams

/**
 * 带时间范围的分页请求
 * @template T 扩展字段类型
 */
export type ReqPageWithTimeRange<T = any> = ReqPage<T> & TimeRangeParams

/**
 * 完整的分页请求（包含排序和时间范围）
 * @template T 扩展字段类型
 */
export type ReqPageFull<T = any> = ReqPage<T> & SortParams & TimeRangeParams

/**
 * ID 参数（单个）
 */
export interface IdParams {
  id: string | number
}

/**
 * ID 参数（多个）
 */
export interface IdsParams {
  ids: Array<string | number>
}

/**
 * 提取 API 响应数据类型
 * @example
 * type UserData = ExtractResData<ResData<User>>
 * // UserData = User
 */
export type ExtractResData<T> = T extends ResData<infer U> ? U : never

/**
 * 提取分页响应数据类型
 * @example
 * type UserPageData = ExtractResPageData<ResPage<User>>
 * // UserPageData = User
 */
export type ExtractResPageData<T> = T extends ResPage<infer U> ? U : never
