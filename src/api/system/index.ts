import request from '@/utils/request'

// 获取用户权限及路由菜单
export const getPermission = () => {
  return request.get<Login.UserPermission>(`/getPermission`)
}
