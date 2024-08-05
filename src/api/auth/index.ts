import request from '@/utils/request'

// 用户登录接口
export const login = (params: Login.LoginParam) => {
  return request.post<Login.LoginResult>(`/login`, params)
}
// 获取登录用户信息
export const getUser = () => {
  return request.get<Login.UserInfo>(`/getUser`)
}
