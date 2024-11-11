<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref, unref, onMounted, nextTick } from 'vue'
const show = ref(true)
const currentRoute = useRoute()
const linkUrl = ref('')
const frameRef = ref<HTMLElement | null>(null)

if (unref(currentRoute.meta)?.linkUrl) {
  linkUrl.value = unref(currentRoute.meta)?.linkUrl as string
}

function init() {
  nextTick(() => {
    const iframe = unref(frameRef)
    if (!iframe) {
      return
    }
    const _frame = iframe as any
    if (_frame.attachEvent) {
      _frame.attachEvent('onload', () => {
        show.value = false
      })
    } else {
      iframe.onload = () => {
        show.value = false
      }
    }
  })
}

onMounted(() => {
  init()
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
