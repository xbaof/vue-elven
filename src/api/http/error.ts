import axios from 'axios'
import { StatusCodeEnum } from '@/enums/httpEnum'

/**
 * 从未知错误中提取用户友好的错误消息
 */
export const getErrorMessage = (error: unknown): string => {
  // Axios 错误
  if (axios.isAxiosError(error)) {
    // 请求取消
    if (error.code === 'ERR_CANCELED') {
      return '请求已取消'
    }

    // 网络错误
    if (error.message?.includes('Network Error')) {
      return '网络连接异常，请检查网络后重试'
    }

    // 超时
    if (error.message?.includes('timeout')) {
      return '请求超时，请稍后重试'
    }

    // HTTP 错误
    if (error.response) {
      const status = error.response.status
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
  }

  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message || '操作失败，请稍后重试'
  }

  // 兜底消息
  return '未知错误，请稍后重试'
}
