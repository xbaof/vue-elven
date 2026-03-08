<template>
  <div class="loginPage">
    <n-card class="loginCard pb-15" :bordered="false" size="large">
      <n-flex vertical :size="18">
        <n-flex vertical :size="6">
          <n-text class="loginTitle">系统登录</n-text>
          <n-text depth="3">请输入用户名和密码</n-text>
        </n-flex>

        <n-form ref="formRef" :model="loginForm" :rules="formRules" label-placement="top">
          <n-form-item label="用户名" path="userName">
            <n-input
              v-model:value="loginForm.userName"
              placeholder="请输入用户名"
              clearable
              @keydown.enter.prevent="handleLogin"
            />
          </n-form-item>

          <n-form-item label="密码" path="password">
            <n-input
              v-model:value="loginForm.password"
              type="password"
              show-password-on="click"
              placeholder="请输入密码"
              @keydown.enter.prevent="handleLogin"
            />
          </n-form-item>

          <n-button type="primary" block :loading="loading" @click="handleLogin">登录</n-button>
        </n-form>
      </n-flex>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { FormInst, FormRules } from 'naive-ui'
import { useAuthStore } from '@/store/modules/auth'
import { useSafeNavigation } from '@/hooks/useSafeNavigation'
import { useUiFeedback } from '@/hooks/useUiFeedback'

defineOptions({
  name: 'Login'
})

const authStore = useAuthStore()
const route = useRoute()
const { replace } = useSafeNavigation()
const uiFeedback = useUiFeedback()

const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const loginForm = reactive({
  userName: 'admin',
  password: '123456'
})

const formRules: FormRules = {
  userName: [{ required: true, message: '请输入用户名', trigger: ['blur', 'input'] }],
  password: [{ required: true, message: '请输入密码', trigger: ['blur', 'input'] }]
}

const handleLogin = async (): Promise<void> => {
  await formRef.value?.validate()
  const stopLoading = uiFeedback.startLoading('登录中...')
  loading.value = true
  try {
    await authStore.login({
      userName: loginForm.userName,
      password: loginForm.password,
      captchaCode: '',
      captchaId: ''
    })
    uiFeedback.msgSuccess('登录成功')
    await replace((route.query.redirect as string) ?? '/')
  } catch (error) {
    uiFeedback.msgErrorFromUnknown(error, '登录失败，请稍后重试')
  } finally {
    stopLoading()
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.loginPage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 24px;
  background-color: #f3f5f8;
}

.loginCard {
  width: 100%;
  max-width: 420px;
  border: 1px solid var(--n-border-color);
  border-radius: var(--n-border-radius);
}

.loginTitle {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
}
</style>
