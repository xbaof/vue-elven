<template>
  <n-select
    ref="selectRef"
    v-model:value="selectedIcon"
    filterable
    placeholder="选择图标"
    :options="[]"
    :on-update:show="onUpdateShow"
    :on-search="onSearch"
    :render-tag="renderSelectTag"
    :menu-props="{ class: 'icon-picker_menu' }"
  >
    <template #empty>
      <n-tabs ref="tabsRef" v-model:value="currentActive" type="line" animated @update:value="handleUpdateValue">
        <n-tab-pane v-for="(pane, paneIndex) in tabsData" :key="paneIndex" :name="pane.name" :tab="pane.tab">
          <n-virtual-list
            v-if="iconData[pane.name].virtualIcons && iconData[pane.name].virtualIcons.length > 0"
            :ref="'dynamicList' + pane.name"
            :style="{ 'max-height': `calc(var(--n-height) - ${tabsNavHeight}px - 0.75rem)` }"
            :item-size="iconSelectSize + 8"
            :items="iconData[pane.name].virtualIcons"
          >
            <template #default="{ item }">
              <div :key="item.key" class="list-row">
                <div
                  v-for="(icon, iconIndex) in item.icons"
                  :key="iconIndex"
                  class="icon-item"
                  :class="{ 'is-selected': `${iconData[pane.name].prefix}:${icon}` === selectedIcon }"
                  :style="{ width: `${iconSelectSize}px`, height: `${iconSelectSize}px` }"
                  @click="handleIconClick(`${iconData[pane.name].prefix}:${icon}`)"
                >
                  <svg-icon :icon="`${iconData[pane.name].prefix}:${icon}`" :size="iconSize" />
                </div>
              </div>
            </template>
          </n-virtual-list>

          <n-empty v-else />
        </n-tab-pane>
      </n-tabs>
    </template>
  </n-select>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'IconPicker'
})
import { h, reactive, ref, computed, onMounted, nextTick, getCurrentInstance } from 'vue'
import type { VirtualListInst, SelectRenderTag } from 'naive-ui'
import { useResizeObserver, useSessionStorage, useDebounceFn } from '@vueuse/core'
import { ICON_PARK_OUTLINE_KEY } from '@/enums/cacheEnum'
import SvgIcon from '../SvgIcon/index.vue'

const props = defineProps({
  modelValue: {
    type: String,
    require: false,
    default: ''
  },
  iconSize: {
    type: Number,
    default: 20
  }
})
interface virtualDataRow {
  key: number
  icons: string[]
}

// modelValue
const emit = defineEmits(['update:modelValue'])
const selectedIcon = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
const renderSelectTag: SelectRenderTag = ({ option }) => {
  return h(
    'div',
    {
      class: 'flx-align-center'
    },
    [
      h(SvgIcon, {
        icon: option.value as string,
        size: 24
      }),
      h('span', { class: 'pl5' }, [option.label as string])
    ]
  )
}
const handleUpdateValue = (value: string) => {
  if (selectedIcon.value.startsWith(iconData[value].prefix)) {
    nextTick(() => {
      if (!instance.refs['dynamicList' + currentActive.value]) return
      const virtualListInst: VirtualListInst = instance.refs['dynamicList' + currentActive.value][0]
      virtualListInst?.scrollTo({ key: selectedIconKey.value })
    })
  }
}
const handleSearch = (value: string) => {
  Object.keys(iconData).forEach((key) => {
    const filterIcons = iconData[key].icons.filter(
      (i) => !!(1 + i.toString().toLowerCase().indexOf(value.trim().toLowerCase()))
    )
    iconData[key].virtualIcons = groupArray(filterIcons, rowMaxIcon.value)
  })
}
const onSearch = useDebounceFn(handleSearch, 300)
const onUpdateShow = (show: boolean) => {
  if (!show) {
    setTimeout(() => {
      initCurrentActive()
      Object.keys(iconData).forEach((key) => {
        iconData[key].virtualIcons = groupArray(iconData[key].icons, rowMaxIcon.value)
        nextTick(() => {
          if (!instance.refs['dynamicList' + currentActive.value]) return
          const virtualListInst: VirtualListInst = instance.refs['dynamicList' + currentActive.value][0]
          virtualListInst?.scrollTo({ key: selectedIconKey.value })
        })
      })
    }, 300)
  }
}

const handleIconClick = (value: string) => {
  selectedIcon.value = value
  selectRef.value?.handleMenuTabOut?.()
}
const drawVirtualIcons = () => {
  if (tabsNavHeight.value <= 0) {
    tabsNavHeight.value = tabsRef.value?.scrollWrapperElRef?.offsetHeight || 0
  }
  const width = tabsRef.value?.tabsPaneWrapperRef?.offsetWidth
  if (width && virtualListWidth.value !== width) {
    virtualListWidth.value = width
    Object.keys(iconData).forEach((key) => {
      iconData[key].virtualIcons = groupArray(iconData[key].icons, rowMaxIcon.value)
    })
    nextTick(() => {
      if (!instance.refs['dynamicList' + currentActive.value]) return
      const virtualListInst: VirtualListInst = instance.refs['dynamicList' + currentActive.value][0]
      virtualListInst?.scrollTo({ key: selectedIconKey.value })
    })
  }
}
const groupArray = (arr: string[], groupLength: number): virtualDataRow[] => {
  const result: virtualDataRow[] = []
  for (let i = 0; i < arr.length; i += groupLength) {
    result[result.length] = { icons: arr.slice(i, i + groupLength), key: result.length }
  }
  return result
}
const modules = computed(() => {
  return import.meta.glob('@/assets/svg/*.svg', {
    query: '?component'
  })
})
// 获取icon-park-outline图标库信息
const getParkIconOutlineData = async (): Promise<typeof iconData.IconParkOutline> => {
  const icons = useSessionStorage(ICON_PARK_OUTLINE_KEY, {})
  if (Object.keys(icons.value).length === 0) {
    const result = await fetch(`https://api.iconify.design/collection?prefix=icon-park-outline`).then((res) =>
      res.json()
    )
    icons.value = {
      prefix: result.prefix,
      title: result.title,
      icons: Object.values(result.categories).flat(Infinity) as string[]
    }
  }
  return icons.value
}
const initCurrentActive = () => {
  const iconDataKeys: Array<keyof typeof iconData> = Object.keys(iconData) as Array<keyof typeof iconData>
  if (props.modelValue) {
    currentActive.value = iconDataKeys.find((o) => props.modelValue.startsWith(iconData[o].prefix))
  } else if (!currentActive.value) {
    currentActive.value = iconDataKeys.length > 0 ? iconDataKeys[0] : null
  }
}

const iconData = reactive<{
  IconParkOutline: {
    prefix?: string
    title?: string
    icons?: string[]
    virtualIcons?: virtualDataRow[]
  }
  localSvg: {
    prefix: string
    title: string
    icons: string[]
    virtualIcons?: virtualDataRow[]
  }
}>({
  IconParkOutline: {},
  localSvg: {
    prefix: 'local',
    title: 'local Svg',
    icons: Object.keys(modules.value).map((o) => {
      const fileName = o.split('/').pop()
      return fileName.substring(0, fileName.lastIndexOf('.svg'))
    })
  }
})
const instance = getCurrentInstance()
// select
const selectRef = ref(null)
// tab
const tabsRef = ref(null)
// tab的有效高度
const tabsNavHeight = ref<number>(0)
// 虚拟列表的有效宽度
const virtualListWidth = ref<number>(0)
// 默认激活的Tab
const currentActive = ref<keyof typeof iconData>()
// tabs数据源
const tabsData = computed(() => {
  return Object.keys(iconData).map((o) => {
    return {
      tab: iconData[o].title,
      name: o
    }
  })
})
const iconSelectSize = computed(() => {
  return props.iconSize + 16
})
const rowMaxIcon = computed(() => {
  return Math.floor(virtualListWidth.value / (iconSelectSize.value + 8))
})
// 所选图标在列表中的key
const selectedIconKey = computed(() => {
  if (!selectedIcon.value) return 0
  const prefix = iconData[currentActive.value].prefix
  const data = iconData[currentActive.value].virtualIcons.find((o) =>
    o.icons.includes(selectedIcon.value.replace(`${prefix}:`, ''))
  )
  return data?.key || 0
})

onMounted(async () => {
  iconData.IconParkOutline = await getParkIconOutlineData()
  initCurrentActive()
  drawVirtualIcons()
  useResizeObserver(
    tabsRef,
    useDebounceFn(() => {
      drawVirtualIcons()
    }, 200)
  )
})
</script>

<style scoped lang="scss">
:deep(.n-tabs-tab) {
  padding: 0.25rem 0;
}
</style>

<style lang="scss">
.icon-picker_menu {
  .n-base-select-menu__empty {
    max-height: var(--n-height);
    padding: 0.25rem 1rem;

    .n-tabs-pane-wrapper {
      transition: none;

      .n-tab-pane {
        padding: 0.25rem 0;
      }
    }

    .list-row {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0.25rem 0;

      .icon-item {
        padding: 0.5em;
        margin-right: 8px;
        line-height: initial;
        color: var(--n-option-text-color);
        cursor: pointer;
        border: 1px solid rgb(229 231 235);
        transition: all 0.3s;

        &:hover {
          background-color: var(--n-option-color-pending);
        }

        &.is-selected {
          color: var(--n-option-text-color-active);
          background-color: transparent;
          border-color: var(--n-option-text-color-active);
        }
      }
    }
  }
}
</style>
