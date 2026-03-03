import axios, { type AxiosError } from 'axios'
import { StatusCodeEnum } from '@/enums/httpEnum'
import type { RequestError } from './types'

const defaultUnknownErrorMessage = '未知错误，请稍后重试'
const defaultRequestFailedMessage = '请求失败，请稍后重试'

export const isRequestError = (error: unknown): error is RequestError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'kind' in error &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  )
}

const getHttpStatusMessage = (status: number): string => {
  switch (status) {
    case StatusCodeEnum.UNAUTHORIZED:
      return '登录状态已失效，请重新登录'
    case StatusCodeEnum.FORBIDDEN:
      return '无权限访问该资源'
    case StatusCodeEnum.NOT_FOUND:
      return '请求资源不存在'
    case StatusCodeEnum.INTERNAL_SERVER_ERROR:
      return '服务器内部错误，请稍后重试'
    default:
      return `请求失败（HTTP ${status}）`
  }
}

const normalizeAxiosError = (error: AxiosError): RequestError => {
  const messageText = error.message || ''
  const lowerMessageText = messageText.toLowerCase()

  if (error.code === 'ERR_CANCELED') {
    return {
      kind: 'canceled',
      message: '请求已取消',
      raw: error
    }
  }

  if (lowerMessageText.includes('network error')) {
    return {
      kind: 'network',
      message: '网络连接异常，请检查网络后重试',
      raw: error
    }
  }

  if (error.code === 'ECONNABORTED' || lowerMessageText.includes('timeout')) {
    return {
      kind: 'timeout',
      message: '请求超时，请稍后重试',
      raw: error
    }
  }

  if (error.response) {
    return {
      kind: 'http',
      status: error.response.status,
      message: getHttpStatusMessage(error.response.status),
      raw: error
    }
  }

  return {
    kind: 'unknown',
    message: defaultRequestFailedMessage,
    raw: error
  }
}

/**
 * 是否允许展示请求错误消息。
 */
export const canShowRequestError = (requestError: RequestError, showErrorMessage: boolean = true): boolean => {
  if (!showErrorMessage) {
    return false
  }
  if (requestError.kind === 'canceled') {
    return false
  }
  return requestError.messageShown !== true
}

/**
 * 标记错误消息已展示，避免重复弹窗。
 */
export const markRequestErrorShown = (requestError: RequestError): RequestError => {
  requestError.messageShown = true
  return requestError
}

export const normalizeRequestError = (error: unknown, fallbackMessage?: string): RequestError => {
  if (isRequestError(error)) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const requestError = normalizeAxiosError(error)
    if (fallbackMessage && requestError.kind === 'unknown') {
      return {
        ...requestError,
        message: fallbackMessage
      }
    }
    return requestError
  }

  if (error instanceof Error && error.message) {
    return {
      kind: 'unknown',
      message: error.message,
      raw: error
    }
  }

  if (fallbackMessage) {
    return {
      kind: 'unknown',
      message: fallbackMessage,
      raw: error
    }
  }

  return {
    kind: 'unknown',
    message: defaultUnknownErrorMessage,
    raw: error
  }
}
