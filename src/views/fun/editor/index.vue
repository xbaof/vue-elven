<template>
  <n-flex vertical :size="15" class="main-content editorPage">
    <n-list bordered>
      <n-list-item>
        <n-thing title="WangEditor 示例" description="演示通用富文本组件的编辑、只读切换、输出和预览能力。" />
      </n-list-item>
      <n-list-item>
        <n-grid :cols="2" :x-gap="12" :y-gap="12" item-responsive responsive="screen" class="editorSplit">
          <n-grid-item span="2 m:1">
            <div class="editorPane">
              <wang-editor
                ref="editorRef"
                v-model="editorHtml"
                height="360px"
                mode="default"
                :disabled="readonlyMode"
                :editor-config="editorConfig"
              />
              <n-flex class="actionRow" :size="8" wrap>
                <n-button type="primary" @click="copyHtml">复制 HTML</n-button>
                <n-button @click="resetDemoContent">重置示例内容</n-button>
                <n-button type="warning" secondary @click="clearEditorContent">清空内容</n-button>
                <n-button secondary @click="focusEditorContent">聚焦编辑器</n-button>
                <n-button :type="readonlyMode ? 'success' : 'default'" @click="toggleReadonlyMode">
                  {{ readonlyMode ? '切换为可编辑' : '切换为只读' }}
                </n-button>
              </n-flex>
            </div>
          </n-grid-item>

          <n-grid-item span="2 m:1">
            <div class="previewPane">
              <div v-if="hasPreviewContent" class="previewPanel" v-html="editorHtml" />
              <div v-else class="previewPanel flex-center">
                <n-empty description="暂无可预览内容" />
              </div>
            </div>
          </n-grid-item>
        </n-grid>
      </n-list-item>
    </n-list>

    <n-list bordered>
      <n-list-item>
        <n-thing title="组件参数说明" description="文档内容来自 docs/component-api/editor.md" />
      </n-list-item>
      <n-list-item>
        <div class="markdownDoc" v-html="docHtml" />
      </n-list-item>
    </n-list>
  </n-flex>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import type { IEditorConfig } from '@wangeditor/editor'
import WangEditor from '@/components/WangEditor/index.vue'
import { useUiFeedback } from '@/hooks/useUiFeedback'
import { useMarkdownDoc } from '@/hooks/useMarkdownDoc'
import { useAppStore } from '@/store/modules/app'
import editorDocRaw from '@docs/component-api/editor.md?raw'

defineOptions({
  name: 'EditorDemo'
})

interface WangEditorExposed {
  focus: () => void
  clear: () => void
}

const initialDemoContent = `<h2>富文本编辑器示例</h2><p>这里是默认内容，你可以直接修改并在右侧查看渲染预览结果。</p><p><strong>支持能力：</strong>标题、加粗、列表、链接、图片、视频、代码块等。</p>`

const appStore = useAppStore()
const editorRef = ref<WangEditorExposed | null>(null)
const editorHtml = ref(initialDemoContent)
const readonlyMode = ref(false)
const { copy, isSupported } = useClipboard()
const { msgSuccess, msgWarning, msgErrorFromUnknown } = useUiFeedback()
const { docHtml } = useMarkdownDoc(editorDocRaw)

const editorConfig = computed<Partial<IEditorConfig>>(() => ({
  placeholder: '请输入内容...',
  MENU_CONF: {}
}))

const hasPreviewContent = computed(() => Boolean(editorHtml.value.trim()))
const plainTextLength = computed(() => {
  const parser = new DOMParser()
  const htmlDocument = parser.parseFromString(editorHtml.value, 'text/html')
  return (htmlDocument.body.textContent || '').trim().length
})

const resetDemoContent = (): void => {
  editorHtml.value = initialDemoContent
  msgSuccess('已恢复示例内容')
}

const clearEditorContent = (): void => {
  editorRef.value?.clear()
  msgWarning('内容已清空')
}

const focusEditorContent = (): void => {
  editorRef.value?.focus()
}

const copyHtml = async (): Promise<void> => {
  if (!isSupported.value) {
    msgWarning('当前环境不支持剪贴板复制')
    return
  }
  try {
    await copy(editorHtml.value)
    msgSuccess('HTML 已复制到剪贴板')
  } catch (error) {
    msgErrorFromUnknown(error, '复制失败，请检查浏览器剪贴板权限')
  }
}

const toggleReadonlyMode = (): void => {
  readonlyMode.value = !readonlyMode.value
}
</script>

<style scoped lang="scss">
.editorPage {
  .editorPane,
  .previewPane {
    width: 100%;
  }

  .actionRow {
    margin-top: 12px;
  }

  .previewPanel {
    width: 100%;
    min-height: 441px;
    padding: 12px;
    overflow-x: auto;
    line-height: 1.7;
    color: var(--text-color-1);
    background: var(--body-color);
    border: 1px solid var(--border-color);
  }
}
</style>
