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
import { useAuthStore, useAppStore } from '@/store'
import type { MenuOption } from 'naive-ui'
import { openLink } from '@/utils'
import Logo from './logo.vue'
import Collapse from './collapse.vue'

const app = useAppStore()
const auth = useAuthStore()
const { sidebar, isDark } = storeToRefs(app)
const menuOptions = computed(() => {
  if (app.layout === 'vertical' || app.device === 'mobile') {
    return auth.getMenus
  }
  const menuOption = auth.getMenus.find((o) => o.key === route.matched[1].path)
  return menuOption.children ? menuOption.children : [menuOption]
})
const route = useRoute()
const router = useRouter()
const activeMenu = computed(() => route.meta?.activePath || route.path)
const menuRef = ref(null)
watch(route, async () => {
  await nextTick()
  menuRef.value?.showOption()
})
const handleClick = (key: string, item: MenuOption) => {
  if (item?.isLink) {
    openLink(item?.linkUrl as string)
  } else {
    router.push(key).catch((err) => {
      console.log(err)
    })
  }
}
const iconColor = ref('')
const iconColorHover = ref('')
const initCssVars = () => {
  const cssVars = menuRef.value?.cssVars
  iconColor.value = cssVars['--n-item-text-color']
  iconColorHover.value = cssVars['--n-item-text-color-child-active']
}
const inverted = computed(() => app.sidebar.inverted)
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
