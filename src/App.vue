<template>
  <n-config-provider :locale="zhCN" class="wh-full" :theme="naiveTheme" :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <n-el class="wh-full">
            <router-view />
            <n-watermark v-if="app.watermark.show" v-bind="watermarkProps" />
          </n-el>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
    <n-global-style />
  </n-config-provider>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { darkTheme, zhCN, GlobalThemeOverrides, type WatermarkProps } from 'naive-ui'
import { useAppStore } from '@/store'
const app = useAppStore()
const naiveTheme = computed(() => (app.isDark ? darkTheme : null))
const themeOverrides = computed(() => {
  return {
    common: {
      ...app.getThemeOverridesCommon
    },
    Tooltip: {
      padding: '4px 8px'
    }
  } as GlobalThemeOverrides
})
const watermarkProps = computed<WatermarkProps>(() => {
  return {
    content: app.watermark.content || 'vue-elven',
    cross: true,
    fullscreen: true,
    fontSize: 16,
    lineHeight: 16,
    width: 384,
    height: 384,
    xOffset: 12,
    yOffset: 60,
    rotate: -15
  }
})
</script>
