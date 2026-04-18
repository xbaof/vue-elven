<template>
  <n-breadcrumb>
    <template v-for="item in breadcrumbs" :key="item.key">
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
import { useRoute, type RouteRecordNormalized } from 'vue-router'
import type { MenuOption } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { getTagViewTitle, toTagView } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useMenuNavigate } from '@/hooks/useMenuNavigate'

defineOptions({
  name: 'Breadcrumb'
})

const app = useAppStore()
const route = useRoute()
const { navigateByMenuOption } = useMenuNavigate()
const { breadcrumb } = storeToRefs(app)

interface BreadcrumbItem {
  key: string
  redirect?: string | RouteRecordNormalized
  label: string
  icon: (() => ReturnType<typeof h>) | null
  isLink?: boolean
  linkUrl?: string
  query?: AnyObject
  children?: BreadcrumbItem[]
}

/**
 * 根据匹配到的路由记录生成面包屑树。
 */
const generator = (routerMaps: RouteRecordNormalized[]): BreadcrumbItem[] => {
  return routerMaps.map((o) => {
    const item: BreadcrumbItem = {
      key: o.path,
      redirect: o.redirect as string | RouteRecordNormalized | undefined,
      label: o.meta?.title || '',
      icon:
        o.meta?.icon && breadcrumb.value.showIcon ? () => h(SvgIcon, { icon: o.meta?.icon as string, size: 16 }) : null,
      isLink: o.meta?.isLink,
      linkUrl: o.meta?.linkUrl,
      query: o.meta?.query,
      children: undefined
    }

    if (o.children && o.children.length > 0) {
      const visibleChildren = o.children.filter((c) => !c.meta?.isHidden)
      if (visibleChildren.length > 0) {
        item.children = generator(visibleChildren as RouteRecordNormalized[])
      }
    }
    return item
  })
}

/**
 * 当前路由对应的面包屑列表。
 */
const breadcrumbs = computed(() => {
  const matcheds = route.matched.filter((o) => o.meta?.title)
  const breadcrumbList = generator(matcheds)
  const lastItem = breadcrumbList.at(-1)
  if (lastItem) {
    lastItem.label = getTagViewTitle(toTagView(route))
  }
  return breadcrumbList
})

/**
 * 处理面包屑点击跳转。
 */
const handleLink = (_key: string, option: BreadcrumbItem) => {
  const targetPath = typeof option.redirect === 'string' ? option.redirect : option.key
  void navigateByMenuOption(option as MenuOption, targetPath)
}
</script>
