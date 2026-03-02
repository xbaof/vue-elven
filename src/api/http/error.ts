import axios, { type AxiosError } from 'axios'
import { StatusCodeEnum } from '@/enums/httpEnum'
import type { RequestError } from './types'

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
  const message = error.message || ''
  const lowerMessage = message.toLowerCase()

  if (error.code === 'ERR_CANCELED') {
    return {
      kind: 'canceled',
      message: '请求已取消',
      raw: error
    }
  }

  if (lowerMessage.includes('network error')) {
    return {
      kind: 'network',
      message: '网络连接异常，请检查网络后重试',
      raw: error
    }
  }

  if (error.code === 'ECONNABORTED' || lowerMessage.includes('timeout')) {
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
    message: '请求失败，请稍后重试',
    raw: error
  }
}

export const normalizeRequestError = (error: unknown): RequestError => {
  if (isRequestError(error)) {
    return error
  }

  if (axios.isAxiosError(error)) {
    return normalizeAxiosError(error)
  }

  if (error instanceof Error && error.message) {
    return {
      kind: 'unknown',
      message: error.message,
      raw: error
    }
  }

  return {
    kind: 'unknown',
    message: '未知错误，请稍后重试',
    raw: error
  }
}

export const getRequestErrorMessage = (error: unknown): string => {
  return normalizeRequestError(error).message
}
