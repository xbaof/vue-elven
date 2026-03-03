import axios, { type AxiosResponse, type CreateAxiosDefaults } from 'axios'
import { StatusCodeEnum } from '@/enums/httpEnum'
import { useAuthStore } from '@/store'
import type { ResData } from '@/api/common.types'
import { addPendingRequest, clearAllPendingRequests, removePendingRequest } from './cancel'
import { canShowRequestError, isRequestError, markRequestErrorShown, normalizeRequestError } from './error'
import type { HttpRequestMethods, InternalRequestConfig, RequestConfig, RequestError, RequestOptions } from './types'

const defaultConfig: CreateAxiosDefaults = {
  timeout: 10 * 1000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
}

const shouldShowErrorMessage = (config?: RequestConfig): boolean => {
  return config?.showErrorMessage !== false
}

const showRequestErrorMessage = (messageText: string): void => {
  if (window.$message) {
    window.$message.error(messageText)
  }
}

const service = axios.create(defaultConfig)

service.interceptors.request.use(
  (config) => {
    const requestConfig = config as InternalRequestConfig
    const authStore = useAuthStore()
    const token = authStore.token

    if (token && requestConfig.headers) {
      requestConfig.headers.Authorization = `Bearer ${token}`
    }

    requestConfig.cancel ??= true
    return addPendingRequest(requestConfig)
  },
  (error: unknown) => Promise.reject(normalizeRequestError(error))
)

service.interceptors.response.use(
  (response: AxiosResponse<ResData<unknown>>) => {
    const responseConfig = response.config as RequestConfig
    removePendingRequest(responseConfig)

    const responseData = response.data
    const statusCode = responseData?.code ?? StatusCodeEnum.INTERNAL_SERVER_ERROR
    if (statusCode !== StatusCodeEnum.SUCCESS) {
      const requestError: RequestError = {
        kind: 'business',
        code: statusCode,
        message: responseData?.msg || '业务处理失败，请稍后重试',
        raw: responseData
      }

      if (canShowRequestError(requestError, shouldShowErrorMessage(responseConfig))) {
        showRequestErrorMessage(requestError.message)
        markRequestErrorShown(requestError)
      }
      return Promise.reject(requestError)
    }

    return response
  },
  (error: unknown) => {
    const requestConfig = axios.isAxiosError(error) ? (error.config as RequestConfig) : undefined
    if (requestConfig) {
      removePendingRequest(requestConfig)
    }

    const requestError = normalizeRequestError(error)
    const shouldDisplayMessage = !requestConfig || shouldShowErrorMessage(requestConfig)
    if (canShowRequestError(requestError, shouldDisplayMessage)) {
      showRequestErrorMessage(requestError.message)
      markRequestErrorShown(requestError)
    }
    return Promise.reject(requestError)
  }
)

const sendRequest = <T>(config: RequestConfig): Promise<ResData<T>> => {
  return service.request<ResData<T>>(config).then((response) => response.data)
}

const request: HttpRequestMethods = {
  request<T>(config: RequestConfig): Promise<ResData<T>> {
    return sendRequest<T>(config)
  },
  get<T>(url: string, params?: Recordable, options: RequestOptions = {}): Promise<ResData<T>> {
    return sendRequest<T>({
      url,
      method: 'get',
      params,
      ...options
    })
  },
  post<T>(url: string, params?: unknown, options: RequestOptions = {}): Promise<ResData<T>> {
    return sendRequest<T>({
      url,
      method: 'post',
      data: params,
      ...options
    })
  },
  put<T>(url: string, params?: unknown, options: RequestOptions = {}): Promise<ResData<T>> {
    return sendRequest<T>({
      url,
      method: 'put',
      data: params,
      ...options
    })
  },
  delete<T>(url: string, params?: Recordable, options: RequestOptions = {}): Promise<ResData<T>> {
    return sendRequest<T>({
      url,
      method: 'delete',
      params,
      ...options
    })
  }
}

export default request

export { canShowRequestError, clearAllPendingRequests, isRequestError, markRequestErrorShown, normalizeRequestError }
export type { RequestConfig, RequestError, RequestErrorKind, RequestOptions } from './types'
