import { useMessage } from 'naive-ui'
import { getErrorMessage } from '@/api/http/error'

/**
 * 统一消息反馈能力
 */
export const useUiFeedback = () => {
  const message = useMessage()

  const msgErrorFromUnknown = (error: unknown, fallbackMessage = '操作失败，请稍后重试'): string => {
    const errorMessage = getErrorMessage(error) || fallbackMessage
    message.error(errorMessage)
    return errorMessage
  }

  const startLoading = (content = '加载中...'): Noop => {
    const loadingMessage = message.loading(content, { duration: 0 })
    return () => loadingMessage.destroy()
  }

  return {
    message,
    msgSuccess: message.success,
    msgError: message.error,
    msgWarning: message.warning,
    msgInfo: message.info,
    startLoading,
    msgErrorFromUnknown
  }
}
