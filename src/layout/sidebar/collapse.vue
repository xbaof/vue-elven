<template>
  <div class="collapse-wrapper">
    <svg-icon
      :icon="sidebar.opened ? menuUnfoldOne : menuFoldOne"
      :size="iconSize"
      @click.stop="app.toggleSidebar(sidebar.opened)"
    />
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store'
import menuFoldOne from '@iconify-icons/icon-park-outline/menu-fold-one'
import menuUnfoldOne from '@iconify-icons/icon-park-outline/menu-unfold-one'
const { iconSize = 20 } = defineProps<{
  iconSize?: Number
}>()
const app = useAppStore()
const { sidebar } = storeToRefs(app)
</script>

<style lang="scss" scoped>
.collapse-wrapper {
  display: flex;
  align-items: center;

  .n-icon {
    cursor: pointer;
  }
}

.collapse-wrapper,
.n-icon {
  /* 快速点击时不选中内容 */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
  user-select: none; /* 标准语法 */
}
</style>
