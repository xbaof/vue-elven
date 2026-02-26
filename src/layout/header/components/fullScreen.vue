<template>
  <div @click="toggle">
    <svg-icon :icon="currentIcon" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFullscreen } from '@vueuse/core'
import FullScreen from '@iconify-icons/icon-park-outline/full-screen'
import OffScreen from '@iconify-icons/icon-park-outline/off-screen'

defineOptions({
  name: 'FullScreen'
})

const { isFullscreen, toggle } = useFullscreen()

const currentIcon = computed(() => (isFullscreen.value ? OffScreen : FullScreen))
</script>
