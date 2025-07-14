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
              <svg-icon :icon="Redo" />
            </template>
            刷新当前
          </n-button>
          <n-button @click="handleClick('close')">
            <template #icon>
              <svg-icon :icon="Close" />
            </template>
            关闭当前
          </n-button>
          <n-button @click="handleClick('closeLeft')">
            <template #icon>
              <svg-icon :icon="ToLeft" />
            </template>
            关闭左侧
          </n-button>
          <n-button @click="handleClick('closeRight')">
            <template #icon>
              <svg-icon :icon="ToRight" />
            </template>
            关闭右侧
          </n-button>
          <n-button @click="handleClick('closeOther')">
            <template #icon>
              <svg-icon :icon="CloseOne" />
            </template>
            关闭其他
          </n-button>
          <n-button @click="handleClick('closeAll')">
            <template #icon>
              <svg-icon :icon="Minus" />
            </template>
            关闭全部
          </n-button>
          <n-button @click="handleClick('fullScreen')">
            <template #icon>
              <svg-icon :icon="FullScreen" />
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
import Redo from '@iconify-icons/icon-park-outline/redo'
import Close from '@iconify-icons/icon-park-outline/close'
import CloseOne from '@iconify-icons/icon-park-outline/close-one'
import ToLeft from '@iconify-icons/icon-park-outline/to-left'
import ToRight from '@iconify-icons/icon-park-outline/to-right'
import Minus from '@iconify-icons/icon-park-outline/minus'
import FullScreen from '@iconify-icons/icon-park-outline/full-screen'

import { ref, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore, useTagsViewStore } from '@/store'
import { isPathAndQueryEqual } from '@/store/modules/tagsView'
import { TagView, TagsViewState } from '@/store/interface'

const title = ref('标题-01')

const router = useRouter()
const route = useRoute()
const app = useAppStore()
const tagsView = useTagsViewStore()
const tag = computed<TagView>(
  () => tagsView.visitedViews.find((item) => isPathAndQueryEqual(item as TagView, route)) as TagView
)

const handleClick = async (key: string) => {
  switch (key) {
    case 'refresh':
      {
        tagsView.delCachedView(tag.value)
        await nextTick()
        const { fullPath, query } = route
        router.push({
          path: '/redirect' + fullPath,
          query: query
        })
      }
      break
    case 'close':
      tagsView.delView(tag.value).then((res: TagsViewState) => {
        toLastView(res.visitedViews, tag.value)
      })
      break
    case 'closeLeft':
      tagsView.delLeftViews(tag.value).then((res: TagsViewState) => {
        if (!res.visitedViews.find((o) => isPathAndQueryEqual(o, route))) {
          toLastView(res.visitedViews, tag.value)
        }
      })
      break
    case 'closeRight':
      tagsView.delRightViews(tag.value).then((res: TagsViewState) => {
        if (!res.visitedViews.find((o) => isPathAndQueryEqual(o, route))) {
          toLastView(res.visitedViews, tag.value)
        }
      })
      break
    case 'closeOther':
      tagOnClick(tag.value)
      tagsView.delOtherViews(tag.value)
      break
    case 'closeAll':
      tagsView.delAllViews().then((res: TagsViewState) => {
        toLastView(res.visitedViews, tag.value)
      })
      break
    case 'fullScreen':
      tagOnClick(tag.value)
      app.tagsView.fullScreen = true
      break
    default:
      break
  }
}
const toLastView = (visitedViews: TagView[], view?: TagView) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView && latestView.path) {
    tagOnClick(latestView)
  } else {
    if (view.name === 'Dashboard') {
      router.replace({ path: '/redirect' + view.path })
    } else {
      router.push('/')
    }
  }
}

const tagOnClick = (tag: TagView) => {
  const { path } = tag
  router.push(path)
}
const handleQuery = (id) => {
  router.push({ name: 'TagsQuery', query: { id: id, tagViewTitle: title.value } })
}
const handleParams = (id) => {
  // 路由跳转
  router.push({ name: 'TagsParams', params: { id: id, tagViewTitle: title.value } })
}
</script>
