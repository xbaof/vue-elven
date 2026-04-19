<template>
  <div class="main-content flex-center notFoundPage">
    <n-card class="notFoundCard" :bordered="false" size="large">
      <n-result status="404" title="页面不存在" description="你访问的地址可能已变更、删除，或暂时不可用。">
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
  name: 'NotFound'
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
.notFoundPage {
  flex: 1 1 0%;
  min-height: 100%;
}

.notFoundCard {
  width: min(640px, 100%);
  background-color: transparent;
}
</style>
