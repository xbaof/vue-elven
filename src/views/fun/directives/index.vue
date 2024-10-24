<template>
  <n-space vertical :size="15" class="main-content">
    <n-card size="small" :segmented="{ content: true }">
      <template #header>
        <p>复制粘贴</p>
        <span class="describe"> 实现一键复制文本内容 </span>
      </template>
      <n-space>
        <n-input v-model:value="copyText" clearable placeholder="请输入" style="width: 320px" />
        <n-button v-clipboard:click="copyText">复制</n-button>
      </n-space>
    </n-card>
    <n-card size="small" :segmented="{ content: true }">
      <template #header>
        <p>防抖</p>
        <span class="describe"> 限制某个操作在短时间内的频繁触发，只有在一定的间隔时间内才执行相应的操作 </span>
      </template>
      <n-space>
        <n-input
          v-model:value="debounceText"
          v-optimize="{
            event: 'input',
            fn: onDebounce,
            timeout: 1000
          }"
          clearable
          placeholder="请输入"
          style="width: 320px"
        />
        <n-button
          v-optimize="{
            event: 'click',
            fn: () => {
              msg.success('这是一条防抖测试消息')
            },
            timeout: 1000
          }"
          >防抖测试</n-button
        >
      </n-space>
    </n-card>
    <n-card size="small" :segmented="{ content: true }">
      <template #header>
        <p>节流</p>
        <span class="describe"> 一个函数执行一次后，只有大于设定的执行周期才会执行第二次 </span>
      </template>
      <n-space>
        <n-input
          v-model:value="throttleText"
          v-optimize:throttle="{
            event: 'input',
            fn: onThrottle,
            timeout: 1000
          }"
          clearable
          placeholder="请输入"
          style="width: 320px"
        />
        <n-button
          v-optimize:throttle="{
            event: 'click',
            fn: () => {
              msg.success('这是一条节流测试消息')
            },
            timeout: 1000
          }"
          >节流测试</n-button
        >
      </n-space>
    </n-card>
    <n-card size="small" :segmented="{ content: true }">
      <template #header>
        <p>长按</p>
        <span class="describe"> 长按大于设定的执行周期才会执行一次函数 </span>
      </template>
      <n-button
        v-longpress="
          () => {
            msg.success('长按了1000毫秒')
          }
        "
        >长按测试</n-button
      >
    </n-card>
  </n-space>
</template>

<script lang="ts" setup>
import { useMessage } from 'naive-ui'
import { ref } from 'vue'
const copyText = ref<string>('')
const debounceText = ref<string>('')
const throttleText = ref<string>('')

const msg = useMessage()
const fn = (v) => {
  msg.success(copyText.value)
}
const onDebounce = (v) => {
  msg.success(debounceText.value)
}
const onThrottle = (v) => {
  msg.success(throttleText.value)
}
</script>
<style scoped>
.describe {
  font-size: 14px;
  color: var(--text-color-2);
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  cursor: pointer;
}
</style>
