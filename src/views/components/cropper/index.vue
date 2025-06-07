<template>
  <n-flex vertical :size="15" class="main-content">
    <n-list bordered>
      <n-list-item>
        <n-thing title="图片裁剪" description="基于 cropperjs 2.0 二次封装" />
      </n-list-item>
      <n-list-item>
        <cropper ref="cropper" :src="imgSrc" style="max-width: 660px" :mode="mode" />
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
  </n-flex>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'CropperDemo'
})

import { ref } from 'vue'
import type { ImageRenderToolbarProps } from 'naive-ui'
import { downloadByData } from '@/utils/index'
import Cropper from '@/components/Cropper/index.vue'
import CropperImage from './cropper_image.png'

const imgSrc = ref(CropperImage)

const cropImage = ref<string>('')
const mode = ref<'rectangle' | 'circle'>('rectangle')
const cropper = ref(null)
const handleCropImage = async () => {
  const cropImgInfo = await cropper.value?.confirmCropImage()
  cropImage.value = cropImgInfo.base64
}

const renderToolbar = ({ nodes }: ImageRenderToolbarProps) => {
  nodes.download.props.onClick = async () => {
    const cropImgInfo = await cropper.value?.confirmCropImage()
    downloadByData(cropImgInfo.blob, 'cropped-image.png')
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
