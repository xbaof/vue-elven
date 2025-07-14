<template>
  <n-flex vertical :size="15" class="main-content">
    <n-list bordered>
      <n-list-item>
        <n-thing title="详情页" description="query传参" />
      </n-list-item>
      <n-list-item>
        <p class="pt-10 pb-10"> 当前页面参数为：{{ parameter }} </p>
      </n-list-item>
    </n-list>
  </n-flex>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const parameter = route.query
</script>
