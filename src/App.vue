<template>
  <n-config-provider :locale="zhCN" class="wh-full" :theme="naiveTheme" :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <router-view />
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { darkTheme, zhCN, GlobalThemeOverrides } from 'naive-ui'
import { useAppStore } from '@/store'
const app = useAppStore()
const naiveTheme = computed(() => (app.isDark ? darkTheme : null))
const themeOverrides = computed(() => {
  return {
    common: {
      ...app.getThemeOverridesCommon
    }
  } as GlobalThemeOverrides
})
</script>
