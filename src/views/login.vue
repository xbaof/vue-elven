<template>
  <IconPicker v-model="value" filterable clearable placeholder="选择图标" />
</template>

<script lang="ts" setup>
import { defineComponent, h, ref } from 'vue'
import IconPicker from '@/components/IconPicker/index.vue'
const value = ref('svg-spinners:wind-toy')
</script>
