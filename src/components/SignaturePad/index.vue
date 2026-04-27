<template>
  <div class="signaturePad">
    <div ref="canvasHostRef" class="canvasHost" :style="{ height: normalizedHeight }">
      <canvas ref="canvasRef" class="canvasEl" :class="{ isDisabled: props.disabled }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useDebounceFn, useResizeObserver } from '@vueuse/core'
import SignaturePad from 'signature_pad'
import type { SignaturePadEmits, SignaturePadExpose, SignaturePadProps } from '@/components/SignaturePad/types'

defineOptions({ name: 'SignaturePad' })

const props = withDefaults(defineProps<SignaturePadProps>(), {
  height: 260,
  backgroundColor: '#ffffff',
  penColor: '#1f2937',
  minWidth: 1,
  maxWidth: 2.5,
  disabled: false
})

const emit = defineEmits<SignaturePadEmits>()

const canvasHostRef = ref<Nullable<HTMLElement>>(null)
const canvasRef = ref<Nullable<HTMLCanvasElement>>(null)
const signaturePad = ref<Nullable<SignaturePad>>(null)

const normalizedHeight = computed(() => (typeof props.height === 'number' ? `${props.height}px` : props.height))

const syncResize = () => {
  const canvas = canvasRef.value
  const host = canvasHostRef.value
  if (!canvas || !host || !signaturePad.value) return
  if (host.offsetWidth <= 0 || host.offsetHeight <= 0) return

  const prevData = signaturePad.value.toData()
  const dpr = window.devicePixelRatio || 1

  canvas.width = host.offsetWidth * dpr
  canvas.height = host.offsetHeight * dpr
  canvas.getContext('2d')?.scale(dpr, dpr)

  signaturePad.value.clear()
  if (prevData.length) signaturePad.value.fromData(prevData, { clear: false })
  emit('change', signaturePad.value.isEmpty())
}

// 防抖 resize（给 ResizeObserver 使用）
const debounceResize = useDebounceFn(syncResize, 150)

// 事件
const handleChange = () => emit('change', signaturePad.value?.isEmpty() ?? true)
const handleEnd = () => {
  const empty = signaturePad.value?.isEmpty() ?? true
  emit('change', empty)
  emit('end', { isEmpty: empty, base64: toBase64() })
}

// 工具方法
const toBase64 = (type = 'image/png', encoderOptions?: number) => {
  if (!signaturePad.value || signaturePad.value.isEmpty()) return ''
  return signaturePad.value.toDataURL(type, encoderOptions)
}

const toBlob = async (type = 'image/png', encoderOptions?: number) => {
  const data = toBase64(type, encoderOptions)
  return data ? await (await fetch(data)).blob() : null
}

const isEmpty = () => signaturePad.value?.isEmpty() ?? true

const clear = () => {
  signaturePad.value?.clear()
  emit('change', true)
}

const fromDataUrl = async (dataUrl: string) => {
  if (!dataUrl || !signaturePad.value) return
  try {
    await signaturePad.value.fromDataURL(dataUrl)
    emit('change', signaturePad.value.isEmpty())
  } catch (error) {
    console.error('签名加载失败：', error)
  }
}

// 初始化
onMounted(() => {
  if (!canvasRef.value) return

  signaturePad.value = new SignaturePad(canvasRef.value, {
    backgroundColor: props.backgroundColor,
    penColor: props.penColor,
    minWidth: props.minWidth,
    maxWidth: props.maxWidth
  })

  signaturePad.value.addEventListener('afterUpdateStroke', handleChange)
  signaturePad.value.addEventListener('endStroke', handleEnd)

  // 立即执行无防抖 resize
  syncResize()

  if (props.disabled) signaturePad.value.off()
})

onBeforeUnmount(() => {
  if (!signaturePad.value) return
  signaturePad.value.removeEventListener('afterUpdateStroke', handleChange)
  signaturePad.value.removeEventListener('endStroke', handleEnd)
  signaturePad.value.off()
  signaturePad.value = null
})

useResizeObserver(canvasHostRef, debounceResize)

// backgroundColor 修改后立即重绘，实时生效
watch(
  [() => props.penColor, () => props.minWidth, () => props.maxWidth, () => props.backgroundColor],
  ([penColor, minWidth, maxWidth, bgColor]) => {
    if (!signaturePad.value) return
    signaturePad.value.penColor = penColor
    signaturePad.value.minWidth = minWidth
    signaturePad.value.maxWidth = maxWidth
    signaturePad.value.backgroundColor = bgColor
    syncResize() // 改色后重绘
  }
)

// 禁用状态监听
watch(
  () => props.disabled,
  (val) => {
    if (!signaturePad.value) return
    val ? signaturePad.value.off() : signaturePad.value.on()
  }
)

defineExpose<SignaturePadExpose>({
  clear,
  isEmpty,
  toBase64,
  toBlob,
  fromDataUrl
})
</script>

<style scoped lang="scss">
.signaturePad {
  width: 100%;
}

.canvasHost {
  width: 100%;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 10px;
}

.canvasEl {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

.canvasEl.isDisabled {
  cursor: not-allowed;
  opacity: 0.85;
}
</style>
