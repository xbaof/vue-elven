<template>
  <router-link class="logo-wrapper" :class="isCollapse ? 'no-title' : 'has-title'" to="/">
    <img src="@/assets/vue.svg?url" />
    <span class="ml-12">{{ title }} </span>
  </router-link>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/modules/app'

defineOptions({
  name: 'SidebarLogo'
})

const app = useAppStore()
const { sidebar, layout, device } = storeToRefs(app)

/**
 * 是否折叠状态
 * 侧边栏关闭且非水平布局且非移动端时折叠
 */
const isCollapse = computed(() => !sidebar.value.opened && layout.value !== 'horizontal' && device.value !== 'mobile')

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
      transform: scale(1);
      transition: transform 0.4s ease-in-out;
    }
  }
}
</style>
