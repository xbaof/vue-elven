<template>
  <div class="collapse-wrapper">
    <svg-icon :icon="currentIcon" :size="iconSize" @click.stop="handleClick" />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store'
import menuFoldOne from '@iconify-icons/icon-park-outline/menu-fold-one'
import menuUnfoldOne from '@iconify-icons/icon-park-outline/menu-unfold-one'

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

const currentIcon = computed(() => (sidebar.value.opened ? menuUnfoldOne : menuFoldOne))

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
