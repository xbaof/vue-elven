import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    showErrorMessage?: boolean
  }
}
