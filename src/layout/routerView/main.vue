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
import { useTagsViewStore } from '@/store/modules/tagsView'

defineOptions({
  name: 'LayoutMain'
})

const tagsView = useTagsViewStore()
</script>
