<template>
  <div />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { safeRouterReplace } from '@/router/navigation'

defineOptions({
  name: 'Redirect'
})

const router = useRouter()

const handleRedirect = async (): Promise<void> => {
  const { currentRoute } = router
  const { params, query } = currentRoute.value
  const path = params.path

  if (!path) {
    console.warn('Redirect path not found in params:', params)
    return
  }

  const targetPath = Array.isArray(path) ? path.join('/') : String(path)
  const fullPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`

  await safeRouterReplace(router, {
    path: fullPath,
    query
  })
}

onMounted(() => {
  void handleRedirect()
})
</script>
