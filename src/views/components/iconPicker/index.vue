<template>
  <n-card size="small" :segmented="{ content: true }">
    <template #header>
      <p>图标选择器</p>
      <span class="describe"> 基于 n-select 和 n-virtual-list 封装，支持 IconPark 和本地 SVG 图标 </span>
    </template>
    <IconPicker v-model="val" clearable placeholder="输入关键词搜索" />
  </n-card>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'IconPicker'
})
import { ref } from 'vue'
import IconPicker from '@/components/IconPicker/index.vue'
const val = ref(null)
</script>
<style scoped>
.describe {
  font-size: 14px;
  color: var(--text-color-2);
}
</style>
