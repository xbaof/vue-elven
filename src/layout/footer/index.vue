<template>
  <footer class="footer-wrapper">
    <div class="footer-content">
      <span>Copyright MIT © {{ currentYear }}</span>
      <a href="https://github.com/xbaof/vue-elven" target="_blank" rel="noopener noreferrer" class="footer-link">
        &nbsp;xbaof
      </a>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

defineOptions({
  name: 'LayoutFooter'
})

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped lang="scss">
.footer-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 14px;
  color: rgb(107 114 128);
}

.footer-content {
  display: flex;
  align-items: center;
}

.footer-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: var(--primary-color, #409eff);
  }
}
</style>
