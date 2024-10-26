<template>
  <div v-if="tagsView.fullScreen" class="closeFull-wrapper">
    <div class="closeFull-icon">
      <svg-icon :icon="Close" :size="12" @click="tagsView.fullScreen = false" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import Close from '@iconify-icons/icon-park-outline/close'

import { useAppStore } from '@/store'
import { storeToRefs } from 'pinia'
const app = useAppStore()
const { tagsView } = storeToRefs(app)
</script>
<style lang="scss" scoped>
.closeFull-wrapper {
  position: absolute;
  top: -30px;
  right: -30px;
  z-index: 9999;
  opacity: 0;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
  }

  .closeFull-icon {
    position: relative;
    width: 60px;
    height: 60px;
    cursor: pointer;
    background: var(--close-color-hover);
    border-radius: 100%;

    .n-icon {
      top: 32px;
      left: 12px;
      color: var(--close-icon-color);

      &:hover {
        color: var(--primary-color);
      }
    }
  }
}
</style>
