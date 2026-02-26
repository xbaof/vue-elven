<template>
  <div @click="toggleTheme">
    <svg-icon :icon="currentIcon" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store'
import SunOne from '@iconify-icons/icon-park-outline/sun-one'
import Moon from '@iconify-icons/icon-park-outline/moon'

defineOptions({
  name: 'ThemeMode'
})

const app = useAppStore()
const { isDark } = storeToRefs(app)

const currentIcon = computed(() => (isDark.value ? SunOne : Moon))

const toggleTheme = () => {
  app.isDark = !app.isDark
}
</script>
