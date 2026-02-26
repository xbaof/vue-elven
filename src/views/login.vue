<template>
  <n-button type="info" @click="handleLogin"> 登录 </n-button>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
const authStore = useAuthStore()

const route = useRoute()
const router = useRouter()
const message = useMessage()
const handleLogin = () => {
  message.loading('登录中...')
  authStore
    .login({
      userName: 'admin',
      password: '123456',
      captchaCode: '',
      captchaId: ''
    })
    .then(() => {
      message.destroyAll()
      message.success('登录成功，即将进入系统')
      setTimeout(() => router.replace((route.query.redirect as string) ?? '/'))
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>
