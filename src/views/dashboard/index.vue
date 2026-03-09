<template>
  <n-flex vertical :size="15" class="main-content dashboardPage">
    <n-card :bordered="false" class="heroCard">
      <n-flex justify="space-between" align="center" wrap>
        <n-flex vertical :size="8">
          <n-text class="heroTitle">{{ welcomeText }}</n-text>
          <n-text depth="3">当前时间：{{ currentTimeText }}</n-text>
          <n-flex :size="8" wrap>
            <n-tag size="small" type="success">布局：{{ appStore.layout }}</n-tag>
            <n-tag size="small" type="info">设备：{{ appStore.device }}</n-tag>
            <n-tag size="small" :type="appStore.isDark ? 'warning' : 'default'">
              主题：{{ appStore.isDark ? '深色' : '浅色' }}
            </n-tag>
          </n-flex>
          <n-button
            class="githubEntryButton"
            tag="a"
            :href="repositoryUrl"
            target="_blank"
            rel="noopener noreferrer"
            type="primary"
            strong
          >
            <template #icon>
              <svg-icon :icon="githubIcon" />
            </template>
            查看 GitHub 仓库
          </n-button>
        </n-flex>
        <n-avatar round :size="56" :src="avatarSrc" />
      </n-flex>
    </n-card>

    <n-grid :cols="4" :x-gap="12" :y-gap="12" item-responsive responsive="screen">
      <n-grid-item v-for="statItem in statList" :key="statItem.label" span="2 s:2 m:1">
        <n-card size="small" hoverable>
          <n-statistic :label="statItem.label" :value="statItem.value" />
        </n-card>
      </n-grid-item>
    </n-grid>

    <n-grid :cols="2" :x-gap="12" :y-gap="12" item-responsive responsive="screen">
      <n-grid-item span="2 m:1">
        <n-card title="快捷入口" class="h-full">
          <n-flex wrap :size="10">
            <n-button v-for="entryItem in quickEntryList" :key="entryItem.path" @click="push(entryItem.path)">
              {{ entryItem.label }}
            </n-button>
          </n-flex>
        </n-card>
      </n-grid-item>

      <n-grid-item span="2 m:1">
        <n-card title="系统状态">
          <n-descriptions bordered :column="1" size="small" label-placement="left">
            <n-descriptions-item label="当前路由">{{ route.fullPath }}</n-descriptions-item>
            <n-descriptions-item label="已登录用户">{{ userDisplayName }}</n-descriptions-item>
            <n-descriptions-item label="角色数量">{{ permissionStore.roles.length }}</n-descriptions-item>
            <n-descriptions-item label="权限点数量">{{ permissionStore.perms.length }}</n-descriptions-item>
          </n-descriptions>
        </n-card>
      </n-grid-item>
    </n-grid>

    <n-card title="最近标签页">
      <n-table striped :single-line="false" size="small">
        <thead>
          <tr>
            <th>标题</th>
            <th>路径</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tagItem, tagIndex) in recentTagList" :key="`${tagItem.path}-${tagIndex}`">
            <td>{{ tagItem.title || '-' }}</td>
            <td>{{ tagItem.path }}</td>
            <td>
              <n-flex :size="6" wrap>
                <n-tag v-if="tagItem.meta?.isAffix" type="success" size="small">固定</n-tag>
                <n-tag v-if="cachedViews.includes(tagItem.name)" type="info" size="small">缓存</n-tag>
              </n-flex>
            </td>
            <td>
              <n-flex :size="6" wrap>
                <n-button size="tiny" @click="openTag(tagItem)">打开</n-button>
                <n-button v-if="!tagItem.meta?.isAffix" size="tiny" type="error" @click="closeCurrentTag(tagItem)">
                  关闭
                </n-button>
              </n-flex>
            </td>
          </tr>
          <tr v-if="recentTagList.length === 0">
            <td colspan="4" class="emptyRow">暂无标签页记录</td>
          </tr>
        </tbody>
      </n-table>
    </n-card>
  </n-flex>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useSafeNavigation } from '@/hooks/useSafeNavigation'
import { useTagsActions } from '@/hooks/useTagsActions'
import githubIcon from '@iconify-icons/icon-park-outline/github'
import defaultAvatarUrl from '@/assets/images/default_avatar.jpeg'

defineOptions({
  name: 'Dashboard'
})

const route = useRoute()
const { push } = useSafeNavigation()
const { openTag, closeCurrentTag } = useTagsActions()

const appStore = useAppStore()
const userStore = useUserStore()
const permissionStore = usePermissionStore()
const tagsViewStore = useTagsViewStore()

const { visitedViews, cachedViews } = storeToRefs(tagsViewStore)

const currentTimeText = computed(() => {
  return new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})

const userDisplayName = computed(() => {
  return userStore.getNickName || userStore.getName || '未命名用户'
})

const avatarSrc = computed(() => userStore.getAvatar ?? defaultAvatarUrl)

const welcomeText = computed(() => {
  return `欢迎回来，${userDisplayName.value}`
})

const repositoryUrl = 'https://github.com/xbaof/vue-elven'

const statList = computed(() => {
  return [
    {
      label: '动态路由数',
      value: permissionStore.routes.length
    },
    {
      label: '权限点数',
      value: permissionStore.perms.length
    },
    {
      label: '已打开标签',
      value: visitedViews.value.length
    },
    {
      label: '缓存标签',
      value: cachedViews.value.length
    }
  ]
})

const quickEntryList = [
  {
    label: '测试页（固定标签）',
    path: '/test'
  },
  {
    label: '菜单占位页',
    path: '/menu/menu1/menu11'
  },
  {
    label: '指令示例',
    path: '/fun/directive'
  },
  {
    label: '富文本占位页',
    path: '/fun/richTextEditor'
  },
  {
    label: '外链示例',
    path: '/baidu'
  },
  {
    label: '内嵌示例页',
    path: '/vitejs'
  },
  {
    label: '图标展示页',
    path: '/icon'
  },
  {
    label: '标签页操作页',
    path: '/tags'
  },
  {
    label: '图片裁剪页',
    path: '/cropperDemo'
  }
]

const recentTagList = computed(() => {
  return visitedViews.value.slice(-8).reverse()
})
</script>

<style scoped lang="scss">
.dashboardPage {
  .heroCard {
    .heroTitle {
      font-size: 22px;
      font-weight: 600;
      line-height: 1.2;
    }

    .githubEntryButton {
      width: fit-content;
    }
  }
}

.emptyRow {
  color: var(--text-color-3);
  text-align: center;
}
</style>
