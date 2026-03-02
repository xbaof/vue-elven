import request from '@/api/http'
import type { ResData } from '@/api/common.types'
import type { ReqLogin, ResLogin, ResUserPermission } from './types/auth'

// 用户登录接口
export const login = (params: ReqLogin): Promise<ResData<ResLogin>> => {
  return request.post<ResLogin>(`/login`, params)
}

// 获取用户权限及路由菜单
export const getPermission = (): Promise<ResData<ResUserPermission>> => {
  return request.get<ResUserPermission>(`/getPermission`, undefined, {
    cancelKey: 'auth:getPermission'
  })
}
