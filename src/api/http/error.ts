import axios, { type AxiosError } from 'axios'
import { StatusCodeEnum } from '@/enums/httpEnum'
import { normalizeUnknownError as normalizeBaseUnknownError } from '@/utils/error'
import type { NormalizedError } from './types'

const defaultRequestFailedMessage = '请求失败，请稍后重试'

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

const normalizeAxiosError = (error: AxiosError): NormalizedError => {
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

export const normalizeUnknownError = (error: unknown, fallbackMessage?: string): NormalizedError => {
  if (axios.isAxiosError(error)) {
    const normalizedError = normalizeAxiosError(error)
    if (fallbackMessage && normalizedError.kind === 'unknown') {
      return {
        ...normalizedError,
        message: fallbackMessage
      }
    }
    return normalizedError
  }

  return normalizeBaseUnknownError(error, fallbackMessage)
}
