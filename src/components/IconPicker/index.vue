<template>
  <n-select
    :value="modelValue"
    :options="iconOptions"
    :clearable="clearable"
    :placeholder="placeholder"
    filterable
    :render-label="renderOptionLabel"
    @update:value="handleUpdateValue"
  >
    <template #empty>
      <n-empty size="small" description="暂无匹配图标" />
    </template>
  </n-select>
</template>

<script lang="ts" setup>
import { computed, h } from 'vue'
import type { SelectOption } from 'naive-ui'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { iconParkPickerList, type IconOptionItem } from '@/constants/iconPark'

defineOptions({
  name: 'IconPicker'
})

interface IconPickerProps {
  modelValue?: string | null
  placeholder?: string
  clearable?: boolean
}

type IconPickerOption = SelectOption & {
  iconData: IconOptionItem['iconData']
}

const props = withDefaults(defineProps<IconPickerProps>(), {
  modelValue: null,
  placeholder: '请选择图标',
  clearable: true
})

const emit = defineEmits<{
  (eventName: 'update:modelValue', value: string | null): void
}>()

const iconOptionList: IconOptionItem[] = iconParkPickerList

const iconOptions = computed<SelectOption[]>(() => {
  return iconOptionList.map((iconOption) => ({
    label: iconOption.iconValue,
    value: iconOption.iconValue,
    iconData: iconOption.iconData
  }))
})

const renderOptionLabel = (option: SelectOption) => {
  const selectedOption = option as IconPickerOption
  const iconValue = typeof option.value === 'string' ? option.value : ''

  return h('div', { class: 'icon-picker-option' }, [
    h(SvgIcon, { icon: selectedOption.iconData ?? iconValue, size: 16 }),
    h('span', { class: 'icon-picker-option__text' }, iconValue)
  ])
}

const handleUpdateValue = (value: string | null) => {
  emit('update:modelValue', value)
}
</script>

<style scoped lang="scss">
.icon-picker-option {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.icon-picker-option__text {
  font-size: 12px;
}
</style>
