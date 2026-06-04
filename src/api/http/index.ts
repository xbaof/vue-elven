import axios, { type AxiosRequestConfig, type AxiosResponse, type CreateAxiosDefaults } from 'axios'
import { StatusCodeEnum } from '@/enums/httpEnum'
import type { ResData } from '@/api/common.types'
import { getErrorMessage } from './error'
import { getToken } from './tokenProvider'

const defaultConfig: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_BASE_URL || undefined,
  timeout: 10 * 1000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
}

const service = axios.create(defaultConfig)

// 请求拦截器：添加 token
service.interceptors.request.use(
  (config) => {
    // 添加 token
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: unknown) => {
    const message = getErrorMessage(error)
    window.$message.error(message)
    return Promise.reject(new Error(message))
  }
)

// 响应拦截器：处理业务错误和 HTTP 错误
service.interceptors.response.use(
  (response: AxiosResponse<ResData<unknown>>) => {
    const responseData = response.data
    const statusCode = responseData?.code ?? StatusCodeEnum.INTERNAL_SERVER_ERROR

    // 业务成功
    if (statusCode === StatusCodeEnum.SUCCESS) {
      return response
    }

    // 业务错误
    const errorMessage = responseData?.msg || '业务处理失败，请稍后重试'

    // 显示错误提示（除非明确关闭）
    if (response.config.showErrorMessage !== false) {
      window.$message.error(errorMessage)
    }

    return Promise.reject(new Error(errorMessage))
  },
  (error: unknown) => {
    const errorMessage = getErrorMessage(error)

    // 显示错误提示（请求取消不显示，或用户明确关闭）
    const isCanceled = axios.isAxiosError(error) && error.code === 'ERR_CANCELED'
    const config = axios.isAxiosError(error) ? error.config : undefined
    const shouldShow = !isCanceled && (!config || config.showErrorMessage !== false)

    if (shouldShow) {
      window.$message.error(errorMessage)
    }

    return Promise.reject(new Error(errorMessage))
  }
)

const sendRequest = <T>(config: AxiosRequestConfig): Promise<ResData<T>> => {
  return service.request<ResData<T>>(config).then((response) => response.data)
}

const request = {
  request<T>(config: AxiosRequestConfig): Promise<ResData<T>> {
    return sendRequest<T>(config)
  },
  get<T>(url: string, params?: Recordable, options: AxiosRequestConfig = {}): Promise<ResData<T>> {
    return sendRequest<T>({ url, method: 'get', params, ...options })
  },
  post<T>(url: string, params?: unknown, options: AxiosRequestConfig = {}): Promise<ResData<T>> {
    return sendRequest<T>({ url, method: 'post', data: params, ...options })
  },
  put<T>(url: string, params?: unknown, options: AxiosRequestConfig = {}): Promise<ResData<T>> {
    return sendRequest<T>({ url, method: 'put', data: params, ...options })
  },
  delete<T>(url: string, params?: Recordable, options: AxiosRequestConfig = {}): Promise<ResData<T>> {
    return sendRequest<T>({ url, method: 'delete', params, ...options })
  }
}

export default request
