<template>
  <div class="wangEditorBox" :class="{ isDisabled }">
    <Toolbar
      v-if="!props.hideToolBar && editorRef"
      class="editorToolbar"
      :editor="editorRef"
      :default-config="props.toolbarConfig"
      :mode="props.mode"
    />

    <Editor
      v-model="innerValue"
      class="editorContent"
      :style="{ height: props.height }"
      :mode="props.mode"
      :default-config="editorConfig"
      @on-created="handleCreated"
      @on-focus="handleFocus"
      @on-blur="handleBlur"
      @on-change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, shallowRef, watch, watchEffect } from 'vue'
import { IToolbarConfig, IEditorConfig, IDomEditor } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { formItemInjectionKey } from 'naive-ui/es/_mixins/use-form-item'
import { uploadImg, uploadVideo } from '@/api/system/upload'
import { useUiFeedback } from '@/hooks/useUiFeedback'
import '@wangeditor/editor/dist/css/style.css'

defineOptions({
  name: 'WangEditor'
})

const emptyEditorHtml = '<p><br></p>'
const maxImageSize = 5 * 1024 * 1024
const maxVideoSize = 50 * 1024 * 1024

interface Props {
  modelValue: string
  toolbarConfig?: Partial<IToolbarConfig>
  editorConfig?: Partial<IEditorConfig>
  height?: string
  mode?: 'default' | 'simple'
  hideToolBar?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  toolbarConfig: () => ({ excludeKeys: [] }),
  editorConfig: () => ({ placeholder: '请输入内容...', MENU_CONF: {} }),
  height: '360px',
  mode: 'default',
  hideToolBar: false,
  disabled: false
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'focus', editor: IDomEditor): void
  (event: 'blur', editor: IDomEditor): void
  (event: 'change', editor: IDomEditor): void
}>()

const editorRef = shallowRef<IDomEditor | null>(null)
const formItemContext = inject(formItemInjectionKey, void 0)
const { msgWarning, msgErrorFromUnknown } = useUiFeedback()

const isDisabled = computed(() => Boolean(props.disabled || formItemContext?.disabled.value))
const innerValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', editorRef.value?.isEmpty() ? '' : value)
})

const defaultImageUpload = async (file: File, insertFn: (url: string, alt?: string, href?: string) => void) => {
  if (!file.type.startsWith('image/')) {
    return msgWarning('仅支持上传图片文件')
  }
  if (file.size > maxImageSize) {
    return msgWarning('图片大小不能超过 5MB')
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await uploadImg(formData)
    if (!data?.fileUrl) {
      msgWarning('图片上传失败，未获取到可用地址')
      return
    }
    insertFn(data.fileUrl, file.name, data.fileUrl)
  } catch (error) {
    msgErrorFromUnknown(error, '图片上传失败，请稍后重试')
  }
}

const defaultVideoUpload = async (file: File, insertFn: (url: string, poster?: string) => void) => {
  if (!file.type.startsWith('video/')) {
    return msgWarning('仅支持上传视频文件')
  }
  if (file.size > maxVideoSize) {
    return msgWarning('视频大小不能超过 50MB')
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await uploadVideo(formData)
    if (!data?.fileUrl) {
      msgWarning('视频上传失败，未获取到可用地址')
      return
    }
    insertFn(data.fileUrl)
  } catch (error) {
    msgErrorFromUnknown(error, '视频上传失败，请稍后重试')
  }
}

const editorConfig = computed<Partial<IEditorConfig>>(() => {
  const menuConfig = (props.editorConfig.MENU_CONF || {}) as Record<string, any>
  const uploadImageConfig = menuConfig.uploadImage || {}
  const uploadVideoConfig = menuConfig.uploadVideo || {}

  return {
    ...props.editorConfig,
    readOnly: isDisabled.value,
    MENU_CONF: {
      ...menuConfig,
      uploadImage: {
        ...uploadImageConfig,
        customUpload: uploadImageConfig.customUpload || defaultImageUpload
      },
      uploadVideo: {
        ...uploadVideoConfig,
        customUpload: uploadVideoConfig.customUpload || defaultVideoUpload
      }
    }
  }
})

const handleCreated = (editor: IDomEditor) => (editorRef.value = editor)

const handleFocus = (editor: IDomEditor) => {
  formItemContext?.handleContentFocus()
  emit('focus', editor)
}

const handleBlur = (editor: IDomEditor) => {
  formItemContext?.handleContentBlur()
  emit('blur', editor)
}

const handleChange = (editor: IDomEditor) => {
  formItemContext?.handleContentChange()
  emit('change', editor)
}

watchEffect(() => {
  const editor = editorRef.value
  if (editor) {
    isDisabled.value ? editor.disable() : editor.enable()
  }
})

watch(
  () => props.modelValue,
  (newValue) => {
    const editor = editorRef.value
    if (editor && newValue !== editor.getHtml()) {
      editor.setHtml(newValue || emptyEditorHtml)
    }
  }
)

defineExpose({
  editor: editorRef,
  focus: () => editorRef.value?.focus(),
  clear: () => editorRef.value?.clear(),
  getHtml: () => editorRef.value?.getHtml() || '',
  setHtml: (htmlValue: string) => editorRef.value?.setHtml(htmlValue || emptyEditorHtml)
})

onBeforeUnmount(() => {
  editorRef.value?.destroy()
})
</script>

<style scoped lang="scss">
.wangEditorBox {
  z-index: 2;
  width: 100%;

  &.isDisabled {
    cursor: not-allowed !important;
  }
}

.editorToolbar {
  border: 1px solid var(--border-color);
  border-bottom: 0;
}

.editorContent {
  overflow-y: hidden;
  border: 1px solid var(--border-color);
}
</style>
