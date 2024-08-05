<template>
  <n-icon>
    <svg-icon />
  </n-icon>
</template>
<script lang="ts" setup>
import { h, defineComponent, defineAsyncComponent, computed } from 'vue'
import { Icon as Iconify, IconifyIcon } from '@iconify/vue'

interface Props {
  icon: string | IconifyIcon
}
const props = defineProps<Props>()

const modules = computed(() => {
  return import.meta.glob('@/assets/svg/*.svg', {
    query: '?component'
  })
})
const getSvgComponent = (icon: string) => {
  const fileName = `/${icon.replace('local:', '')}.svg`
  const path = Object.keys(modules.value).find((o) => o.endsWith(fileName))
  return path ? defineAsyncComponent(() => modules.value[path]()) : undefined
}

const svgIcon = defineComponent({
  render() {
    if (typeof props.icon === 'string' && props.icon.startsWith('local:')) {
      const svgComponent = getSvgComponent(props.icon)
      return svgComponent ? h(svgComponent) : null
    }
    return h(Iconify, { icon: props.icon })
  }
})
</script>
