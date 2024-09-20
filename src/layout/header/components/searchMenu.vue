<template>
  <div @click="showModal = true">
    <svg-icon :icon="Search" />
    <n-modal
      v-model:show="showModal"
      preset="card"
      :closable="false"
      transform-origin="center"
      :class="{ isMobile: app.device === 'mobile' }"
      class="search"
      @after-leave="handleAfterLeave"
    >
      <div class="flex">
        <n-input
          v-model:value="searchMenuLabel"
          type="text"
          placeholder="请输入关键词搜索"
          class="search-input"
          clearable
          @input="onSearch"
        >
          <template #prefix>
            <svg-icon :icon="Search" />
          </template>
        </n-input>
        <n-button v-if="app.device === 'mobile'" class="ml-10" text type="primary" @click="showModal = false">
          取消
        </n-button>
      </div>
      <div ref="scrollbarRef" class="search-list">
        <ul v-if="searchResult.length > 0" ref="ulRef">
          <li
            v-for="(item, index) in searchResult"
            :key="index"
            :ref="'li' + index"
            :class="{ active: activeIndex == index, 'mt-8': index > 0 }"
            :data-index="index"
            @mouseenter="handleMouseenter"
            @click="handleClick(item)"
          >
            <component :is="item.icon" v-if="item.icon" class="list-item-icon" />
            <span class="list-item-text">{{ item.label }}</span>
            <svg class="list-item-enter" width="20" height="20" viewBox="0 0 20 20">
              <g stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 3v4c0 2-2 4-4 4H2" />
                <path d="M8 17l-6-6 6-6" />
              </g>
            </svg>
          </li>
        </ul>
        <n-empty v-else class="pt-20 pb-20" description="暂无搜索结果" />
      </div>
      <template #footer>
        <div v-if="app.device === 'desktop'" class="search-commands">
          <ul>
            <li>
              <kbd class="search-commands-key">
                <svg width="15" height="15" aria-label="Enter key" role="img">
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.2"
                  >
                    <path d="M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3" />
                  </g>
                </svg>
              </kbd>
              <span class="search-commands-label">确认</span>
            </li>
            <li>
              <kbd class="search-commands-key">
                <svg width="15" height="15" aria-label="Arrow down" role="img">
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.2"
                  >
                    <path d="M7.5 3.5v8M10.5 8.5l-3 3-3-3" />
                  </g>
                </svg>
              </kbd>
              <kbd class="search-commands-key">
                <svg width="15" height="15" aria-label="Arrow up" role="img">
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.2"
                  >
                    <path d="M7.5 11.5v-8M10.5 6.5l-3-3-3 3" />
                  </g>
                </svg>
              </kbd>
              <span class="search-commands-label">切换</span>
            </li>
            <li>
              <kbd class="search-commands-key">
                <svg width="15" height="15" aria-label="Escape key" role="img">
                  <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.2"
                  >
                    <path
                      d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"
                    />
                  </g>
                </svg>
              </kbd>
              <span class="search-commands-label">关闭</span>
            </li>
          </ul>
        </div>
      </template>
    </n-modal>
  </div>
</template>
<script lang="ts" setup>
import Search from '@iconify-icons/icon-park-outline/search'
import type { MenuOption } from 'naive-ui'
import { useAppStore, useAuthStore } from '@/store'
import { ref, shallowRef, unref, nextTick, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { openLink } from '@/utils'
import { onKeyStroke, useScroll, useDebounceFn } from '@vueuse/core'

const router = useRouter()
const app = useAppStore()
const auth = useAuthStore()
const showModal = ref(false)
const instance = getCurrentInstance()
const ulRef = ref()
const scrollbarRef = ref()
const { y } = useScroll(scrollbarRef)
const activeIndex = ref(0)
const searchMenuLabel = ref('')
const searchResult = shallowRef<MenuOption[]>([])

const handleSearch = () => {
  activeIndex.value = 0
  searchResult.value = menuAllList.filter((o) => {
    const trimLabel = searchMenuLabel.value.toLocaleLowerCase().trim()
    return trimLabel && String(o.label).toLocaleLowerCase().includes(trimLabel)
  })
}
const onSearch = useDebounceFn(handleSearch, 300)

// 扁平化菜单
const flatMenus = (arr: MenuOption[], parentLabel?): MenuOption[] => {
  let reslut: MenuOption[] = []
  arr.forEach((item) => {
    const label = parentLabel ? `${parentLabel} > ${item.label}` : item.label
    if (item.children && item.children.length > 0) {
      reslut = reslut.concat(flatMenus(item.children, label))
    } else {
      reslut.push({
        key: item.key,
        label: label,
        isLink: item.isLink,
        icon: item.icon,
        linkUrl: item.linkUrl
      })
    }
  })
  return reslut
}

// @ts-ignore
const menuAllList = flatMenus(auth.menus.filter((o) => o.show))

// 点击跳转
const handleClick = async (option: MenuOption) => {
  showModal.value = false
  await nextTick()
  if (option.isLink) {
    openLink(option?.linkUrl as string)
  } else {
    router.push(String(option.key)).catch((err) => {
      console.log(err)
    })
  }
}
// 滚动
const handleScroll = () => {
  if (!instance.refs['li' + activeIndex.value]) return
  // li的padding
  const liItemPadding = 8
  const liItemEl = instance.refs['li' + activeIndex.value][0]
  const liItemElOffsetTop = (liItemEl as HTMLElement)?.offsetTop
  const liItemOffsetHeight = (liItemEl as HTMLElement)?.offsetHeight
  // 可视长度（不包含溢出部分）
  const scrollbarRefHeight = scrollbarRef.value ? scrollbarRef.value?.offsetHeight : 0
  // 总长度（包含溢出部分）
  const ulRefHeight = ulRef.value ? ulRef.value?.offsetHeight : 0
  if (ulRefHeight <= scrollbarRefHeight || liItemElOffsetTop === 0) {
    y.value = 0
  } else if (liItemElOffsetTop < y.value) {
    // 在可视区域上侧
    y.value = liItemElOffsetTop - liItemPadding
  } else if (liItemElOffsetTop + liItemOffsetHeight > scrollbarRefHeight + y.value && liItemElOffsetTop > y.value) {
    // 在可视区域下侧
    y.value = liItemElOffsetTop - (scrollbarRefHeight - liItemOffsetHeight - liItemPadding)
  }
}
// 鼠标滑入
const handleMouseenter = (e) => {
  const index = e.target.dataset.index
  activeIndex.value = Number(index)
}
// 向上
const handleUp = () => {
  if (!searchResult.value.length) return
  activeIndex.value--
  if (activeIndex.value < 0) {
    activeIndex.value = searchResult.value.length - 1
  }
  handleScroll()
}
// 向下
const handleDown = () => {
  if (!searchResult.value.length) return
  activeIndex.value++
  if (activeIndex.value > searchResult.value.length - 1) {
    activeIndex.value = 0
  }
  handleScroll()
}
// 回车
const handleEnter = async () => {
  if (!searchResult.value.length) {
    return
  }
  const result = unref(searchResult)
  const index = unref(activeIndex)
  if (result.length === 0 || index < 0) {
    return
  }
  const to = result[index]
  handleClick(to)
}
const handleAfterLeave = () => {
  searchMenuLabel.value = ''
  searchResult.value = []
}
onKeyStroke('Enter', handleEnter)
onKeyStroke('ArrowUp', handleUp)
onKeyStroke('ArrowDown', handleDown)
</script>
<style lang="scss">
.search {
  width: 560px;
  border-radius: 8px;

  ::-webkit-scrollbar-thumb {
    background-color: var(--n-scrollbar-color);

    &:hover {
      background-color: var(--n-scrollbar-color-hover);
    }
  }

  &.isMobile {
    position: fixed;
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 0;

    .search-list {
      max-height: calc(100vh - 90px);
    }
  }

  .search-input {
    --n-height: 42px !important;
    --n-font-size: 16px !important;
    --n-icon-size: 18px !important;
    --n-clear-size: 18px !important;
  }

  .n-button {
    font-size: 16px;
  }

  .n-card__content {
    padding: 0 20px;
  }

  .search-list {
    position: relative;
    max-height: 320px;
    margin: 8px 0;
    overflow: hidden;
    overflow-y: auto;
    white-space: nowrap;

    ul {
      min-height: 280px;
      white-space: nowrap;
      list-style: none;
      transition: transform 0.5s ease-in-out;

      li {
        position: relative;
        display: flex;
        align-items: center;
        height: 46px;
        cursor: pointer;
        border: 1px solid var(--n-border-color);
        border-radius: 4px;
        box-shadow: 0 1px 2px var(--n-border-color);

        &.active {
          color: #ffffff;
          background-color: var(--primary-color);

          .list-item-enter {
            display: flex;
          }
        }

        .list-item-icon {
          width: 46px;
          font-size: 18px;
        }

        .list-item-text {
          flex: 1;
        }

        .list-item-enter {
          display: flex;
          display: none;
          align-items: center;
          justify-content: left;
          width: 46px;
        }
      }
    }
  }

  .n-card__footer {
    padding: 0 var(--n-padding-left) 0 var(--n-padding-left);
    box-shadow:
      0 -1px 0 0 var(--n-border-color),
      0 -3px 6px 0 rgb(69 98 155 / 12%);
  }

  .search-commands {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 44px;

    &-key {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 18px;
      margin-right: 0.4em;
      border: 0;
      border-radius: 2px;
      box-shadow:
        inset 0 -2px #cdcde6,
        inset 0 0 1px 1px #ffffff,
        0 1px 2px 1px #1e235a66;
    }

    &-label {
      font-size: 0.75em;
      line-height: 1.6em;
    }

    ul {
      display: flex;
      padding: 0;
      margin: 0;
      list-style: none;

      li {
        display: flex;
        align-items: center;
        margin-right: 0.8em;
      }
    }
  }
}
</style>
