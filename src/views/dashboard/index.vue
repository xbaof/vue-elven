<template>
  <div class="main-content">
    <n-dropdown trigger="click" :options="options" :show-arrow="true">
      <n-button>找个地方休息</n-button>
    </n-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui'
import { computed, defineComponent, ref } from 'vue'
import IconPicker from '@/components/IconPicker/index.vue'
import { useEventListener, useDebounceFn, useThrottleFn } from '@vueuse/core'
const icon = ref<string>('aaaaaaaaaaa')
const msg = useMessage()
const fn = (v) => {
  msg.success(icon.value)
}
const options = [
  {
    label: '滨海湾金沙，新加坡',
    key: 'marina bay sands',
    disabled: true
  },
  {
    label: '布朗酒店，伦敦',
    key: "brown's hotel, london"
  },
  {
    label: '亚特兰蒂斯巴哈马，拿骚',
    key: 'atlantis nahamas, nassau'
  },
  {
    label: '比佛利山庄酒店，洛杉矶',
    key: 'the beverly hills hotel, los angeles'
  }
]
</script>
