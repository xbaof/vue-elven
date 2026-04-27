<template>
  <n-flex vertical :size="15" class="main-content signaturePage">
    <n-list bordered>
      <n-list-item>
        <n-thing title="电子签名示例" description="支持手写签名、清空、导出 Base64、下载 PNG 和回填" />
      </n-list-item>
      <n-list-item>
        <signature-pad
          ref="signaturePadRef"
          :height="320"
          :disabled="disabledMode"
          @change="handleSignatureChange"
          @end="handleSignatureEnd"
        />
        <n-flex class="actionRow" :size="8" wrap>
          <n-button size="small" @click="clearSignature">清空</n-button>
          <n-button size="small" :disabled="!latestBase64" @click="restoreSignature">回填最近一次签名</n-button>
          <n-button size="small" type="primary" :disabled="!latestBase64" @click="copyBase64">复制 Base64</n-button>
          <n-button size="small" type="success" :disabled="!latestBase64" @click="downloadPng">下载 PNG</n-button>
          <n-button size="small" :type="disabledMode ? 'warning' : 'default'" @click="toggleDisabledMode">
            {{ disabledMode ? '切换可签名' : '切换禁用' }}
          </n-button>
        </n-flex>
      </n-list-item>
    </n-list>

    <n-list bordered>
      <n-list-item>
        <n-thing title="签名结果" />
      </n-list-item>
      <n-list-item>
        <n-grid cols="1 m:2" :x-gap="12" :y-gap="12" item-responsive responsive="screen">
          <n-grid-item>
            <n-input
              type="textarea"
              :value="latestBase64"
              readonly
              :autosize="{ minRows: 5, maxRows: 8 }"
              placeholder="完成签名后，这里会显示 Base64 结果"
            />
          </n-grid-item>
          <n-grid-item>
            <div class="previewBox">
              <n-image v-if="latestBase64" :src="latestBase64" object-fit="contain" />
              <n-empty v-else description="暂无签名预览" />
            </div>
          </n-grid-item>
        </n-grid>
      </n-list-item>
    </n-list>

    <n-list bordered>
      <n-list-item>
        <n-thing title="组件参数说明" description="文档内容来自 docs/component-api/signature-pad.md" />
      </n-list-item>
      <n-list-item>
        <div class="markdownDoc" v-html="docHtml" />
      </n-list-item>
    </n-list>
  </n-flex>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard, useDebounceFn } from '@vueuse/core'
import SignaturePad from '@/components/SignaturePad/index.vue'
import type { SignatureEndPayload, SignaturePadExpose } from '@/components/SignaturePad/types'
import { useMarkdownDoc } from '@/hooks/useMarkdownDoc'
import { useUiFeedback } from '@/hooks/useUiFeedback'
import { downloadByData } from '@/utils/index'
import signaturePadDocRaw from '@docs/component-api/signature-pad.md?raw'

defineOptions({
  name: 'SignatureDemo'
})

const signaturePadRef = ref<SignaturePadExpose | null>(null)
const latestBase64 = ref('')
const disabledMode = ref(false)
const { copy, isSupported } = useClipboard()
const { docHtml } = useMarkdownDoc(signaturePadDocRaw)
const { msgSuccess, msgWarning, msgInfo, msgErrorFromUnknown } = useUiFeedback()

// change 在书写和重绘期间会高频触发，这里做轻量防抖同步。
const syncLatestBase64 = useDebounceFn((isEmpty: boolean) => {
  if (isEmpty) {
    latestBase64.value = ''
    return
  }
  latestBase64.value = signaturePadRef.value?.toBase64('image/png') || ''
}, 80)

const handleSignatureChange = (isEmpty: boolean) => {
  syncLatestBase64(isEmpty)
}

const handleSignatureEnd = (payload: SignatureEndPayload) => {
  latestBase64.value = payload.base64
}

const clearSignature = () => {
  signaturePadRef.value?.clear()
  latestBase64.value = ''
}

const restoreSignature = async (): Promise<void> => {
  if (!latestBase64.value) {
    return
  }

  try {
    await signaturePadRef.value?.fromDataUrl(latestBase64.value)
    msgSuccess('签名已回填')
  } catch (error) {
    msgErrorFromUnknown(error, '签名回填失败')
  }
}

const copyBase64 = async (): Promise<void> => {
  if (!latestBase64.value) {
    return
  }
  if (!isSupported.value) {
    msgWarning('当前环境不支持剪贴板复制')
    return
  }

  try {
    await copy(latestBase64.value)
    msgSuccess('Base64 已复制到剪贴板')
  } catch (error) {
    msgErrorFromUnknown(error, '复制失败，请检查浏览器权限')
  }
}

const downloadPng = async (): Promise<void> => {
  try {
    const pngBlob = await signaturePadRef.value?.toBlob('image/png')
    if (!pngBlob) {
      msgInfo('请先完成签名再下载')
      return
    }
    downloadByData(pngBlob, 'signature.png', 'image/png')
    msgSuccess('签名图片已下载')
  } catch (error) {
    msgErrorFromUnknown(error, '下载签名失败')
  }
}

const toggleDisabledMode = () => {
  disabledMode.value = !disabledMode.value
}
</script>

<style scoped lang="scss">
.signaturePage {
  .actionRow {
    margin-top: 12px;
  }

  .previewBox {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 140px;
    padding: 8px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
  }
}
</style>
