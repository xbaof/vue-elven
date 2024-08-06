<template>
  <n-select v-model:value="selectedIcon" :options="[]" :render-tag="renderSelectTag">
    <template #empty>
      <n-tabs type="line" animated>
        <n-tab-pane name="oasis" tab="Oasis"> Wonderwall </n-tab-pane>
        <n-tab-pane name="the beatles" tab="the Beatles"> Hey Jude </n-tab-pane>
        <n-tab-pane name="jay chou" tab="周杰伦"> 七里香 </n-tab-pane>
      </n-tabs>
    </template>
  </n-select>
</template>

<script lang="ts" setup>
import { defineComponent, h, ref, computed } from 'vue'
import type { SelectRenderLabel, SelectRenderTag } from 'naive-ui'
import { NAvatar, NText } from 'naive-ui'
import SvgIcon from '../SvgIcon/index.vue'

const props = defineProps({
  modelValue: {
    type: String,
    require: false,
    default: ''
  },
  noMatchText: {
    type: String,
    default: '未能找到相符的图标'
  },
  noDataText: {
    type: String,
    default: '图标列表为空'
  }
})
const emit = defineEmits(['update:modelValue'])
const selectedIcon = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const renderSelectTag: SelectRenderTag = ({ option }) => {
  return h(
    'div',
    {
      class: 'flx-align-center'
    },
    [
      h(SvgIcon, {
        icon: option.value as string,
        size: 24
      }),
      h('span', { class: 'pl5' }, [option.label as string])
    ]
  )
}

/* 数据源 */
</script>

<style scoped lang="scss">
:deep(n-tabs-tab) {
  padding: 0;
}

:deep(.el-tabs__header) {
  margin: 0 0 0.25rem;
}

:deep(.el-tabs__nav-wrap.is-scrollable) {
  padding: 0 26px;
}

:deep(.el-tabs__nav-wrap) {
  padding: 0 18px;
}

:deep(.el-tabs__nav-next) {
  font-size: 15px;
  line-height: 38px;
  box-shadow: -5px 0 5px -6px #cccccc;
}

:deep(.el-tabs__nav-prev) {
  font-size: 15px;
  line-height: 38px;
  box-shadow: 5px 0 5px -6px #cccccc;
}

:deep(.el-tabs__item) {
  height: 35px;
  font-size: 12px;
  font-weight: normal;
  line-height: 35px;
}

:deep(.el-select__placeholder) {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
