<template>
  <div @click="show = true">
    <svg-icon :icon="Theme" />
    <n-drawer v-model:show="show" :width="310">
      <n-drawer-content title="系统配置" closable>
        <n-divider> 导航栏模式 </n-divider>
        <div class="layout-model" :class="{ inverted: sidebar.inverted }">
          <n-tooltip trigger="hover" placement="bottom">
            <template #trigger>
              <div class="item vertical" :class="{ isSelect: layout === 'vertical' }" @click="layout = 'vertical'" />
            </template>
            左侧模式
          </n-tooltip>
          <n-tooltip trigger="hover" placement="bottom">
            <template #trigger>
              <div
                class="item horizontal"
                :class="{ isSelect: layout === 'horizontal' }"
                @click="layout = 'horizontal'"
              />
            </template>
            顶部模式
          </n-tooltip>
          <n-tooltip trigger="hover" placement="bottom">
            <template #trigger>
              <div class="item mix" :class="{ isSelect: layout === 'mix' }" @click="layout = 'mix'" />
            </template>
            混合模式
          </n-tooltip>
        </div>
        <n-divider> 自定义主题颜色 </n-divider>
        <div class="configuration">
          <div class="item">
            <span>主题色</span>
            <n-color-picker
              v-model:value="overrideColor.primary"
              :show-alpha="false"
              :swatches="swatches"
              size="small"
              class="w-45"
            />
          </div>
          <div class="item">
            <span>信息色</span>
            <n-color-picker
              v-model:value="overrideColor.info"
              :show-alpha="false"
              :swatches="swatches"
              size="small"
              class="w-45"
            />
          </div>
          <div class="item">
            <span>成功色</span>
            <n-color-picker
              v-model:value="overrideColor.success"
              :show-alpha="false"
              :swatches="swatches"
              size="small"
              class="w-45"
            />
          </div>
          <div class="item">
            <span>警告色</span>
            <n-color-picker
              v-model:value="overrideColor.warning"
              :show-alpha="false"
              :swatches="swatches"
              size="small"
              class="w-45"
            />
          </div>
          <div class="item">
            <span>错误色</span>
            <n-color-picker
              v-model:value="overrideColor.error"
              :show-alpha="false"
              :swatches="swatches"
              size="small"
              class="w-45"
            />
          </div>
        </div>
        <n-divider> 界面显示 </n-divider>
        <div class="configuration">
          <div class="item">
            <span>侧边栏宽度</span>
            <n-input-number v-model:value="sidebar.sidebarWidth" size="small" class="w-45" />
          </div>
          <div class="item">
            <span>深色侧边栏</span>
            <n-switch v-model:value="sidebar.inverted" />
          </div>
          <div class="item">
            <span>展开侧边栏</span>
            <n-switch v-model:value="sidebar.opened" />
          </div>
          <div class="item">
            <span>菜单手风琴</span>
            <n-switch v-model:value="sidebar.accordion" />
          </div>
          <div class="item">
            <span>显示标签页</span>
            <n-switch v-model:value="showTagsView" />
          </div>
          <div class="item">
            <span>显示底部</span>
            <n-switch v-model:value="showFooter" />
          </div>
          <div class="item">
            <span>显示 Logo</span>
            <n-switch v-model:value="sidebar.showLogo" />
          </div>
          <div class="item">
            <span>启用面包屑下拉菜单</span>
            <n-switch v-model:value="breadcrumb.dropdown" />
          </div>
          <div class="item">
            <span>显示面包屑图标</span>
            <n-switch v-model:value="breadcrumb.showIcon" />
          </div>
          <div class="item">
            <span>显示水印</span>
            <n-switch v-model:value="watermark.show" />
          </div>
          <div class="item">
            <span>水印内容</span>
            <n-input v-model:value="watermark.content" size="small" class="w-45" />
          </div>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store'
import Theme from '@iconify-icons/icon-park-outline/theme'

const app = useAppStore()
const { layout, sidebar, breadcrumb, showTagsView, showFooter, overrideColor, watermark } = storeToRefs(app)

const show = ref(false)
const swatches = [
  '#f56c6c',
  '#F77234',
  '#FF7D00',
  '#e6a23c',
  '#FADC19',
  '#9FDB1D',
  '#67C23A',
  '#00B42A',
  '#14C9C9',
  '#3491FA',
  '#409eff',
  '#165DFF',
  '#722ED1',
  '#D91AD9',
  '#F5319D',
  '#909399'
]
</script>

<style lang="scss">
.isSelect {
  outline: 2px solid var(--primary-color);
}

.dark-mode {
  margin: 0 auto;
}

.layout-model {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 40px;

  &.inverted {
    .item {
      &::before {
        background-color: #273352 !important;
      }
    }
  }

  .item {
    position: relative;
    width: 50px;
    height: 42px;
    margin: 0 auto;
    cursor: pointer;
    background: #f0f2f5;
    border-radius: 4px;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);

    &.vertical {
      &::before {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 33%;
        height: 100%;
        content: '';
        background-color: #ffffff;
        border-radius: 4px 0 0 4px;
        box-shadow: 1px 0 4px rgb(0 21 41 / 8%);
      }

      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 25%;
        content: '';
        background-color: #ffffff;
        border-radius: 4px 4px 0;
        box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
      }
    }

    &.horizontal {
      &::before {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 33%;
        content: '';
        background-color: #ffffff;
        border-radius: 4px 4px 0 0;
        box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
      }
    }

    &.mix {
      &::before {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 33%;
        height: 100%;
        content: '';
        background-color: #ffffff;
        border-radius: 4px 0 0 4px;
        box-shadow: 1px 0 4px rgb(0 21 41 / 8%);
      }

      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 25%;
        content: '';
        background-color: #ffffff;
        border-radius: 4px 4px 0;
        box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
      }
    }
  }
}

.configuration {
  align-items: center;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
  }
}
</style>
