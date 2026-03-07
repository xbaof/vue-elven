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
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { MenuInst, type MenuOption } from 'naive-ui'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useMenuNavigate } from '@/hooks/useMenuNavigate'
import { transformRoutesToMenus } from '@/utils/menu'
import Logo from './logo.vue'
import Collapse from './collapse.vue'

const app = useAppStore()
const permissionStore = usePermissionStore()
const route = useRoute()
const { navigateByMenuOption } = useMenuNavigate()

const { isDark, sidebar } = storeToRefs(app)
const { routes } = storeToRefs(permissionStore)

/**
 * 菜单选项：根据布局模式和设备类型动态生成。
 */
const menuOptions = computed(() => {
  const menus = transformRoutesToMenus(routes.value)

  // 垂直布局或移动端显示完整菜单。
  if (app.layout === 'vertical' || app.device === 'mobile') {
    return menus
  }

  // 混合布局仅显示当前路由对应的子菜单。
  const matchedPath = route.matched[1]?.path
  if (!matchedPath) {
    return menus
  }

  const matchedMenuOption = menus.find((item) => item.key === matchedPath)
  return matchedMenuOption?.children ? matchedMenuOption.children : matchedMenuOption ? [matchedMenuOption] : []
})

/**
 * 当前激活的菜单项。
 */
const activeMenu = computed(() => route.meta?.activePath || route.path)

const menuRef = ref<Nullable<MenuInst & { cssVars: Recordable<string> }>>(null)

/**
 * 监听路由变化后自动展开对应菜单。
 */
watch(route, async () => {
  await nextTick()
  menuRef.value?.showOption?.()
})

/**
 * 处理菜单点击事件。
 */
const handleClick = (key: string, item: MenuOption): void => {
  void navigateByMenuOption(item, key)
}

const iconColor = ref('')
const iconColorHover = ref('')

const initCssVars = (): void => {
  const cssVars = menuRef.value?.cssVars
  if (cssVars) {
    iconColor.value = cssVars['--n-item-text-color'] || ''
    iconColorHover.value = cssVars['--n-item-text-color-child-active'] || ''
  }
}

const inverted = computed(() => app.sidebar.inverted)

/**
 * 主题变化时同步图标颜色。
 */
watchEffect(() => {
  if (inverted.value || isDark.value || !(inverted.value || isDark.value)) {
    nextTick(() => {
      initCssVars()
    })
  }
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
