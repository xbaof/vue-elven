import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import type { ResData } from '@/api/common.types'

export type RequestErrorKind = 'business' | 'network' | 'timeout' | 'http' | 'canceled' | 'unknown'

export interface RequestError {
  kind: RequestErrorKind
  message: string
  status?: number
  code?: number
  raw?: unknown
}

export interface RequestOptions extends Omit<AxiosRequestConfig, 'url' | 'method' | 'params' | 'data' | 'signal'> {
  showErrorMessage?: boolean
  cancel?: boolean
  cancelKey?: string
}

export interface RequestConfig extends AxiosRequestConfig {
  showErrorMessage?: boolean
  cancel?: boolean
  cancelKey?: string
  requestKey?: string
}

export interface InternalRequestConfig extends InternalAxiosRequestConfig {
  showErrorMessage?: boolean
  cancel?: boolean
  cancelKey?: string
  requestKey?: string
}

export interface HttpRequestMethods {
  request<T>(config: RequestConfig): Promise<ResData<T>>
  get<T>(url: string, params?: Recordable, options?: RequestOptions): Promise<ResData<T>>
  post<T>(url: string, params?: unknown, options?: RequestOptions): Promise<ResData<T>>
  put<T>(url: string, params?: unknown, options?: RequestOptions): Promise<ResData<T>>
  delete<T>(url: string, params?: Recordable, options?: RequestOptions): Promise<ResData<T>>
}
