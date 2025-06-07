<template>
  <n-flex vertical :size="15" class="main-content">
    <n-list bordered>
      <n-list-item>
        <n-thing title="富文本编辑器" />
      </n-list-item>
      <n-list-item>
        <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
          <n-form-item path="editorText">
            <WangEditor v-model:value="formValue.editorText" @change="handleEditorChange" />
          </n-form-item>
        </n-form>
      </n-list-item>
    </n-list>
  </n-flex>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'Dangeditor'
})
import WangEditor from '@/components/WangEditor/index.vue'
import { IDomEditor } from '@wangeditor/editor'
import { ref, onMounted } from 'vue'

const formValue = ref({
  editorText: '<p>hello</p>'
})
const rules = ref({
  editorText: { required: true, message: '请输入文本内容', trigger: ['blur', 'change'] }
})

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    formValue.value.editorText = '<p>模拟 Ajax 异步设置内容</p>'
  }, 1500)
})

const handleEditorChange = (editor: IDomEditor) => {
  console.log('text：', editor.getText())
}
</script>
