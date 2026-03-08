<template>
  <n-flex vertical :size="15" class="main-content">
    <n-alert type="info" :show-icon="false">
      当前页面用于验证“固定标签页（isAffix）”行为，便于测试标签页在跳转、刷新、多参数场景下的表现。
    </n-alert>

    <n-card>
      <n-flex vertical :size="12">
        <n-thing :title="pageMeta.title" description="测试页面（标签页固定）" />
        <n-descriptions bordered :column="1" size="small" label-placement="left">
          <n-descriptions-item label="当前路径">{{ route.path }}</n-descriptions-item>
          <n-descriptions-item label="完整路径">{{ route.fullPath }}</n-descriptions-item>
          <n-descriptions-item label="是否固定标签">{{ pageMeta.isAffix ? '是' : '否' }}</n-descriptions-item>
          <n-descriptions-item label="是否显示标签">{{ pageMeta.isTagsView ? '是' : '否' }}</n-descriptions-item>
          <n-descriptions-item label="是否缓存页面">{{ pageMeta.isKeepAlive ? '是' : '否' }}</n-descriptions-item>
          <n-descriptions-item label="菜单层级链路">{{ menuTrailText }}</n-descriptions-item>
          <n-descriptions-item label="匹配路由链">{{ routeTrailText }}</n-descriptions-item>
          <n-descriptions-item label="已打开标签数">{{ visitedTagCount }}</n-descriptions-item>
          <n-descriptions-item label="缓存标签数">{{ cachedTagCount }}</n-descriptions-item>
        </n-descriptions>
      </n-flex>
    </n-card>

    <n-card title="测试操作">
      <n-flex wrap :size="12">
        <n-button type="primary" @click="refreshCurrentTag">刷新当前标签</n-button>
        <n-button @click="openCurrentWithNewQuery">以新 Query 打开当前页</n-button>
        <n-button @click="goDashboard">跳转到首页</n-button>
        <n-button @click="backToTest">返回测试页</n-button>
      </n-flex>
    </n-card>

    <n-grid :cols="2" :x-gap="12" :y-gap="12" item-responsive responsive="screen">
      <n-grid-item span="2 m:1">
        <n-card title="Route Params">
          <pre class="debugText">{{ routeParamsText }}</pre>
        </n-card>
      </n-grid-item>
      <n-grid-item span="2 m:1">
        <n-card title="Route Query">
          <pre class="debugText">{{ routeQueryText }}</pre>
        </n-card>
      </n-grid-item>
    </n-grid>

    <n-card title="已打开标签列表">
      <n-table striped :single-line="false" size="small">
        <thead>
          <tr>
            <th>标题</th>
            <th>路径</th>
            <th>状态</th>
            <th>Query</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tagItem in visitedViews" :key="getTagKey(tagItem)">
            <td>{{ tagItem.title || '-' }}</td>
            <td>{{ tagItem.path }}</td>
            <td>
              <n-flex :size="6" wrap>
                <n-tag v-if="tagItem.meta?.isAffix" type="success" size="small">固定</n-tag>
                <n-tag v-if="isCachedTag(tagItem)" type="info" size="small">缓存</n-tag>
                <n-tag v-if="isActiveTag(tagItem)" type="warning" size="small">当前</n-tag>
              </n-flex>
            </td>
            <td>
              <span class="queryText">{{ formatQueryText(tagItem.query) }}</span>
            </td>
          </tr>
          <tr v-if="visitedViews.length === 0">
            <td colspan="4" class="emptyRow">暂无标签数据</td>
          </tr>
        </tbody>
      </n-table>
    </n-card>
  </n-flex>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useSafeNavigation } from '@/hooks/useSafeNavigation'
import { useTagsActions } from '@/hooks/useTagsActions'
import type { TagView } from '@/store/types'

defineOptions({
  name: 'Test'
})

const route = useRoute()
const { push } = useSafeNavigation()
const tagsViewStore = useTagsViewStore()
const { visitedViews, cachedViews } = storeToRefs(tagsViewStore)
const { currentTag, executeTagAction } = useTagsActions()
const querySerial = ref(1)

const pageMeta = computed(() => {
  return {
    title: (route.meta?.title as string) || '测试（标签页固定）',
    isAffix: Boolean(route.meta?.isAffix),
    isTagsView: Boolean(route.meta?.isTagsView),
    isKeepAlive: Boolean(route.meta?.isKeepAlive)
  }
})

const menuTrailText = computed(() => {
  const titleList = route.matched
    .map((routeRecord) => routeRecord.meta?.title)
    .filter((title) => typeof title === 'string' && title.length > 0)
  return titleList.length > 0 ? titleList.join(' > ') : '暂无菜单层级信息'
})

const routeTrailText = computed(() => {
  const pathList = route.matched.map((routeRecord) => routeRecord.path).filter((pathText) => Boolean(pathText))
  return pathList.length > 0 ? pathList.join(' > ') : '暂无匹配路由信息'
})

const routeParamsText = computed(() => {
  return Object.keys(route.params).length > 0 ? JSON.stringify(route.params, null, 2) : '暂无 params 参数'
})

const routeQueryText = computed(() => {
  return Object.keys(route.query).length > 0 ? JSON.stringify(route.query, null, 2) : '暂无 query 参数'
})

const visitedTagCount = computed(() => visitedViews.value.length)
const cachedTagCount = computed(() => cachedViews.value.length)

const getTagKey = (tagItem: TagView): string => {
  return `${tagItem.path}|${JSON.stringify(tagItem.query || {})}`
}

const isCachedTag = (tagItem: TagView): boolean => {
  return cachedViews.value.includes(tagItem.name)
}

const isActiveTag = (tagItem: TagView): boolean => {
  return getTagKey(tagItem) === `${route.path}|${JSON.stringify(route.query || {})}`
}

const formatQueryText = (queryValue: TagView['query']): string => {
  return queryValue && Object.keys(queryValue).length > 0 ? JSON.stringify(queryValue) : '-'
}

const refreshCurrentTag = async (): Promise<void> => {
  await executeTagAction('refresh', currentTag.value)
}

const openCurrentWithNewQuery = async (): Promise<void> => {
  querySerial.value += 1
  await push({
    path: route.path,
    query: {
      ...route.query,
      serial: String(querySerial.value),
      tagViewTitle: `测试标签-${querySerial.value}`
    }
  })
}

const goDashboard = async (): Promise<void> => {
  await push('/index')
}

const backToTest = async (): Promise<void> => {
  await push('/test')
}
</script>

<style scoped lang="scss">
.debugText {
  margin: 0;
  font-family: Consolas, Monaco, monospace;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
}

.queryText {
  font-family: Consolas, Monaco, monospace;
  font-size: 12px;
}

.emptyRow {
  color: var(--text-color-3);
  text-align: center;
}
</style>
