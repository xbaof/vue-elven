<template>
  <n-breadcrumb>
    <template v-for="item in breadcrumbs" :key="item.path">
      <n-breadcrumb-item v-if="item.label">
        <n-dropdown v-if="breadcrumb.dropdown && item.children" :options="item.children" @select="handleLink">
          <span>
            <component :is="item.icon" v-if="item.icon" />
            {{ item.label }}
          </span>
        </n-dropdown>
        <span v-else @click="handleLink(item.key, item)">
          <component :is="item.icon" v-if="item.icon" />
          {{ item.label }}
        </span>
      </n-breadcrumb-item>
    </template>
  </n-breadcrumb>
</template>
<script lang="ts" setup>
import { computed, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { openLink } from '@/utils'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useAppStore } from '@/store'
import { storeToRefs } from 'pinia'
const app = useAppStore()
const { breadcrumb } = storeToRefs(app)

const route = useRoute()
const router = useRouter()

const generator = (routerMaps) => {
  return routerMaps.map((o) => {
    const item = {
      key: o.path,
      redirect: o.redirect,
      label: o.meta.title,
      icon:
        o.meta?.icon && breadcrumb.value.showIcon ? () => h(SvgIcon, { icon: o.meta?.icon as string, size: 16 }) : null,
      isLink: o.meta?.isLink,
      linkUrl: o.meta?.linkUrl,
      children: undefined
    }

    if (o.children && o.children.length > 0) {
      item.children = generator(o.children)
    }
    return item
  })
}

const breadcrumbs = computed(() => {
  const matcheds = route.matched.filter((o) => o.meta && o.meta.title && !o.meta.noTagsView)
  return generator(matcheds)
})
const handleLink = (_key, option) => {
  if (option?.isLink) {
    openLink(option?.linkUrl as string)
  } else {
    const { redirect, key: path } = option
    if (redirect) {
      router.push(redirect)
    } else {
      router.push(path)
    }
  }
}
</script>
