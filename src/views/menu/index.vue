<template>
  <n-flex vertical :size="15" class="main-content">
    <n-alert type="info" :show-icon="false">
      当前为通用菜单占位页。菜单、子菜单、子子菜单可复用此页面，后续按业务逐步替换为真实功能页面。
    </n-alert>

    <n-card>
      <n-flex vertical :size="12">
        <n-thing :title="pageTitle" description="菜单占位页面（支持多级菜单复用）" />

        <n-descriptions bordered :column="1" size="small" label-placement="left">
          <n-descriptions-item label="当前路径">{{ route.path }}</n-descriptions-item>
          <n-descriptions-item label="完整路径">{{ route.fullPath }}</n-descriptions-item>
          <n-descriptions-item label="菜单层级">{{ menuLevel }} 级</n-descriptions-item>
          <n-descriptions-item label="层级链路">{{ menuTrailText }}</n-descriptions-item>
          <n-descriptions-item label="匹配路由链">{{ routePathTrailText }}</n-descriptions-item>
        </n-descriptions>
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
  </n-flex>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'MenuPlaceholder'
})

const route = useRoute()

const pageTitle = computed(() => {
  return (route.meta?.title as string) || '菜单占位页面'
})

const menuTrail = computed(() => {
  return route.matched
    .map((routeRecord) => routeRecord.meta?.title)
    .filter((title) => typeof title === 'string' && title.length > 0) as string[]
})

const menuLevel = computed(() => {
  return Math.max(menuTrail.value.length, 1)
})

const menuTrailText = computed(() => {
  return menuTrail.value.length > 0 ? menuTrail.value.join(' > ') : '暂无菜单层级信息'
})

const routePathTrailText = computed(() => {
  const pathList = route.matched.map((routeRecord) => routeRecord.path).filter((path) => Boolean(path))
  return pathList.length > 0 ? pathList.join(' > ') : '暂无匹配路由信息'
})

const routeParamsText = computed(() => {
  return Object.keys(route.params).length > 0 ? JSON.stringify(route.params, null, 2) : '暂无 params 参数'
})

const routeQueryText = computed(() => {
  return Object.keys(route.query).length > 0 ? JSON.stringify(route.query, null, 2) : '暂无 query 参数'
})
</script>

<style scoped lang="scss">
.debugText {
  margin: 0;
  font-family: Consolas, Monaco, monospace;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>
