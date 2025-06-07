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
import { useDialog } from 'naive-ui'
import SvgIcon from '@/components/SvgIcon/index.vue'
import People from '@iconify-icons/icon-park-outline/people'
import Logout from '@iconify-icons/icon-park-outline/logout'
import { useAuthStore } from '@/store'
const auth = useAuthStore()
const dialog = useDialog()
const avatarSrc = computed(() => auth.getAvatar ?? '/src/assets/images/default_avatar.png')
const sleep = () => new Promise((resolve) => setTimeout(resolve, 150))
const options = reactive([
  {
    label: '个人资料',
    key: 'profile',
    icon: () => h(SvgIcon, { icon: People })
  },
  {
    type: 'divider',
    key: 'divider'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h(SvgIcon, { icon: Logout })
  }
])
const handleSelect = (key: string) => {
  switch (key) {
    case 'logout':
      // eslint-disable-next-line no-case-declarations
      const d = dialog.warning({
        title: '提示',
        content: '此操作将退出登录, 是否继续?',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          d.loading = true
          return new Promise((resolve) => {
            sleep().then(() => {
              auth.resetToken()
              window.location.reload()
            })
          })
        }
      })
      break
    case '1':
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
