<template>
  <a :href="repositoryUrl" target="_blank" rel="noopener noreferrer" title="GitHub">
    <svg-icon :size="18" :icon="githubIcon" />
  </a>
</template>

<script setup lang="ts">
import githubIcon from '@iconify-icons/icon-park-outline/github'

defineOptions({
  name: 'GithubLink'
})

const repositoryUrl = 'https://github.com/xbaof/vue-elven'
</script>
