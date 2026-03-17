<template>
  <n-flex vertical :size="15" class="main-content">
    <n-list bordered>
      <n-list-item>
        <n-thing title="图标选择器" description="基于 n-select 和 n-virtual-list 封装，支持 IconPark 和本地 SVG 图标" />
      </n-list-item>
      <n-list-item>
        <IconPicker v-model="val" clearable placeholder="输入关键词搜索" />
      </n-list-item>
    </n-list>

    <n-list bordered>
      <n-list-item>
        <n-thing title="IconPark 示例">
          <n-alert title="提示" type="warning"> 除菜单、图标选择器使用在线图标渲染以外，其他组件使用本地图标 </n-alert>
        </n-thing>
      </n-list-item>
      <n-list-item>
        <n-grid cols="2 s:4 m:6 l:8 xl:12" :y-gap="10" item-responsive responsive="screen">
          <n-grid-item
            v-for="demoIcon in demoIconList"
            :key="demoIcon.iconValue"
            class="itemIcon flex-center"
            @click="handleCopy(demoIcon.iconValue)"
          >
            <svg-icon :size="30" :icon="demoIcon.iconData" />
          </n-grid-item>
        </n-grid>
      </n-list-item>
    </n-list>

    <n-list bordered>
      <n-list-item>
        <n-thing title="SVG 图标示例" description="svg 文件存放在 src/assets/svg 文件夹下" />
      </n-list-item>
      <n-list-item>
        <n-grid cols="2 s:4 m:6 l:8 xl:12" item-responsive responsive="screen">
          <n-grid-item class="itemIcon flex-center" @click="handleCopy('local:vite')">
            <svg-icon :size="30" icon="local:vite" />
          </n-grid-item>
        </n-grid>
      </n-list-item>
    </n-list>

    <n-list bordered>
      <n-list-item>
        <n-thing title="组件参数说明" description="文档内容来自 docs/component-api/icon.md" />
      </n-list-item>
      <n-list-item>
        <div class="markdownDoc" v-html="docHtml" />
      </n-list-item>
    </n-list>
  </n-flex>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Icon'
})

import { defineAsyncComponent, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useUiFeedback } from '@/hooks/useUiFeedback'
import { useMarkdownDoc } from '@/hooks/useMarkdownDoc'
import iconDocRaw from '@docs/component-api/icon.md?raw'
import adProductIcon from '@iconify-icons/icon-park-outline/ad-product'
import apiAppIcon from '@iconify-icons/icon-park-outline/api-app'
import appSwitchIcon from '@iconify-icons/icon-park-outline/app-switch'
import applicationOneIcon from '@iconify-icons/icon-park-outline/application-one'
import associationIcon from '@iconify-icons/icon-park-outline/association'
import asteriskIcon from '@iconify-icons/icon-park-outline/asterisk'
import badgeIcon from '@iconify-icons/icon-park-outline/badge'
import benzIcon from '@iconify-icons/icon-park-outline/benz'
import blocksAndArrowsIcon from '@iconify-icons/icon-park-outline/blocks-and-arrows'
import categoryManagementIcon from '@iconify-icons/icon-park-outline/category-management'
import circleFiveLineIcon from '@iconify-icons/icon-park-outline/circle-five-line'
import circleFourIcon from '@iconify-icons/icon-park-outline/circle-four'
import circleFourLineIcon from '@iconify-icons/icon-park-outline/circle-four-line'
import circleThreeIcon from '@iconify-icons/icon-park-outline/circle-three'
import circleTwoLineIcon from '@iconify-icons/icon-park-outline/circle-two-line'
import circlesAndTrianglesIcon from '@iconify-icons/icon-park-outline/circles-and-triangles'
import circlesSevenIcon from '@iconify-icons/icon-park-outline/circles-seven'
import circularConnectionIcon from '@iconify-icons/icon-park-outline/circular-connection'
import coneIcon from '@iconify-icons/icon-park-outline/cone'
import conesIcon from '@iconify-icons/icon-park-outline/cones'
import convergingGatewayIcon from '@iconify-icons/icon-park-outline/converging-gateway'
import coordinateSystemIcon from '@iconify-icons/icon-park-outline/coordinate-system'
import crossRingIcon from '@iconify-icons/icon-park-outline/cross-ring'
import crossRingTwoIcon from '@iconify-icons/icon-park-outline/cross-ring-two'
import crownTwoIcon from '@iconify-icons/icon-park-outline/crown-two'
import cubeIcon from '@iconify-icons/icon-park-outline/cube'
import cubeFiveIcon from '@iconify-icons/icon-park-outline/cube-five'
import cubeFourIcon from '@iconify-icons/icon-park-outline/cube-four'
import cubeThreeIcon from '@iconify-icons/icon-park-outline/cube-three'
import cubeTwoIcon from '@iconify-icons/icon-park-outline/cube-two'
import cycleArrowIcon from '@iconify-icons/icon-park-outline/cycle-arrow'
import cycleOneIcon from '@iconify-icons/icon-park-outline/cycle-one'
import cylinderIcon from '@iconify-icons/icon-park-outline/cylinder'
import displayIcon from '@iconify-icons/icon-park-outline/display'
import endlessIcon from '@iconify-icons/icon-park-outline/endless'
import errorPromptIcon from '@iconify-icons/icon-park-outline/error-prompt'

const IconPicker = defineAsyncComponent(() => import('@/components/IconPicker/index.vue'))
const demoIconList = [
  { iconValue: 'icon-park-outline:blocks-and-arrows', iconData: blocksAndArrowsIcon },
  { iconValue: 'icon-park-outline:circle-five-line', iconData: circleFiveLineIcon },
  { iconValue: 'icon-park-outline:circle-four', iconData: circleFourIcon },
  { iconValue: 'icon-park-outline:circle-four-line', iconData: circleFourLineIcon },
  { iconValue: 'icon-park-outline:circle-three', iconData: circleThreeIcon },
  { iconValue: 'icon-park-outline:circle-two-line', iconData: circleTwoLineIcon },
  { iconValue: 'icon-park-outline:circles-and-triangles', iconData: circlesAndTrianglesIcon },
  { iconValue: 'icon-park-outline:circles-seven', iconData: circlesSevenIcon },
  { iconValue: 'icon-park-outline:circular-connection', iconData: circularConnectionIcon },
  { iconValue: 'icon-park-outline:cone', iconData: coneIcon },
  { iconValue: 'icon-park-outline:cones', iconData: conesIcon },
  { iconValue: 'icon-park-outline:cross-ring', iconData: crossRingIcon },
  { iconValue: 'icon-park-outline:cross-ring-two', iconData: crossRingTwoIcon },
  { iconValue: 'icon-park-outline:crown-two', iconData: crownTwoIcon },
  { iconValue: 'icon-park-outline:cube-five', iconData: cubeFiveIcon },
  { iconValue: 'icon-park-outline:cube-four', iconData: cubeFourIcon },
  { iconValue: 'icon-park-outline:cube-three', iconData: cubeThreeIcon },
  { iconValue: 'icon-park-outline:cube-two', iconData: cubeTwoIcon },
  { iconValue: 'icon-park-outline:cycle-one', iconData: cycleOneIcon },
  { iconValue: 'icon-park-outline:ad-product', iconData: adProductIcon },
  { iconValue: 'icon-park-outline:api-app', iconData: apiAppIcon },
  { iconValue: 'icon-park-outline:app-switch', iconData: appSwitchIcon },
  { iconValue: 'icon-park-outline:application-one', iconData: applicationOneIcon },
  { iconValue: 'icon-park-outline:association', iconData: associationIcon },
  { iconValue: 'icon-park-outline:asterisk', iconData: asteriskIcon },
  { iconValue: 'icon-park-outline:badge', iconData: badgeIcon },
  { iconValue: 'icon-park-outline:benz', iconData: benzIcon },
  { iconValue: 'icon-park-outline:category-management', iconData: categoryManagementIcon },
  { iconValue: 'icon-park-outline:converging-gateway', iconData: convergingGatewayIcon },
  { iconValue: 'icon-park-outline:coordinate-system', iconData: coordinateSystemIcon },
  { iconValue: 'icon-park-outline:cube', iconData: cubeIcon },
  { iconValue: 'icon-park-outline:cycle-arrow', iconData: cycleArrowIcon },
  { iconValue: 'icon-park-outline:cylinder', iconData: cylinderIcon },
  { iconValue: 'icon-park-outline:display', iconData: displayIcon },
  { iconValue: 'icon-park-outline:endless', iconData: endlessIcon },
  { iconValue: 'icon-park-outline:error-prompt', iconData: errorPromptIcon }
]

const { copy, isSupported } = useClipboard()
const uiFeedback = useUiFeedback()
const { docHtml } = useMarkdownDoc(iconDocRaw)

const handleCopy = async (iconValue: string): Promise<void> => {
  if (!isSupported.value) {
    uiFeedback.msgWarning('当前环境不支持剪贴板复制')
    return
  }

  const snippet = `<svg-icon :size="30" icon="${iconValue}" />`
  await copy(snippet)
  uiFeedback.msgSuccess(`复制成功：${snippet}`)
}

const val = ref<string | null>('icon-park-outline:mask')
</script>

<style scoped lang="scss">
.itemIcon {
  height: 40px;
  cursor: pointer;
}
</style>
