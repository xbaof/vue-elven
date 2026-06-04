import request from '@/api/http'
import type { ResData } from '@/api/common.types'
import type { User } from './types/user'

// 获取登录用户信息
export const getUser = (): Promise<ResData<User>> => {
  return request.get<User>(`/getUser`)
}
