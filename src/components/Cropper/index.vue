<template>
  <div class="cropper-container">
    <div class="cropper-img flex-1">
      <cropper-canvas ref="canvasRef" class="flex-1" background>
        <cropper-image
          ref="imageRef"
          :src="inSrc"
          :alt="alt"
          :crossorigin="crossorigin"
          rotatable
          scalable
          skewable
          translatable
        />
        <cropper-shade :class="{ 're-circled': isCircle }" />
        <cropper-handle action="move" plain />
        <cropper-selection
          id="cropperSelection"
          ref="selectionRef"
          movable
          resizable
          outlined
          :aspect-ratio="1"
          initial-coverage="1"
          @change="handleChange"
        >
          <cropper-crosshair centered />
          <cropper-handle action="move" theme-color="transparent" />
          <cropper-handle action="n-resize" />
          <cropper-handle action="e-resize" />
          <cropper-handle action="s-resize" />
          <cropper-handle action="w-resize" />
          <cropper-handle action="ne-resize" />
          <cropper-handle action="nw-resize" />
          <cropper-handle action="se-resize" />
          <cropper-handle action="sw-resize" />
        </cropper-selection>
      </cropper-canvas>
      <n-flex :size="0" justify="space-between" class="mt-12">
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-upload action="#" accept="image/*" :show-file-list="false" @before-upload="beforeUpload">
              <n-button size="small">
                <template #icon>
                  <svg-icon :size="16" :icon="UploadOne" />
                </template>
              </n-button>
            </n-upload>
          </template>
          上传图片
        </n-tooltip>
        <n-tooltip v-for="(item, index) in toolbars" :key="index" placement="bottom">
          <template #trigger>
            <n-button size="small" @click="item.action">
              <template #icon>
                <svg-icon :style="`transform: scaleX(${item.isTransform ? -1 : 1})`" :size="16" :icon="item.icon" />
              </template>
            </n-button>
          </template>
          {{ item.tooltip }}
        </n-tooltip>
      </n-flex>
    </div>
    <div class="cropper-preview flex-1">
      <div>
        <cropper-viewer :class="{ 're-circled': isCircle }" resize="both" selection="#cropperSelection" />
        <n-text class="mt-12" strong> {{ selectionInfo.width || 0 }} × {{ selectionInfo.height || 0 }} </n-text>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'Cropper'
})
import 'cropperjs'
import type { CropperCanvas, CropperImage, CropperSelection } from 'cropperjs'
import { ref, computed, onMounted, nextTick, PropType } from 'vue'
import { type UploadFileInfo, useMessage } from 'naive-ui'
import UploadOne from '@iconify-icons/icon-park-outline/upload-one'
import Refresh from '@iconify-icons/icon-park-outline/refresh'
import Rotate from '@iconify-icons/icon-park-outline/rotate'
import rotationHorizontal from '@iconify-icons/icon-park-outline/rotation-horizontal'
import rotationVertical from '@iconify-icons/icon-park-outline/rotation-vertical'
import zoomIn from '@iconify-icons/icon-park-outline/zoom-in'
import zoomOut from '@iconify-icons/icon-park-outline/zoom-out'

const props = defineProps({
  src: {
    type: String,
    require: true,
    default: ''
  },
  mode: {
    type: String as PropType<'rectangle' | 'circle'>,
    default: 'rectangle'
  },
  alt: {
    type: String,
    default: ' '
  },
  height: {
    type: [String, Number],
    default: '300px'
  },
  crossorigin: {
    type: String as PropType<'' | 'anonymous' | 'use-credentials' | undefined>,
    default: 'anonymous'
  }
})
interface ImageInfo {
  width: number
  height: number
  size?: number
  base64?: string
  blob?: Blob
}
const toolbars = [
  {
    icon: Refresh,
    tooltip: '重置',
    action: () => {
      selectionRef.value?.$reset()
      imageRef.value?.$resetTransform()
      imageRef.value?.$center('contain')
    }
  },
  {
    icon: Rotate,
    tooltip: '逆时针旋转',
    action: () => {
      imageRef.value?.$rotate('-45deg')
    }
  },
  {
    icon: Rotate,
    isTransform: true,
    tooltip: '顺时针旋转',
    action: () => {
      imageRef.value?.$rotate('45deg')
    }
  },
  {
    icon: rotationHorizontal,
    tooltip: '横向旋转',
    action: () => {
      imageRef.value?.$scale(-1, 1)
    }
  },
  {
    icon: rotationVertical,
    tooltip: '纵向旋转',
    action: () => {
      imageRef.value?.$scale(1, -1)
    }
  },
  {
    icon: zoomIn,
    tooltip: '放大',
    action: () => {
      imageRef.value?.$zoom(0.1)
    }
  },
  {
    icon: zoomOut,
    tooltip: '缩小',
    action: () => {
      imageRef.value?.$zoom(-0.1)
    }
  }
]
const selectionInfo = ref({
  width: 0,
  height: 0
})
const canvasRef = ref<CropperCanvas | null>(null)
const imageRef = ref<CropperImage | null>(null)
const selectionRef = ref<CropperSelection | null>(null)

const inSrc = ref<string>(props.src)

const isCircle = computed(() => props.mode === 'circle')
const cropperHeight = computed(() => `${parseFloat(props.height + '')}px`)
const message = useMessage()
const beforeUpload = async (data: { file: UploadFileInfo }) => {
  if (!data.file.file?.type.includes('image/')) {
    message.error('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
    return false
  }
  const reader = new FileReader()
  reader.readAsDataURL(data.file.file)
  inSrc.value = ''
  reader.onload = (e) => {
    inSrc.value = e.target?.result as string
  }
  return false
}
const handleChange = (e) => {
  selectionInfo.value = {
    width: e.detail.width,
    height: e.detail.height
  }
}
onMounted(async () => {
  await nextTick()
  imageRef.value?.$ready(() => {
    toolbars[0].action()
  })
})

const confirmCropImage = async (): Promise<ImageInfo> => {
  try {
    const canvas = await selectionRef.value?.$toCanvas()
    if (!canvas) throw new Error('无法获取裁剪区域的画布')

    let finalCanvas: HTMLCanvasElement = canvas

    if (isCircle.value) {
      finalCanvas = createCircleCanvas(canvas)
    }

    const blob = await canvasToBlob(finalCanvas)
    const base64 = await blobToBase64(blob)

    return {
      size: blob.size,
      width: finalCanvas.width,
      height: finalCanvas.height,
      base64,
      blob
    }
  } catch (error) {
    return Promise.reject(error.message || '生成图片失败!')
  }
}
const createCircleCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
  const circleCanvas = document.createElement('canvas')
  const context = circleCanvas.getContext('2d')
  const size = Math.min(canvas.width, canvas.height)
  circleCanvas.width = size
  circleCanvas.height = size

  context.beginPath()
  context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  context.closePath()
  context.clip()
  context.drawImage(canvas, 0, 0, size, size)

  return circleCanvas
}

const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('生成图片失败!'))
      }
    })
  })
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(blob)
    fileReader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error('生成图片失败!'))
      }
    }
  })
}

defineExpose({
  confirmCropImage
})
</script>
<style lang="scss" scoped>
:deep(.n-upload) {
  width: auto;
}
</style>
<style lang="scss">
.cropper-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;

  .re-circled {
    border-radius: 50%;
  }

  .cropper-img,
  .cropper-preview {
    height: v-bind('cropperHeight');
  }

  .cropper-img {
    display: flex;
    flex-direction: column;
    min-width: 360px;
  }

  .cropper-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      cropper-viewer {
        border: 1px solid var(--border-color);
      }
    }
  }
}
</style>
