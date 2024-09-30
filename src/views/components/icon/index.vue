<template>
  <n-space vertical :size="15" class="main-content">
    <n-card size="small" :segmented="{ content: true }">
      <template #header>
        <p>图标选择器</p>
        <span class="describe"> 基于 n-select 和 n-virtual-list 封装，支持 IconPark 和本地 SVG 图标 </span>
      </template>
      <IconPicker v-model="val" clearable placeholder="输入关键词搜索" />
    </n-card>
    <n-card title="" size="small" :segmented="{ content: true }">
      <template #header>
        <p>IconPark 示例</p>
        <n-alert title="提示" type="warning"> 除菜单、图标选择器使用在线图标渲染以外，其他组件使用本地图标 </n-alert>
      </template>
      <n-grid cols="2 s:4 m:6 l:8 xl:12" item-responsive responsive="screen">
        <n-grid-item class="item-icon" @click="handleCopy('AdProduct')">
          <svg-icon :size="30" :icon="AdProduct" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('ApiApp')">
          <svg-icon :size="30" :icon="ApiApp" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('AppSwitch')">
          <svg-icon :size="30" :icon="AppSwitch" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('ApplicationOne')">
          <svg-icon :size="30" :icon="ApplicationOne" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('Association')">
          <svg-icon :size="30" :icon="Association" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('Asterisk')">
          <svg-icon :size="30" :icon="Asterisk" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('Badge')">
          <svg-icon :size="30" :icon="Badge" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('Benz')"> <svg-icon :size="30" :icon="Benz" /> </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('BlocksAndArrows')">
          <svg-icon :size="30" :icon="BlocksAndArrows" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CategoryManagement')">
          <svg-icon :size="30" :icon="CategoryManagement" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CircleFiveLine')">
          <svg-icon :size="30" :icon="CircleFiveLine" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CircleFour')">
          <svg-icon :size="30" :icon="CircleFour" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CircleFourLine')">
          <svg-icon :size="30" :icon="CircleFourLine" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CircleThree')">
          <svg-icon :size="30" :icon="CircleThree" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CircleTwoLine')">
          <svg-icon :size="30" :icon="CircleTwoLine" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CirclesAndTriangles')">
          <svg-icon :size="30" :icon="CirclesAndTriangles" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CirclesSeven')">
          <svg-icon :size="30" :icon="CirclesSeven" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CircularConnection')">
          <svg-icon :size="30" :icon="CircularConnection" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('Cone')"> <svg-icon :size="30" :icon="Cone" /> </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('Cones')">
          <svg-icon :size="30" :icon="Cones" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('ConvergingGateway')">
          <svg-icon :size="30" :icon="ConvergingGateway" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CoordinateSystem')">
          <svg-icon :size="30" :icon="CoordinateSystem" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CrossRing')">
          <svg-icon :size="30" :icon="CrossRing" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CrossRingTwo')">
          <svg-icon :size="30" :icon="CrossRingTwo" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CrownTwo')">
          <svg-icon :size="30" :icon="CrownTwo" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('Cube')"> <svg-icon :size="30" :icon="Cube" /> </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CubeFive')">
          <svg-icon :size="30" :icon="CubeFive" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CubeFour')">
          <svg-icon :size="30" :icon="CubeFour" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CubeThree')">
          <svg-icon :size="30" :icon="CubeThree" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CubeTwo')">
          <svg-icon :size="30" :icon="CubeTwo" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CycleArrow')">
          <svg-icon :size="30" :icon="CycleArrow" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('CycleOne')">
          <svg-icon :size="30" :icon="CycleOne" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('Cylinder')">
          <svg-icon :size="30" :icon="Cylinder" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('Display')">
          <svg-icon :size="30" :icon="Display" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('Dndless')">
          <svg-icon :size="30" :icon="Dndless" />
        </n-grid-item>
        <n-grid-item class="item-icon" @click="handleCopy('DrrorPrompt')">
          <svg-icon :size="30" :icon="DrrorPrompt" />
        </n-grid-item>
      </n-grid>
    </n-card>
    <n-card title="" size="small" :segmented="{ content: true }">
      <template #header>
        <p>SVG 图标示例</p>
        <span class="describe"> svg文件存放在src/assets/svg文件夹下</span>
      </template>
      <n-grid cols="2 s:4 m:6 l:8 xl:12" item-responsive responsive="screen">
        <n-grid-item class="item-icon" @click="handleCopy('local:vite')">
          <svg-icon :size="30" icon="local:vite" />
        </n-grid-item>
      </n-grid>
    </n-card>
  </n-space>
</template>
<script lang="ts" setup>
import AdProduct from '@iconify-icons/icon-park-outline/ad-product'
import ApiApp from '@iconify-icons/icon-park-outline/api-app'
import AppSwitch from '@iconify-icons/icon-park-outline/app-switch'
import ApplicationOne from '@iconify-icons/icon-park-outline/application-one'
import Association from '@iconify-icons/icon-park-outline/association'
import Asterisk from '@iconify-icons/icon-park-outline/asterisk'
import Badge from '@iconify-icons/icon-park-outline/badge'
import Benz from '@iconify-icons/icon-park-outline/benz'
import BlocksAndArrows from '@iconify-icons/icon-park-outline/blocks-and-arrows'
import CategoryManagement from '@iconify-icons/icon-park-outline/category-management'
import CircleFiveLine from '@iconify-icons/icon-park-outline/circle-five-line'
import CircleFour from '@iconify-icons/icon-park-outline/circle-four'
import CircleFourLine from '@iconify-icons/icon-park-outline/circle-four-line'
import CircleThree from '@iconify-icons/icon-park-outline/circle-three'
import CircleTwoLine from '@iconify-icons/icon-park-outline/circle-two-line'
import CirclesAndTriangles from '@iconify-icons/icon-park-outline/circles-and-triangles'
import CirclesSeven from '@iconify-icons/icon-park-outline/circles-seven'
import CircularConnection from '@iconify-icons/icon-park-outline/circular-connection'
import Cone from '@iconify-icons/icon-park-outline/cone'
import Cones from '@iconify-icons/icon-park-outline/cones'
import ConvergingGateway from '@iconify-icons/icon-park-outline/converging-gateway'
import CoordinateSystem from '@iconify-icons/icon-park-outline/coordinate-system'
import CrossRing from '@iconify-icons/icon-park-outline/cross-ring'
import CrossRingTwo from '@iconify-icons/icon-park-outline/cross-ring-two'
import CrownTwo from '@iconify-icons/icon-park-outline/crown-two'
import Cube from '@iconify-icons/icon-park-outline/cube'
import CubeFive from '@iconify-icons/icon-park-outline/cube-five'
import CubeFour from '@iconify-icons/icon-park-outline/cube-four'
import CubeThree from '@iconify-icons/icon-park-outline/cube-three'
import CubeTwo from '@iconify-icons/icon-park-outline/cube-two'
import CycleArrow from '@iconify-icons/icon-park-outline/cycle-arrow'
import CycleOne from '@iconify-icons/icon-park-outline/cycle-one'
import Cylinder from '@iconify-icons/icon-park-outline/cylinder'
import Display from '@iconify-icons/icon-park-outline/display'
import Dndless from '@iconify-icons/icon-park-outline/endless'
import DrrorPrompt from '@iconify-icons/icon-park-outline/error-prompt'
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import IconPicker from '@/components/IconPicker/index.vue'

const message = useMessage()
const { copy, isSupported } = useClipboard()
const handleCopy = async (icon: string) => {
  if (isSupported.value) {
    const text = `<svg-icon :size="30" :icon="${icon}" />`
    await copy(text)
    message.success(`复制成功：${text}`)
  }
}
const val = ref(null)
</script>
<style scoped>
.describe {
  font-size: 14px;
  color: var(--text-color-2);
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  cursor: pointer;
}
</style>
