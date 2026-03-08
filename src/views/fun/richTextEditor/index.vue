<template>
  <n-flex vertical :size="15" class="main-content">
    <n-alert type="info" :show-icon="false"> 当前页面为功能占位，后续会补充富文本编辑、内容预览与上传能力。 </n-alert>

    <n-card class="placeholderCard" :bordered="false">
      <n-empty size="large" description="富文本编辑器模块开发中">
        <template #extra>
          <n-text depth="3">敬请期待后续版本。</n-text>
        </template>
      </n-empty>
    </n-card>
  </n-flex>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'RichTextEditor'
})
</script>

<style scoped lang="scss">
.placeholderCard {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
}
</style>
