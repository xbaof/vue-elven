<template>
  <Icon :icon="icons.chart" height="24" />
  <svg-icon :icon="icons.chart" size="40" color="red" :depth="5" />
  <svg-icon icon="icon-park-outline:abnormal" size="40" color="red" :depth="5" />
  <svg-icon icon="local:device" size="40" color="red" :depth="5" />
</template>

<script lang="ts">
import { Icon } from '@iconify/vue'
import setting from '@iconify-icons/icon-park-outline/setting'
import abnormal from '@iconify-icons/icon-park-outline/abnormal'
import SvgIcon from '@/components/SvgIcon/index.vue'

export default {
  components: {
    Icon
  },
  data() {
    return {
      // Assign icon data to icons.chart
      icons: {
        chart: setting
      }
    }
  }
}
</script>
