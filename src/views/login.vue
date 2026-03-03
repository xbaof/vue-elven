<template>
  <n-button type="info" @click="handleLogin"> 登录 </n-button>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store'
import { useRoute } from 'vue-router'
import { useSafeNavigation } from '@/hooks/useSafeNavigation'
import { useUiFeedback } from '@/hooks/useUiFeedback'
const authStore = useAuthStore()

const route = useRoute()
const { replace } = useSafeNavigation()
const uiFeedback = useUiFeedback()

const handleLogin = async (): Promise<void> => {
  const stopLoading = uiFeedback.startLoading('登录中...')

  try {
    await authStore.login({
      userName: 'admin',
      password: '123456',
      captchaCode: '',
      captchaId: ''
    })
    uiFeedback.msgSuccess('登录成功，即将进入系统')
    await replace((route.query.redirect as string) ?? '/')
  } catch (error) {
    uiFeedback.msgErrorFromUnknown(error, '操作失败')
  } finally {
    stopLoading()
  }
}
</script>
