<template>
  <n-flex vertical :size="15" class="main-content">
    <n-list bordered>
      <n-list-item>
        <n-thing title="复制粘贴" description="实现一键复制文本内容" />
      </n-list-item>
      <n-list-item>
        <n-flex>
          <n-input v-model:value="copyText" clearable placeholder="请输入" style="width: 320px" />
          <n-button v-clipboard:click="copyText"> 复制 </n-button>
        </n-flex>
      </n-list-item>
    </n-list>
    <n-list bordered>
      <n-list-item>
        <n-thing title="防抖" description="限制某个操作在短时间内的频繁触发，只有在一定的间隔时间内才执行相应的操作" />
      </n-list-item>
      <n-list-item>
        <n-flex>
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
                uiFeedback.msgSuccess('这是一条防抖测试消息')
              },
              timeout: 1000
            }"
          >
            防抖测试
          </n-button>
        </n-flex>
      </n-list-item>
    </n-list>
    <n-list bordered>
      <n-list-item>
        <n-thing title="节流" description="一个函数执行一次后，只有大于设定的执行周期才会执行第二次" />
      </n-list-item>
      <n-list-item>
        <n-flex>
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
                uiFeedback.msgSuccess('这是一条节流测试消息')
              },
              timeout: 1000
            }"
          >
            节流测试
          </n-button>
        </n-flex>
      </n-list-item>
    </n-list>
    <n-list bordered>
      <n-list-item>
        <n-thing title="长按" description="长按大于设定的执行周期才会执行一次函数" />
      </n-list-item>
      <n-list-item>
        <n-button
          v-longpress="
            (evt: PointerEvent) => {
              console.log('PointerEvent：', evt)
              uiFeedback.msgSuccess('长按了1000毫秒')
            }
          "
        >
          长按测试
        </n-button>
      </n-list-item>
    </n-list>
  </n-flex>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'Directive'
})
import { ref } from 'vue'
import { useUiFeedback } from '@/hooks/useUiFeedback'
const copyText = ref<string>('')
const debounceText = ref<string>('')
const throttleText = ref<string>('')

const uiFeedback = useUiFeedback()
const onDebounce = () => {
  uiFeedback.msgSuccess(debounceText.value)
}
const onThrottle = () => {
  uiFeedback.msgSuccess(throttleText.value)
}
</script>
