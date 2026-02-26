import request from '@/utils/request'
import type { User } from './types/user'

// 获取登录用户信息
export const getUser = () => {
  return request.get<User>(`/getUser`)
}
