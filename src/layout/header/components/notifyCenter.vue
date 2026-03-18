<template>
  <n-popover trigger="click" class="pr-0 pl-0" content-class="notify-center-wrapper" :width="330">
    <template #trigger>
      <div v-bind="$attrs">
        <n-badge :value="unreadCount" :max="99" :dot="unreadCount > 0">
          <svg-icon :icon="remindIcon" />
        </n-badge>
      </div>
    </template>

    <n-tabs v-model:value="activeTabKey" justify-content="space-evenly" type="line" size="small" animated>
      <n-tab-pane
        v-for="tabItem in tabList"
        :key="tabItem.key"
        :name="tabItem.key"
        :tab="`${tabItem.label}(${tabItem.count})`"
      >
        <n-scrollbar style="max-height: 360px">
          <n-list v-if="unreadItemsByTab[tabItem.key].length > 0" class="pl-20 pr-20">
            <n-list-item v-for="noticeItem in unreadItemsByTab[tabItem.key]" :key="noticeItem.id">
              <n-thing>
                <template #header>
                  {{ noticeItem.title }}
                </template>
                <template v-if="noticeItem.tagKey" #header-extra>
                  <n-tag :type="noticeItem.tagKey" size="small">
                    {{ noticeItem.tagText }}
                  </n-tag>
                </template>
                <n-ellipsis expand-trigger="click" line-clamp="2" :tooltip="false">
                  {{ noticeItem.content }}
                </n-ellipsis>
                <template #footer>
                  {{ noticeItem.timeText }}
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
          <n-empty v-else :description="`暂无${tabItem.label}`" style="padding: 80px 0" />
        </n-scrollbar>
      </n-tab-pane>
    </n-tabs>

    <div v-if="activeUnreadCount > 0" class="notify-footer">
      <n-button text type="primary" size="small" @click="msgInfo('消息中心建设中')">查看更多</n-button>
      <n-button text size="small" :disabled="activeUnreadCount === 0" @click="markActiveTabRead">标记已读</n-button>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import remindIcon from '@iconify-icons/icon-park-outline/remind'
import { useUiFeedback } from '@/hooks/useUiFeedback'

defineOptions({
  name: 'NotifyCenter',
  inheritAttrs: false
})

const { msgInfo } = useUiFeedback()
type NoticeTabKey = 'notice' | 'message' | 'todo'
interface TabItem {
  key: NoticeTabKey
  label: string
  count: number
}

interface NoticeItem {
  id: number
  tabKey: NoticeTabKey
  title: string
  content: string
  timeText: string
  tagText?: string
  tagKey?: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
}

const tabConfig: Array<Omit<TabItem, 'count'>> = [
  { key: 'notice', label: '通知' },
  { key: 'message', label: '消息' },
  { key: 'todo', label: '待办' }
]

const createEmptyTabMap = (): Record<NoticeTabKey, NoticeItem[]> => ({
  notice: [],
  message: [],
  todo: []
})

const activeTabKey = ref<NoticeTabKey>('notice')

const noticeList = ref<NoticeItem[]>([
  {
    id: 1,
    tabKey: 'notice',
    title: '平台维护公告',
    content: '本周六 02:00-03:30 进行数据库维护，期间部分查询服务将短暂不可用',
    timeText: '2026-03-18',
    tagText: '公告',
    tagKey: 'info',
    isRead: false
  },
  {
    id: 2,
    tabKey: 'notice',
    title: '安全策略生效',
    content: '系统已开启高风险操作二次确认，涉及删除和权限变更的操作将触发弹窗校验',
    timeText: '2026-03-16',
    tagText: '安全',
    tagKey: 'success',
    isRead: true
  },
  {
    id: 3,
    tabKey: 'notice',
    title: '组件文档更新',
    content: '图标、裁剪与编辑器示例文档已同步到最新版本，请按新参数说明联调',
    timeText: '2026-03-15',
    isRead: false
  },
  {
    id: 4,
    tabKey: 'message',
    title: '审批通过通知',
    content: '你提交的发布申请已通过审核，可以进入灰度发布阶段',
    timeText: '2026-03-18',
    tagText: '通过',
    tagKey: 'success',
    isRead: false
  },
  {
    id: 5,
    tabKey: 'message',
    title: '代码评审提醒',
    content: '你有 2 条待处理的评审意见，请在今日内完成回复',
    timeText: '2026-03-18',
    tagText: '待处理',
    tagKey: 'primary',
    isRead: false
  },
  {
    id: 6,
    tabKey: 'message',
    title: '登录安全提醒',
    content: '检测到账号在新设备登录，若非本人操作请立即修改密码',
    timeText: '2026-03-17',
    tagText: '风险',
    tagKey: 'error',
    isRead: false
  },
  {
    id: 7,
    tabKey: 'message',
    title: '反馈回复通知',
    content: '你提交的 UI 建议已被采纳，相关改动将在下一版本上线',
    timeText: '2026-03-16',
    isRead: false
  },
  {
    id: 8,
    tabKey: 'todo',
    title: '权限配置复核',
    content: '请在 03-19 12:00 前完成新角色权限点复核并提交结果',
    timeText: '2026-03-18',
    tagText: '高优先',
    tagKey: 'error',
    isRead: false
  },
  {
    id: 9,
    tabKey: 'todo',
    title: '发布包验收',
    content: '测试环境 v2.4.1 验收未完成，请补齐回归报告后再提发布',
    timeText: '2026-03-18',
    tagText: '处理中',
    tagKey: 'primary',
    isRead: false
  },
  {
    id: 10,
    tabKey: 'todo',
    title: '接口文档补全',
    content: '订单模块新增字段已上线，请在文档中心补全字段说明与示例请求',
    timeText: '2026-03-17',
    tagText: '进行中',
    tagKey: 'warning',
    isRead: false
  },
  {
    id: 11,
    tabKey: 'todo',
    title: '异常监控巡检',
    content: '今日错误日志峰值异常，请在 18:00 前完成原因排查并记录结论',
    timeText: '2026-03-17',
    tagText: '待排查',
    tagKey: 'warning',
    isRead: false
  },
  {
    id: 12,
    tabKey: 'todo',
    title: '演示环境准备',
    content: '客户演示环境资源未分配，请在周会前完成环境初始化',
    timeText: '2026-03-15',
    tagText: '未开始',
    tagKey: 'info',
    isRead: true
  }
])

const unreadItemsByTab = computed<Record<NoticeTabKey, NoticeItem[]>>(() => {
  return noticeList.value.reduce((resultMap, noticeItem) => {
    if (!noticeItem.isRead) {
      resultMap[noticeItem.tabKey].push(noticeItem)
    }
    return resultMap
  }, createEmptyTabMap())
})

const unreadCount = computed(() => {
  return (
    unreadItemsByTab.value.notice.length + unreadItemsByTab.value.message.length + unreadItemsByTab.value.todo.length
  )
})

const activeUnreadCount = computed(() => {
  return unreadItemsByTab.value[activeTabKey.value].length
})

const tabList = computed<TabItem[]>(() => {
  return tabConfig.map((tabItem) => ({
    ...tabItem,
    count: unreadItemsByTab.value[tabItem.key].length
  }))
})

const markActiveTabRead = (): void => {
  noticeList.value.forEach((noticeItem) => {
    if (noticeItem.tabKey === activeTabKey.value) {
      noticeItem.isRead = true
    }
  })
}
</script>

<style lang="scss">
.notify-center-wrapper {
  .n-thing .n-thing-main .n-thing-header .n-thing-header__title {
    font-size: 14px;
  }

  .n-thing .n-thing-main .n-thing-main__content:not(:first-child),
  .n-thing .n-thing-main .n-thing-main__footer:not(:first-child) {
    margin-top: 6px;
    font-size: 12px;
  }

  .notify-footer {
    display: flex;
    justify-content: space-between;
    padding: 8px 20px 6px;
    border-top: 1px solid var(--n-divider-color);
  }
}
</style>
