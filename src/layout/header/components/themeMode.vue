<template>
  <div @click="isDark = !isDark">
    <svg-icon :icon="isDark ? SunOne : Moon" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store'
import SunOne from '@iconify-icons/icon-park-outline/sun-one'
import Moon from '@iconify-icons/icon-park-outline/moon'

const app = useAppStore()
const { isDark } = storeToRefs(app)
</script>
