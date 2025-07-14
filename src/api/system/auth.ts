import request from '@/utils/request'
import type { Menu } from './menu'

export interface LoginParam {
  userName: string
  password: string
  verifyCode: string
  captchaId: string
}
export interface LoginResult {
  token: string
}

export interface UserPermission {
  menus: Menu[]
  perms: string[]
}

// 用户登录接口
export const login = (params: LoginParam) => {
  return request.post<LoginResult>(`/login`, params)
}

// 获取用户权限及路由菜单
export const getPermission = () => {
  return request.get<UserPermission>(`/getPermission`)
}
