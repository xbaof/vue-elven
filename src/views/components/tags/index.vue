<template>
  <n-flex vertical :size="15" class="main-content">
    <n-list bordered>
      <n-list-item>
        <n-thing title="标签页操作" />
      </n-list-item>
      <n-list-item>
        <n-flex>
          <n-button @click="handleClick('refresh')">
            <template #icon>
              <svg-icon :icon="refreshIcon" />
            </template>
            刷新当前
          </n-button>
          <n-button @click="handleClick('close')">
            <template #icon>
              <svg-icon :icon="closeIcon" />
            </template>
            关闭当前
          </n-button>
          <n-button @click="handleClick('closeLeft')">
            <template #icon>
              <svg-icon :icon="closeLeftIcon" />
            </template>
            关闭左侧
          </n-button>
          <n-button @click="handleClick('closeRight')">
            <template #icon>
              <svg-icon :icon="closeRightIcon" />
            </template>
            关闭右侧
          </n-button>
          <n-button @click="handleClick('closeOther')">
            <template #icon>
              <svg-icon :icon="closeOtherIcon" />
            </template>
            关闭其他
          </n-button>
          <n-button @click="handleClick('closeAll')">
            <template #icon>
              <svg-icon :icon="closeAllIcon" />
            </template>
            关闭全部
          </n-button>
          <n-button @click="handleClick('fullScreen')">
            <template #icon>
              <svg-icon :icon="fullScreenIcon" />
            </template>
            全屏当前页
          </n-button>
        </n-flex>
      </n-list-item>
    </n-list>

    <n-list bordered>
      <n-list-item>
        <n-thing title="页内跳转" />
      </n-list-item>
      <n-list-item>
        <n-thing title="标签页标题">
          <n-flex :size="15">
            <n-input v-model:value="title" style="width: 320px" />
            <n-button @click="handleQuery(1)"> 打开页面1（query传参） </n-button>
            <n-button @click="handleQuery(2)"> 打开页面2（query传参） </n-button>
            <n-button @click="handleParams(1)"> 打开页面1（params传参） </n-button>
            <n-button @click="handleParams(2)"> 打开页面2（params传参） </n-button>
          </n-flex>
        </n-thing>
      </n-list-item>
    </n-list>
  </n-flex>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Tags'
})

import { ref } from 'vue'
import refreshIcon from '@iconify-icons/icon-park-outline/redo'
import closeIcon from '@iconify-icons/icon-park-outline/close'
import closeOtherIcon from '@iconify-icons/icon-park-outline/close-one'
import closeLeftIcon from '@iconify-icons/icon-park-outline/to-left'
import closeRightIcon from '@iconify-icons/icon-park-outline/to-right'
import closeAllIcon from '@iconify-icons/icon-park-outline/minus'
import fullScreenIcon from '@iconify-icons/icon-park-outline/full-screen'
import { useSafeNavigation } from '@/hooks/useSafeNavigation'
import { useTagsActions, type TagActionKey } from '@/hooks/useTagsActions'

const title = ref('标题-01')
const { push } = useSafeNavigation()
const { currentTag, executeTagAction } = useTagsActions()

const handleClick = async (actionKey: TagActionKey): Promise<void> => {
  await executeTagAction(actionKey, currentTag.value)
}

const handleQuery = (id: number): void => {
  void push({
    name: 'TagsQuery',
    query: { id, tagViewTitle: title.value }
  })
}

const handleParams = (id: number): void => {
  void push({
    name: 'TagsParams',
    params: { id, tagViewTitle: title.value }
  })
}
</script>
