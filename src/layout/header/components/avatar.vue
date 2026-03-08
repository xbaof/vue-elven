<template>
  <n-dropdown show-arrow :options="options" @select="handleSelect">
    <div class="avatar-wrapper mr-14">
      <n-avatar :size="38" :src="avatarSrc" />
      <svg-icon icon="local:drop-down" size="11" />
    </div>
  </n-dropdown>
</template>
<script lang="ts" setup>
import { reactive, computed, h } from 'vue'
import { useDialog, type DialogReactive } from 'naive-ui'
import { useRoute } from 'vue-router'
import peopleIcon from '@iconify-icons/icon-park-outline/people'
import logoutIcon from '@iconify-icons/icon-park-outline/logout'
import SvgIcon from '@/components/SvgIcon/index.vue'
import { useAuthStore } from '@/store/modules/auth'
import { useUserStore } from '@/store/modules/user'
import { useUiFeedback } from '@/hooks/useUiFeedback'
import { useSafeNavigation } from '@/hooks/useSafeNavigation'
import defaultAvatarUrl from '@/assets/images/default_avatar.jpeg'

defineOptions({
  name: 'HeaderAvatar'
})

const userStore = useUserStore()
const authStore = useAuthStore()
const dialog = useDialog()
const { replace } = useSafeNavigation()
const uiFeedback = useUiFeedback()
const route = useRoute()
const avatarSrc = computed(() => userStore.getAvatar ?? defaultAvatarUrl)
const sleep = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 150))

const options = reactive([
  {
    label: '个人资料',
    key: 'profile',
    icon: () => h(SvgIcon, { icon: peopleIcon })
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h(SvgIcon, { icon: logoutIcon })
  }
])

/**
 * 执行退出登录流程，失败时给出统一错误提示。
 */
const handleLogout = async (dialogRef: DialogReactive): Promise<void> => {
  dialogRef.loading = true
  try {
    await sleep()
    authStore.logOut()
    await replace({
      path: '/login',
      query: route.query
    })
    uiFeedback.msgSuccess('已退出登录')
  } catch (error) {
    uiFeedback.msgErrorFromUnknown(error, '退出登录失败，请稍后重试')
  } finally {
    dialogRef.loading = false
  }
}

const handleSelect = (key: string): void => {
  switch (key) {
    case 'logout':
      const dialogRef: DialogReactive = dialog.warning({
        title: '提示',
        content: '此操作将退出登录, 是否继续?',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => handleLogout(dialogRef)
      })
      break
    default:
      break
  }
}
</script>
<style scoped lang="scss">
.avatar-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 8px;
  cursor: pointer;

  .n-avatar {
    border-radius: 10px;
  }

  .n-icon {
    margin-top: 28px;
    margin-left: 4px;
    color: var(--header-action-color);
  }
}
</style>
