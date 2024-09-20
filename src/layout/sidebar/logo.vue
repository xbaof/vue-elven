<template>
  <router-link class="logo-wrapper" :class="isCollapse ? 'no-title' : 'has-title'" to="/">
    <img src="@/assets/vue.svg?url" />
    <span class="ml-12">{{ title }} </span>
  </router-link>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '@/store'
const app = useAppStore()
const isCollapse = computed(() => !app.sidebar.opened && app.layout !== 'horizontal' && app.device !== 'mobile')
const title = computed(() => import.meta.env.VITE_GLOB_TITLE)
</script>

<style scoped lang="scss">
.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  outline: none;

  span {
    overflow: hidden;
    font-size: 1rem;
    font-weight: 600;
  }

  img {
    width: 32px;
    height: 32px;
  }

  &.no-title {
    img {
      position: absolute;
    }

    span {
      width: 0;
      transform: scale(0);
    }
  }

  &.has-title {
    span {
      width: auto;
      transition: transform 0.4s ease-in-out;
      transform: scale(1);
    }
  }
}
</style>
