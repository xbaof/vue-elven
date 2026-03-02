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
import type { IconifyIcon } from '@iconify/vue'
import adProductIcon from '@iconify-icons/icon-park-outline/ad-product'
import apiAppIcon from '@iconify-icons/icon-park-outline/api-app'
import appSwitchIcon from '@iconify-icons/icon-park-outline/app-switch'
import applicationOneIcon from '@iconify-icons/icon-park-outline/application-one'
import associationIcon from '@iconify-icons/icon-park-outline/association'
import asteriskIcon from '@iconify-icons/icon-park-outline/asterisk'
import badgeIcon from '@iconify-icons/icon-park-outline/badge'
import benzIcon from '@iconify-icons/icon-park-outline/benz'
import categoryManagementIcon from '@iconify-icons/icon-park-outline/category-management'
import convergingGatewayIcon from '@iconify-icons/icon-park-outline/converging-gateway'
import coordinateSystemIcon from '@iconify-icons/icon-park-outline/coordinate-system'
import cubeIcon from '@iconify-icons/icon-park-outline/cube'
import cycleArrowIcon from '@iconify-icons/icon-park-outline/cycle-arrow'
import cylinderIcon from '@iconify-icons/icon-park-outline/cylinder'
import displayIcon from '@iconify-icons/icon-park-outline/display'
import endlessIcon from '@iconify-icons/icon-park-outline/endless'
import errorPromptIcon from '@iconify-icons/icon-park-outline/error-prompt'
import type { SelectOption } from 'naive-ui'
import SvgIcon from '@/components/SvgIcon/index.vue'

defineOptions({
  name: 'IconPicker'
})

interface IconPickerProps {
  modelValue?: string | null
  placeholder?: string
  clearable?: boolean
}

type IconValue = string | IconifyIcon

interface IconOptionItem {
  iconValue: string
  iconData: IconValue
}

type IconPickerOption = SelectOption & {
  iconData: IconValue
}

const props = withDefaults(defineProps<IconPickerProps>(), {
  modelValue: null,
  placeholder: '请选择图标',
  clearable: true
})

const emit = defineEmits<{
  (eventName: 'update:modelValue', value: string | null): void
}>()

const iconOptionList: IconOptionItem[] = [
  { iconValue: 'icon-park-outline:ad-product', iconData: adProductIcon },
  { iconValue: 'icon-park-outline:api-app', iconData: apiAppIcon },
  { iconValue: 'icon-park-outline:app-switch', iconData: appSwitchIcon },
  { iconValue: 'icon-park-outline:application-one', iconData: applicationOneIcon },
  { iconValue: 'icon-park-outline:association', iconData: associationIcon },
  { iconValue: 'icon-park-outline:asterisk', iconData: asteriskIcon },
  { iconValue: 'icon-park-outline:badge', iconData: badgeIcon },
  { iconValue: 'icon-park-outline:benz', iconData: benzIcon },
  { iconValue: 'icon-park-outline:category-management', iconData: categoryManagementIcon },
  { iconValue: 'icon-park-outline:converging-gateway', iconData: convergingGatewayIcon },
  { iconValue: 'icon-park-outline:coordinate-system', iconData: coordinateSystemIcon },
  { iconValue: 'icon-park-outline:cube', iconData: cubeIcon },
  { iconValue: 'icon-park-outline:cycle-arrow', iconData: cycleArrowIcon },
  { iconValue: 'icon-park-outline:cylinder', iconData: cylinderIcon },
  { iconValue: 'icon-park-outline:display', iconData: displayIcon },
  { iconValue: 'icon-park-outline:endless', iconData: endlessIcon },
  { iconValue: 'icon-park-outline:error-prompt', iconData: errorPromptIcon },
  { iconValue: 'local:vite', iconData: 'local:vite' }
]

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
