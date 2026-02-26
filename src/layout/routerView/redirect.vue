<template>
  <div />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'Redirect'
})

const router = useRouter()

const handleRedirect = () => {
  const { currentRoute, replace } = router
  const { params, query } = currentRoute.value
  const path = params.path

  if (!path) {
    console.warn('Redirect path not found in params:', params)
    return
  }

  const targetPath = Array.isArray(path) ? path.join('/') : String(path)
  const fullPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`

  replace({
    path: fullPath,
    query
  }).catch((err) => {
    console.error('Redirect failed:', err)
  })
}

onMounted(() => {
  handleRedirect()
})
</script>
