<template>
  <n-menu
    ref="menuRef"
    responsive
    mode="horizontal"
    :value="activeMenu"
    :options="menuOptions"
    :inverted="layout === 'horizontal' && sidebar.inverted"
    :collapsed-width="58"
    :indent="20"
    :icon-size="18"
    :collapsed-icon-size="18"
    @update:value="handleClick"
  />
</template>
<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import type { MenuInst, MenuOption } from 'naive-ui'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useMenuNavigate } from '@/hooks/useMenuNavigate'
import { transformRoutesToMenus } from '@/utils/menu'

const app = useAppStore()
const permissionStore = usePermissionStore()
const { navigateByMenuOption } = useMenuNavigate()
const { layout, sidebar } = storeToRefs(app)
const { routes } = storeToRefs(permissionStore)

const menuOptions = computed(() => {
  const menus = transformRoutesToMenus(routes.value)
  if (app.layout === 'horizontal') {
    return menus
  }

  // 其他布局只显示一级菜单。
  return menus.map((item) => {
    const { children, ...option } = item
    return option
  })
})

const route = useRoute()
const activeMenu = computed(() => {
  if (app.layout === 'horizontal') {
    return route.meta?.activePath || route.path
  }
  return route.matched[1]?.path || route.path
})

const menuRef = ref<Nullable<MenuInst>>(null)

/**
 * 监听路由变化后自动展开对应菜单。
 */
watch(route, async () => {
  await nextTick()
  menuRef.value?.showOption?.()
})

const handleClick = (key: string, item: MenuOption): void => {
  void navigateByMenuOption(item, key)
}
</script>
