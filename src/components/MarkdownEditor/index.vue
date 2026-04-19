<template>
  <div ref="containerRef" class="markdownEditor">
    <MdEditor
      ref="editorRef"
      class="editorInstance"
      :model-value="props.modelValue"
      :theme="theme"
      :language="props.language"
      :placeholder="props.placeholder"
      :read-only="props.readOnly"
      :disabled="props.disabled"
      :toolbars="resolvedToolbars"
      :toolbars-exclude="props.toolbarsExclude"
      :style="{ height: props.height }"
      @update:model-value="handleValueChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdEditor, type ToolbarNames } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useAppStore } from '@/store/modules/app'

defineOptions({
  name: 'MarkdownEditor'
})

interface Props {
  modelValue?: string
  height?: string
  placeholder?: string
  readOnly?: boolean
  disabled?: boolean
  language?: string
  toolbars?: ToolbarNames[]
  toolbarsExclude?: ToolbarNames[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: '420px',
  placeholder: '请输入 Markdown 内容...',
  readOnly: false,
  disabled: false,
  language: 'zh-CN',
  toolbars: () => [],
  toolbarsExclude: () => []
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
}>()

const appStore = useAppStore()
const containerRef = ref<HTMLElement | null>(null)

const resolvedToolbars = computed(() => {
  return props.toolbars.length > 0 ? props.toolbars : undefined
})
const theme = computed(() => (appStore.isDark ? 'dark' : 'light'))

const handleValueChange = (value: string): void => {
  emit('update:modelValue', value)
  emit('change', value)
}

defineExpose({
  clear: () => handleValueChange(''),
  setValue: (value: string) => handleValueChange(value),
  getValue: () => props.modelValue,
  focus: () => containerRef.value?.querySelector<HTMLTextAreaElement>('textarea')?.focus()
})
</script>

<style lang="scss" scoped>
.markdownEditor {
  width: 100%;
}

.editorInstance {
  border: 1px solid var(--border-color);
}
</style>
