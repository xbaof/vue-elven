<template>
  <div @click="toggle">
    <svg-icon :icon="isFullscreen ? OffScreen : FullScreen" />
  </div>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import FullScreen from '@iconify-icons/icon-park-outline/full-screen'
import OffScreen from '@iconify-icons/icon-park-outline/off-screen'

const { isFullscreen, toggle } = useFullscreen()
</script>
