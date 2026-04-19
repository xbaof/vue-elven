<template>
  <div class="main-content flex-center forbiddenPage">
    <n-card class="forbiddenCard" :bordered="false" size="large">
      <n-result status="403" title="无权限访问" description="你没有访问当前资源的权限，请联系管理员授权。">
        <template #footer>
          <n-flex justify="center" :size="12">
            <n-button type="primary" @click="goHome">返回首页</n-button>
            <n-button @click="goBack">返回上一页</n-button>
          </n-flex>
        </template>
      </n-result>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSafeNavigation } from '@/hooks/useSafeNavigation'

defineOptions({
  name: 'Forbidden'
})

const router = useRouter()
const { push } = useSafeNavigation()

const goHome = async () => {
  await push('/index')
}

const goBack = async () => {
  if (window.history.length > 1) {
    router.back()
    return
  }

  await push('/index')
}
</script>

<style scoped lang="scss">
.forbiddenPage {
  flex: 1 1 0%;
  min-height: 100%;
}

.forbiddenCard {
  width: min(640px, 100%);
  background-color: transparent;
}
</style>
