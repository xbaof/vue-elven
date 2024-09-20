<template>
  <IconPicker v-model="icon" />
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref } from 'vue'
import IconPicker from '@/components/IconPicker/index.vue'
const icon = ref()
</script>
