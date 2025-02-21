import request from '@/utils/request'

export interface User {
  nickName: string
  userName: string
  avatar: string
}

// 获取登录用户信息
export const getUser = () => {
  return request.get<User>(`/getUser`)
}
