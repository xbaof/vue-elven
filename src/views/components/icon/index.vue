<template>
  <n-flex vertical :size="15" class="main-content">
    <n-list bordered>
      <n-list-item>
        <n-thing title="图标选择器" description="基于 n-select 和 n-virtual-list 封装，支持 IconPark 和本地 SVG 图标" />
      </n-list-item>
      <n-list-item>
        <IconPicker v-model="val" clearable placeholder="输入关键词搜索" />
      </n-list-item>
    </n-list>
    <n-list bordered>
      <n-list-item>
        <n-thing title="IconPark 示例">
          <n-alert title="提示" type="warning"> 除菜单、图标选择器使用在线图标渲染以外，其他组件使用本地图标 </n-alert>
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-grid cols="2 s:4 m:6 l:8 xl:12" item-responsive responsive="screen">
          <n-grid-item
            v-for="demoIcon in demoIconList"
            :key="demoIcon.iconValue"
            class="item-icon"
            @click="handleCopy(demoIcon.iconValue)"
          >
            <svg-icon :size="30" :icon="demoIcon.iconData" />
          </n-grid-item>
        </n-grid>
      </n-list-item>
    </n-list>
    <n-list bordered>
      <n-list-item>
        <n-thing title="SVG 图标示例" description="svg文件存放在src/assets/svg文件夹下" />
      </n-list-item>
      <n-list-item>
        <n-grid cols="2 s:4 m:6 l:8 xl:12" item-responsive responsive="screen">
          <n-grid-item class="item-icon" @click="handleCopy('local:vite')">
            <svg-icon :size="30" icon="local:vite" />
          </n-grid-item>
        </n-grid>
      </n-list-item>
    </n-list>
  </n-flex>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'Icon'
})

import { defineAsyncComponent, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useUiFeedback } from '@/hooks/useUiFeedback'
import { iconParkDemoList } from '@/constants/iconPark'

const IconPicker = defineAsyncComponent(() => import('@/components/IconPicker/index.vue'))
const demoIconList = iconParkDemoList

const { copy, isSupported } = useClipboard()
const uiFeedback = useUiFeedback()

const handleCopy = async (iconValue: string): Promise<void> => {
  if (!isSupported.value) {
    uiFeedback.msgWarning('当前环境不支持剪贴板复制')
    return
  }

  const snippet = `<svg-icon :size="30" icon="${iconValue}" />`
  await copy(snippet)
  uiFeedback.msgSuccess(`复制成功：${snippet}`)
}

const val = ref<string | null>(null)
</script>
<style scoped>
.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  cursor: pointer;
}
</style>
