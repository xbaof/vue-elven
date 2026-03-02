import type { InternalRequestConfig, RequestConfig } from './types'

const pendingRequestMap = new Map<string, AbortController>()

const serializeValue = (value: unknown): string => {
  if (value === undefined) {
    return ''
  }

  if (value instanceof URLSearchParams) {
    return value.toString()
  }

  if (value instanceof FormData) {
    const formEntries: string[] = []
    value.forEach((formValue, formKey) => {
      if (formValue instanceof File) {
        formEntries.push(`${formKey}:${formValue.name}:${formValue.size}:${formValue.type}`)
        return
      }
      formEntries.push(`${formKey}:${String(formValue)}`)
    })
    return formEntries.join('&')
  }

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

export const createRequestKey = (config: RequestConfig): string => {
  if (config.cancelKey && config.cancelKey.trim()) {
    return config.cancelKey.trim()
  }

  const method = (config.method || 'get').toLowerCase()
  const url = config.url || ''
  const paramsKey = serializeValue(config.params)
  const dataKey = serializeValue(config.data)
  return `${method}|${url}|${paramsKey}|${dataKey}`
}

export const addPendingRequest = (config: InternalRequestConfig): InternalRequestConfig => {
  if (config.cancel === false) {
    return config
  }

  const requestKey = createRequestKey(config)
  config.requestKey = requestKey

  const existingController = pendingRequestMap.get(requestKey)
  if (existingController) {
    existingController.abort()
    pendingRequestMap.delete(requestKey)
  }

  const abortController = new AbortController()
  config.signal = abortController.signal
  pendingRequestMap.set(requestKey, abortController)
  return config
}

export const removePendingRequest = (config?: RequestConfig): void => {
  if (!config || config.cancel === false) {
    return
  }

  const requestKey = config.requestKey || createRequestKey(config)
  pendingRequestMap.delete(requestKey)
}

export const clearAllPendingRequests = (): void => {
  pendingRequestMap.forEach((abortController) => abortController.abort())
  pendingRequestMap.clear()
}
