import axios, {
  type AxiosInstance,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
  type AxiosError,
  type AxiosResponse
} from 'axios'
import { StatusCodeEnum } from '@/enums/httpEnum'
import { useAuthStore } from '@/store'

const defaultConfig: CreateAxiosDefaults = {
  timeout: 10 * 1000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
}

class HttpRequest {
  service: AxiosInstance
  constructor() {
    this.service = axios.create(defaultConfig)

    /** 请求拦截器 */
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const auth = useAuthStore()
        // 获取token
        const token = auth.token
        if (token) {
          config.headers.Authorization = 'Bearer ' + token
        }
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    /** 响应拦截器 */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const data = response.data
        const statusCode = data.code || StatusCodeEnum.INTERNAL_SERVER_ERROR
        if (statusCode !== StatusCodeEnum.SUCCESS) {
          window.$message.error(data.msg || '未知错误，请重试')
          return Promise.reject(data)
        }
        return data
      },
      (error: AxiosError) => {
        /* 404 401刷新token等情况 后续完善 */
        const { response, message } = error
        if (message.indexOf('Network Error') !== -1) window.$message.error('后端接口连接异常!')
        if (message.indexOf('timeout') !== -1) window.$message.error('请求超时!请您稍后重试')
        if (response) {
          switch (response.status) {
            // 未登录
            case StatusCodeEnum.UNAUTHORIZED:
              window.$message.error('401令牌失效。刷新token等情况 待完善')
              break
            case StatusCodeEnum.FORBIDDEN:
              window.$message.error('很抱歉，您的访问权限等级不够，请联系管理员!')
              break
            case StatusCodeEnum.NOT_FOUND:
              window.$message.error('你所访问的资源不存在!')
              break
            case StatusCodeEnum.INTERNAL_SERVER_ERROR:
              window.$message.error('系统内部错误!')
              break
            default:
              window.$message.error(`连接出错${response.status}!`)
              break
          }
        }
        return Promise.reject(error)
      }
    )
  }

  // 常用请求方法封装
  get<T>(url: string, params?: object, _object = {}): Promise<ResultModel<T>> {
    return this.service.get(url, { params, ..._object })
  }
  post<T>(url: string, params?: object, _object = {}): Promise<ResultModel<T>> {
    return this.service.post(url, params, _object)
  }
  put<T>(url: string, params?: object, _object = {}): Promise<ResultModel<T>> {
    return this.service.put(url, params, _object)
  }
  delete<T>(url: string, params?: any, _object = {}): Promise<ResultModel<T>> {
    return this.service.delete(url, { params, ..._object })
  }
}

export default new HttpRequest()
