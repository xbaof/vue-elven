import request from '@/utils/request'
import type { Menu } from './types'

/**
 * 菜单管理 API
 */

// 获取菜单列表
export const getMenuList = () => {
  return request.get<Menu[]>(`/menu/list`)
}

// 获取菜单详情
export const getMenuDetail = (id: string | number) => {
  return request.get<Menu>(`/menu/${id}`)
}

// 创建菜单
export const createMenu = (data: Partial<Menu>) => {
  return request.post<Menu>(`/menu`, data)
}

// 更新菜单
export const updateMenu = (id: string | number, data: Partial<Menu>) => {
  return request.put<Menu>(`/menu/${id}`, data)
}

// 删除菜单
export const deleteMenu = (id: string | number) => {
  return request.delete(`/menu/${id}`)
}
