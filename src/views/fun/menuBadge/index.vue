<template>
  <n-flex vertical :size="16" class="main-content">
    <n-alert :show-icon="false">
      此页面用于演示菜单标记的运行时更新能力。你可以设置文本/数字标记、对数字标记减 1，并观察左侧菜单实时变化。
    </n-alert>

    <n-card title="当前菜单标记">
      <n-descriptions bordered :column="1" size="small" label-placement="left">
        <n-descriptions-item label="当前路由">{{ route.path }}</n-descriptions-item>
        <n-descriptions-item label="extraText">{{ currentBadge?.extraText || '-' }}</n-descriptions-item>
        <n-descriptions-item label="extraType">{{ currentBadge?.extraType || '-' }}</n-descriptions-item>
      </n-descriptions>
    </n-card>

    <n-grid :cols="2" :x-gap="12" :y-gap="12" item-responsive responsive="screen">
      <n-grid-item span="2 m:1">
        <n-card title="设置文本标记">
          <n-flex vertical :size="10">
            <n-input v-model:value="textValue" placeholder="请输入文本标记，例如：NEW / HOT / 待处理" clearable />
            <n-select
              v-model:value="textType"
              :options="typeOptions"
              :render-label="renderLabel"
              placeholder="请选择标记类型"
            />
            <n-flex :size="8">
              <n-button type="primary" @click="handleSetTextBadge">设置文本标记</n-button>
              <n-button @click="handleClearBadge">清空标记</n-button>
            </n-flex>
          </n-flex>
        </n-card>
      </n-grid-item>

      <n-grid-item span="2 m:1">
        <n-card title="设置数字标记">
          <n-flex vertical :size="10">
            <n-input-number v-model:value="countValue" :min="0" :precision="0" placeholder="请输入数字" />
            <n-select
              v-model:value="countType"
              :options="typeOptions"
              :render-label="renderLabel"
              placeholder="请选择标记类型"
            />
            <n-input-number v-model:value="decreaseStep" :min="1" :precision="0" placeholder="减量步长" />
            <n-flex :size="8">
              <n-button type="primary" @click="handleSetCountBadge">设置数字标记</n-button>
              <n-button type="success" @click="handleDecreaseBadge">数字减 1/步长</n-button>
            </n-flex>
          </n-flex>
        </n-card>
      </n-grid-item>
    </n-grid>
  </n-flex>
</template>

<script lang="ts" setup>
import { computed, ref, h } from 'vue'
import type { VNodeChild } from 'vue'
import type { SelectOption } from 'naive-ui'
import { NBadge, type BadgeProps } from 'naive-ui'
import { useRoute } from 'vue-router'
import { useMenuBadge } from '@/hooks/useMenuBadge'
import { useUiFeedback } from '@/hooks/useUiFeedback'
import type { MenuBadge } from '@/store/types'

defineOptions({
  name: 'MenuBadgeDemo'
})

const route = useRoute()
const { msgWarning, msgSuccess } = useUiFeedback()
const { setCurrentBadge, decreaseCurrentBadge, clearBadge, getBadge } = useMenuBadge()

const typeOptions = [
  { label: 'default', value: 'default' },
  { label: 'info', value: 'info' },
  { label: 'success', value: 'success' },
  { label: 'warning', value: 'warning' },
  { label: 'error', value: 'error' }
]

const textValue = ref('NEW')
const textType = ref<MenuBadge['extraType']>('success')

const countValue = ref<number | null>(9)
const countType = ref<MenuBadge['extraType']>('error')
const decreaseStep = ref<number | null>(1)

const currentBadge = computed(() => getBadge(route.path))
const renderLabel = (option: SelectOption): VNodeChild => {
  return [
    h(NBadge, {
      type: option.value as BadgeProps['type'],
      value: option.value
    })
  ]
}
const handleSetTextBadge = () => {
  const nextText = textValue.value.trim()
  if (!nextText) {
    msgWarning('文本标记不能为空')
    return
  }

  setCurrentBadge({
    extraText: nextText,
    extraType: textType.value
  })
  msgSuccess('已更新文本标记')
}

const handleSetCountBadge = () => {
  if (countValue.value === null || Number.isNaN(countValue.value)) {
    msgWarning('请输入有效数字')
    return
  }

  setCurrentBadge({
    extraText: String(Math.max(0, Math.floor(countValue.value))),
    extraType: countType.value
  })
  msgSuccess('已更新数字标记')
}

const handleDecreaseBadge = () => {
  const stepValue = decreaseStep.value && decreaseStep.value > 0 ? Math.floor(decreaseStep.value) : 1
  decreaseCurrentBadge(stepValue)
  msgSuccess(`已执行减量，步长：${stepValue}`)
}

const handleClearBadge = () => {
  clearBadge(route.path)
  msgSuccess('已清空当前菜单标记')
}
</script>
