<template>
  <div style="padding: 15px">
    <IconPicker v-model="value" clearable placeholder="选择图标" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, h, ref } from 'vue'
import IconPicker from '@/components/IconPicker/index.vue'
const value = ref('local:device')
</script>
