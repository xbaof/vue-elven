import request from '@/utils/request'
import type { ReqLogin, ResLogin, ResUserPermission } from './types/auth'

// 用户登录接口
export const login = (params: ReqLogin) => {
  return request.post<ResLogin>(`/login`, params)
}

// 获取用户权限及路由菜单
export const getPermission = () => {
  return request.get<ResUserPermission>(`/getPermission`)
}
