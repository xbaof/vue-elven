import type { Directive, DirectiveBinding } from 'vue'
import { usePermissionStore } from '@/store/modules/permission'
import { isArray, isString } from '@/utils/is'

/**
 * v-permission 指令
 * 用法示例：
 *  - v-permission="'sys:user:add'"
 *  - v-permission=\"['sys:user:add', 'sys:user:update']\"
 * 当用户权限不满足时，会移除该元素。
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<Arrayable<string>>) {
    const { value } = binding
    const permissionStore = usePermissionStore()
    const userPerms = permissionStore.perms
    const requiredPerms = isString(value) ? [value] : isArray(value) ? value : []
    if (!requiredPerms.length) return

    const hasPermission = requiredPerms.some((perm) => userPerms.includes(perm))
    if (!hasPermission) el.parentNode?.removeChild(el)
  }
}
