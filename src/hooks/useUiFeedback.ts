import { useMessage } from 'naive-ui'
import { canShowNormalizedError, markNormalizedErrorShown, normalizeNormalizeError } from '@/api/http'

type MessageKind = 'success' | 'error' | 'warning' | 'info'

const defaultFallbackErrorMessage = '操作失败，请稍后重试'

/**
 * 统一消息反馈能力。
 */
export const useUiFeedback = () => {
  const messageApi = useMessage()

  /**
   * 按类型显示消息提示。
   */
  const message = (messageKind: MessageKind, messageText: string): string => {
    switch (messageKind) {
      case 'success':
        messageApi.success(messageText)
        break
      case 'error':
        messageApi.error(messageText)
        break
      case 'warning':
        messageApi.warning(messageText)
        break
      case 'info':
        messageApi.info(messageText)
        break
      default:
        messageApi.info(messageText)
        break
    }
    return messageText
  }

  /**
   * 显示全局加载消息，并返回关闭函数。
   */
  const startLoading = (content = '加载中...'): Noop => {
    const loadingMessage = messageApi.loading(content, { duration: 0 })
    return () => loadingMessage.destroy()
  }

  /**
   * 基于 unknown 错误对象显示错误提示，并返回最终文案。
   */
  const msgErrorFromUnknown = (error: unknown, fallbackMessage = defaultFallbackErrorMessage): string => {
    const normalizedError = normalizeNormalizeError(error, fallbackMessage)
    if (!canShowNormalizedError(normalizedError)) {
      return normalizedError.message
    }

    markNormalizedErrorShown(normalizedError)
    return message('error', normalizedError.message)
  }

  return {
    message,
    msgSuccess: (messageText: string): string => message('success', messageText),
    msgError: (messageText: string): string => message('error', messageText),
    msgWarning: (messageText: string): string => message('warning', messageText),
    msgInfo: (messageText: string): string => message('info', messageText),
    startLoading,
    msgErrorFromUnknown
  }
}
