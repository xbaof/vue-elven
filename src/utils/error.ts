import type { NormalizedError } from '@/api/http/types'

const defaultUnknownErrorMessage = '未知错误，请稍后重试'

export const isNormalizedError = (error: unknown): error is NormalizedError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'kind' in error &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  )
}

export const canShowNormalizedError = (normalizedError: NormalizedError, showErrorMessage: boolean = true): boolean => {
  if (!showErrorMessage) {
    return false
  }
  if (normalizedError.kind === 'canceled') {
    return false
  }
  return normalizedError.messageShown !== true
}

export const markNormalizedErrorShown = (normalizedError: NormalizedError): NormalizedError => {
  normalizedError.messageShown = true
  return normalizedError
}

export const normalizeUnknownError = (error: unknown, fallbackMessage?: string): NormalizedError => {
  if (isNormalizedError(error)) {
    return error
  }

  const message =
    error instanceof Error && error.message ? error.message : fallbackMessage || defaultUnknownErrorMessage

  return {
    kind: 'unknown',
    message,
    raw: error
  }
}
