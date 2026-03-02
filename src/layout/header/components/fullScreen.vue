<template>
  <div @click="toggle">
    <svg-icon :icon="currentIcon" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFullscreen } from '@vueuse/core'
import offScreenIcon from '@iconify-icons/icon-park-outline/off-screen'
import fullScreenIcon from '@iconify-icons/icon-park-outline/full-screen'

defineOptions({
  name: 'FullScreen'
})

const { isFullscreen, toggle } = useFullscreen()

const currentIcon = computed(() => {
  return isFullscreen.value ? offScreenIcon : fullScreenIcon
})
</script>
