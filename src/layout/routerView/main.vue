<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="tagsView.cachedViews">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'LayoutMain'
})
import { useTagsViewStore } from '@/store'
const tagsView = useTagsViewStore()
</script>
