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
import { ref, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import type { MenuInst, MenuOption } from 'naive-ui'
import { usePermissionStore, useAppStore } from '@/store'
import { openLink } from '@/utils'
import { transformRoutesToMenus } from '@/utils/menu'

const app = useAppStore()
const permissionStore = usePermissionStore()
const { layout, sidebar } = storeToRefs(app)
const { routes } = storeToRefs(permissionStore)
const menuOptions = computed(() => {
  const menus = transformRoutesToMenus(routes.value)
  if (app.layout === 'horizontal') {
    return menus
  }

  // 其他布局：移除子菜单，只显示一级菜单
  return menus.map((o) => {
    const { children, ...option } = o
    return option
  })
})

const route = useRoute()
const router = useRouter()
const activeMenu = computed(() => {
  if (app.layout === 'horizontal') {
    return route.meta?.activePath || route.path
  }
  return route.matched[1]?.path || route.path
})

const menuRef = ref<Nullable<MenuInst>>(null)

/**
 * 监听路由变化，自动展开对应菜单项
 */
watch(route, async () => {
  await nextTick()
  menuRef.value?.showOption?.()
})

const handleClick = (key: string, item: MenuOption) => {
  if (item?.isLink) {
    openLink(item.linkUrl as string)
  } else {
    router.push(key).catch((err) => {
      console.error('路由跳转失败:', err)
    })
  }
}
</script>
