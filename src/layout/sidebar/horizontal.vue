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
import { useAuthStore, useAppStore } from '@/store'
import type { MenuOption } from 'naive-ui'
import { openLink } from '@/utils'

const app = useAppStore()
const auth = useAuthStore()
const { layout, sidebar } = storeToRefs(app)
const menuOptions = computed(() => {
  if (app.layout === 'horizontal') {
    return auth.getMenus
  }
  return auth.getMenus.map((o) => {
    const option = Object.assign({}, o)
    if (option.children) delete option.children
    return option
  })
})

const route = useRoute()
const router = useRouter()
const activeMenu = computed(() => {
  if (app.layout === 'horizontal') {
    return route.meta?.activePath || route.path
  }
  return route.matched[1].path
})
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
</script>
