<template>
  <div class="footer-wrapper">
    Copyright MIT © 2024
    <a href="https://github.com/xbaof/vue-elven" target="_blank"> &nbsp;xbaof </a>
  </div>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'LayoutFooter'
})
</script>
<style scoped>
.footer-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  color: rgb(107 114 128);
}
</style>
