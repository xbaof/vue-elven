<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref, unref, onMounted, nextTick } from 'vue'
const loading = ref(true)
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
        loading.value = false
      })
    } else {
      iframe.onload = () => {
        loading.value = false
      }
    }
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div v-loading="loading" class="frame" element-loading-text="加载中...">
    <iframe ref="frameRef" :src="linkUrl" class="frame-iframe" />
  </div>
</template>

<style lang="scss" scoped>
.frame {
  z-index: 998;
  height: 100vh;

  .frame-iframe {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 0;
  }
}

.main-content {
  margin: 2px 0 0 !important;
}
</style>
