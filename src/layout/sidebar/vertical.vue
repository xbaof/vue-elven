<template>
  <logo v-if="sidebar.showLogo" class="logo" />
  <n-scrollbar class="flex-1">
    <n-menu
      ref="menuRef"
      :value="activeMenu"
      :options="menuOptions"
      :collapsed="!sidebar.opened"
      :accordion="sidebar.accordion"
      :inverted="inverted"
      :collapsed-width="58"
      :indent="20"
      :icon-size="18"
      :collapsed-icon-size="18"
      @update:value="handleClick"
    />
  </n-scrollbar>
  <collapse v-if="app.device === 'desktop'" class="collapse pl-18" />
</template>
<script setup lang="ts">
import { ref, computed, watch, watchEffect, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { usePermissionStore, useAppStore } from '@/store'
import { MenuInst, type MenuOption } from 'naive-ui'
import { openLink } from '@/utils'
import { transformRoutesToMenus } from '@/utils/menu'
import Logo from './logo.vue'
import Collapse from './collapse.vue'

const app = useAppStore()
const permissionStore = usePermissionStore()
const route = useRoute()
const router = useRouter()

const { sidebar, isDark } = storeToRefs(app)
const { routes } = storeToRefs(permissionStore)

/**
 * 菜单选项
 * 根据布局模式和设备类型动态生成
 */
const menuOptions = computed(() => {
  const menus = transformRoutesToMenus(routes.value)

  // 垂直布局或移动端：显示完整菜单
  if (app.layout === 'vertical' || app.device === 'mobile') {
    return menus
  }

  // 混合布局：显示当前路由的子菜单
  const matchedPath = route.matched[1]?.path
  if (!matchedPath) return menus

  const menuOption = menus.find((o) => o.key === matchedPath)
  return menuOption?.children ? menuOption.children : menuOption ? [menuOption] : []
})

/**
 * 当前激活的菜单项
 */
const activeMenu = computed(() => route.meta?.activePath || route.path)

const menuRef = ref<Nullable<MenuInst & { cssVars: Recordable<string> }>>(null)
/**
 * 监听路由变化，自动展开对应菜单项
 */
watch(route, async () => {
  await nextTick()
  menuRef.value?.showOption?.()
})

/**
 * 处理菜单点击事件
 */
const handleClick = (key: string, item: MenuOption) => {
  if (item?.isLink) {
    openLink(item.linkUrl as string)
  } else {
    router.push(key).catch((err) => {
      console.error('路由跳转失败:', err)
    })
  }
}

const iconColor = ref('')
const iconColorHover = ref('')

const initCssVars = () => {
  const cssVars = menuRef.value?.cssVars
  if (cssVars) {
    iconColor.value = cssVars['--n-item-text-color'] || ''
    iconColorHover.value = cssVars['--n-item-text-color-child-active'] || ''
  }
}

const inverted = computed(() => app.sidebar.inverted)

/**
 * 监听主题变化，更新图标颜色
 */
watchEffect(() => {
  ;(inverted.value || isDark.value || !(inverted.value || isDark.value)) &&
    nextTick(() => {
      initCssVars()
    })
})
</script>
<style lang="scss" scoped>
.logo {
  width: 100%;
  height: 50px;
  color: var(--n-text-color);
}

.collapse {
  height: 40px;
  box-shadow: 0 0 6px -3px var(--n-text-color);

  :deep(.n-icon) {
    color: v-bind(iconColor);

    &:hover {
      color: v-bind(iconColorHover);
    }
  }
}
</style>
