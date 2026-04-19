<template>
  <n-flex vertical :size="15" class="main-content markdownPage">
    <n-list bordered>
      <n-list-item>
        <n-thing title="MarkdownEditor 示例" description="演示 Markdown 编辑、只读切换与内容回填能力。" />
      </n-list-item>
      <n-list-item>
        <markdown-editor
          ref="editorRef"
          v-model="markdownValue"
          :height="'480px'"
          :read-only="readOnlyMode"
          :toolbars-exclude="toolbarExcludeList"
        />
        <n-flex class="actionRow" :size="8" wrap>
          <n-button type="primary" @click="copyMarkdown">复制 Markdown</n-button>
          <n-button @click="resetDemoContent">重置示例内容</n-button>
          <n-button type="warning" secondary @click="clearEditorContent">清空内容</n-button>
          <n-button :type="readOnlyMode ? 'success' : 'default'" @click="toggleReadonlyMode">
            {{ readOnlyMode ? '切换为可编辑' : '切换为只读' }}
          </n-button>
        </n-flex>
      </n-list-item>
    </n-list>

    <n-list bordered>
      <n-list-item>
        <n-thing title="组件参数说明" description="文档内容来自 docs/component-api/markdown-editor.md" />
      </n-list-item>
      <n-list-item>
        <div class="markdownDoc" v-html="docHtml" />
      </n-list-item>
    </n-list>
  </n-flex>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import type { ToolbarNames } from 'md-editor-v3'
import MarkdownEditor from '@/components/MarkdownEditor/index.vue'
import { useUiFeedback } from '@/hooks/useUiFeedback'
import { useMarkdownDoc } from '@/hooks/useMarkdownDoc'
import markdownEditorDocRaw from '@docs/component-api/markdown-editor.md?raw'

defineOptions({
  name: 'MarkdownDemo'
})

interface MarkdownEditorExposed {
  clear: () => void
  setValue: (value: string) => void
  getValue: () => string
}

const initialDemoContent = `# MarkdownEditor 组件示例

## 功能点

- 支持双向绑定（v-model）
- 支持只读模式
- 预览开关使用编辑器工具栏

\`\`\`ts
const message = 'hello markdown'
console.log(message)
\`\`\`
`

const editorRef = ref<MarkdownEditorExposed | null>(null)
const markdownValue = ref(initialDemoContent)
const readOnlyMode = ref(false)
const { copy, isSupported } = useClipboard()
const { msgSuccess, msgWarning, msgErrorFromUnknown } = useUiFeedback()
const { docHtml } = useMarkdownDoc(markdownEditorDocRaw)

const toolbarExcludeList: ToolbarNames[] = ['github', 'catalog', 'save']

const resetDemoContent = (): void => {
  editorRef.value?.setValue(initialDemoContent)
  msgSuccess('已恢复示例内容')
}

const clearEditorContent = (): void => {
  editorRef.value?.clear()
  msgWarning('内容已清空')
}

const copyMarkdown = async (): Promise<void> => {
  if (!isSupported.value) {
    msgWarning('当前环境不支持剪贴板复制')
    return
  }

  try {
    await copy(markdownValue.value)
    msgSuccess('Markdown 已复制到剪贴板')
  } catch (error) {
    msgErrorFromUnknown(error, '复制失败，请检查浏览器剪贴板权限')
  }
}

const toggleReadonlyMode = (): void => {
  readOnlyMode.value = !readOnlyMode.value
}
</script>

<style scoped lang="scss">
.markdownPage {
  .actionRow {
    margin-top: 12px;
  }
}
</style>
