<template>
  <n-icon>
    <icon-component />
  </n-icon>
</template>

<script lang="ts" setup>
import { h, defineComponent, defineAsyncComponent, type Component } from 'vue'
import { Icon as Iconify, type IconifyIcon } from '@iconify/vue'

defineOptions({
  name: 'SvgIcon'
})

interface Props {
  icon: string | IconifyIcon
}

const props = defineProps<Props>()

const SVG_MODULES = import.meta.glob('@/assets/svg/*.svg', {
  query: '?component'
})

/**
 * icon 名称 -> 动态导入函数
 */
const SVG_COMPONENT_LOADERS: Recordable<PromiseFn<Component>> = Object.fromEntries(
  Object.entries(SVG_MODULES).map(([path, loader]) => {
    const fileName = path.split('/').pop() || ''
    const iconName = fileName.replace('.svg', '')
    return [iconName, loader as PromiseFn<Component>]
  })
)

/**
 * icon 名称 -> 已创建好的异步组件
 */
const SVG_COMPONENT_CACHE: Recordable<Component> = {}

/**
 * 获取本地 SVG 组件
 * @param icon 图标名称（带 local: 前缀）
 * @returns 异步组件或 null
 */
const getSvgComponent = (icon: string): Nullable<Component> => {
  const iconName = icon.replace('local:', '')

  if (!iconName) return null

  const cached = SVG_COMPONENT_CACHE[iconName]
  if (cached) return cached

  const loader = SVG_COMPONENT_LOADERS[iconName]
  if (!loader) return null

  const asyncComp = defineAsyncComponent(() => loader())
  SVG_COMPONENT_CACHE[iconName] = asyncComp

  return asyncComp
}

const iconComponent = defineComponent({
  render() {
    if (typeof props.icon === 'string' && props.icon.startsWith('local:')) {
      const svgComponent = getSvgComponent(props.icon)
      return svgComponent ? h(svgComponent) : null
    }
    return h(Iconify, { icon: props.icon })
  }
})
</script>
