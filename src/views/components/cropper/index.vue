<template>
  <n-flex vertical :size="15" class="main-content">
    <n-list bordered>
      <n-list-item>
        <n-thing title="图片裁剪" description="基于 cropperjs 2.x 二次封装" />
      </n-list-item>
      <n-list-item>
        <cropper ref="cropperRef" :src="imgSrc" style="max-width: 660px" :mode="mode" />
        <n-radio-group v-model:value="mode" size="small" class="mt-15">
          <n-radio-button value="rectangle"> 矩形 </n-radio-button>
          <n-radio-button value="circle"> 圆形 </n-radio-button>
        </n-radio-group>
        <n-flex :size="15">
          <n-button size="small" class="mt-15" @click="handleCropImage"> 裁剪图片 </n-button>
          <n-image class="mt-15" :src="cropImage" :render-toolbar="renderToolbar" />
        </n-flex>
      </n-list-item>
    </n-list>

    <n-list bordered>
      <n-list-item>
        <n-thing title="组件参数说明" description="文档内容来自 docs/component-api/cropper.md" />
      </n-list-item>
      <n-list-item>
        <div class="markdownDoc" v-html="docHtml" />
      </n-list-item>
    </n-list>
  </n-flex>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'CropperDemo'
})

import { defineAsyncComponent, ref } from 'vue'
import { type ImageRenderToolbarProps } from 'naive-ui'
import { useUiFeedback } from '@/hooks/useUiFeedback'
import { useMarkdownDoc } from '@/hooks/useMarkdownDoc'
import { downloadByData } from '@/utils/index'
import type CropperComponent from '@/components/Cropper/index.vue'
import cropperDocRaw from '@docs/component-api/cropper.md?raw'

const Cropper = defineAsyncComponent(() => import('@/components/Cropper/index.vue'))

const imgSrc = ref('https://picsum.photos/360/260')
const cropImage = ref<string>('')
const mode = ref<'rectangle' | 'circle'>('rectangle')
const cropperRef = ref<InstanceType<typeof CropperComponent> | null>(null)
const uiFeedback = useUiFeedback()
const { docHtml } = useMarkdownDoc(cropperDocRaw)

const handleCropImage = async (): Promise<void> => {
  if (!cropperRef.value) {
    return
  }

  try {
    const cropImgInfo = await cropperRef.value.confirmCropImage()
    cropImage.value = cropImgInfo.base64 || ''
  } catch (error) {
    uiFeedback.msgErrorFromUnknown(error, '裁剪图片失败，请稍后重试')
  }
}

const renderToolbar = ({ nodes }: ImageRenderToolbarProps) => {
  if (nodes.download?.props) {
    nodes.download.props.onClick = async () => {
      if (!cropperRef.value) {
        return
      }

      try {
        const cropImgInfo = await cropperRef.value.confirmCropImage()
        if (cropImgInfo.blob) {
          downloadByData(cropImgInfo.blob, 'cropped-image.png')
        }
      } catch (error) {
        uiFeedback.msgErrorFromUnknown(error, '裁剪图片失败，请稍后重试')
      }
    }
  }

  return [
    nodes.rotateCounterclockwise,
    nodes.rotateClockwise,
    nodes.resizeToOriginalSize,
    nodes.zoomOut,
    nodes.zoomIn,
    nodes.download,
    nodes.close
  ]
}
</script>
