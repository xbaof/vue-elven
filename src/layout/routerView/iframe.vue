<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'LayoutIframe'
})

const route = useRoute()
const frameRef = ref<HTMLIFrameElement | null>(null)
const show = ref(true)

const linkUrl = computed(() => {
  const meta = route.meta
  return (meta?.linkUrl as string) || ''
})

/**
 * 初始化 iframe 加载监听
 */
const initIframeLoad = () => {
  nextTick(() => {
    const iframe = frameRef.value
    if (!iframe) return

    iframe.onload = () => {
      show.value = false
    }
  })
}

onMounted(() => {
  if (!linkUrl.value) {
    show.value = false
    return
  }

  initIframeLoad()
})
</script>

<template>
  <n-spin :show="show" size="large" content-class="h-full">
    <template #description> 加载中... </template>
    <iframe ref="frameRef" :src="linkUrl" class="frame-iframe" />
  </n-spin>
</template>

<style lang="scss" scoped>
.frame-iframe {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 0;
}

.n-spin-container {
  position: absolute;
  inset: 0;
}
</style>
