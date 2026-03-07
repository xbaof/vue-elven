<template>
  <div @click="toggleTheme">
    <svg-icon :icon="currentIcon" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import sunOneIcon from '@iconify-icons/icon-park-outline/sun-one'
import moonIcon from '@iconify-icons/icon-park-outline/moon'
import { useAppStore } from '@/store/modules/app'

defineOptions({
  name: 'ThemeMode'
})

const app = useAppStore()
const { isDark } = storeToRefs(app)

const currentIcon = computed(() => {
  return isDark.value ? sunOneIcon : moonIcon
})

const toggleTheme = () => {
  app.isDark = !app.isDark
}
</script>
