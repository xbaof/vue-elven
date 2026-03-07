<template>
  <div class="collapse-wrapper">
    <svg-icon :icon="currentIcon" :size="iconSize" @click.stop="handleClick" />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import menuUnfoldOneIcon from '@iconify-icons/icon-park-outline/menu-unfold-one'
import menuFoldOneIcon from '@iconify-icons/icon-park-outline/menu-fold-one'
import { useAppStore } from '@/store/modules/app'

defineOptions({
  name: 'SidebarCollapse'
})

interface Props {
  iconSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  iconSize: 20
})

const app = useAppStore()
const { sidebar } = storeToRefs(app)

const currentIcon = computed(() => {
  return sidebar.value.opened ? menuUnfoldOneIcon : menuFoldOneIcon
})

const handleClick = () => {
  app.toggleSidebar(sidebar.value.opened)
}
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
