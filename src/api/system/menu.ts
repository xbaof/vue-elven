import request from '@/api/http'
import type { ResData } from '@/api/common.types'
import type { Menu, MenuIdInput, MenuMutationPayload } from './types/menu'

/**
 * 菜单管理 API
 */

// 获取菜单列表
export const getMenuList = (): Promise<ResData<Menu[]>> => {
  return request.get<Menu[]>(`/menu/list`)
}

// 获取菜单详情
export const getMenuDetail = (id: MenuIdInput): Promise<ResData<Menu>> => {
  return request.get<Menu>(`/menu/${id}`)
}

// 创建菜单
export const createMenu = (data: MenuMutationPayload): Promise<ResData<Menu>> => {
  return request.post<Menu>(`/menu`, data)
}

// 更新菜单
export const updateMenu = (data: MenuMutationPayload): Promise<ResData<Menu>> => {
  return request.put<Menu>(`/menu`, data)
}

// 删除菜单
export const deleteMenu = (id: MenuIdInput): Promise<ResData<unknown>> => {
  return request.delete<unknown>(`/menu/${id}`)
}
