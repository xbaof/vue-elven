<template>
  <n-config-provider :theme="naiveTheme">
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
import { darkTheme, lightTheme } from 'naive-ui'
import { useSettingStore } from '@/store'
const { theme } = useSettingStore()
const naiveTheme = theme ? lightTheme : darkTheme
</script>
