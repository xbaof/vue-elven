import { defineStore } from 'pinia'
import { isObjectValueEqual } from '@/utils'
import type { TagsViewState, TagView } from '../types'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'

export const isPathAndQueryEqual = (a: TagView, b: TagView): boolean => {
  return decodeURI(a.path) === decodeURI(b.path) && isObjectValueEqual(a.query || {}, b.query || {})
}

/**
 * 获取标签页标题。
 */
export const getTagViewTitle = (tagView: TagView): string => {
  const { query, params, meta } = tagView
  if (query?.tagViewTitle || params?.tagViewTitle) {
    return query?.tagViewTitle?.toString() || params?.tagViewTitle?.toString() || ''
  }
  return meta?.title || ''
}

/**
 * 将路由对象转换为标签页对象。
 */
export const toTagView = (route: RouteRecordRaw | RouteLocationNormalizedLoaded): TagView => {
  const routeName =
    typeof route.name === 'string' ? route.name : typeof route.name === 'symbol' ? (route.name.description ?? '') : ''
  const routeTitle = typeof route.meta?.title === 'string' ? route.meta.title : routeName
  const query = 'query' in route ? (route.query ?? {}) : {}
  const params = 'params' in route ? (route.params ?? {}) : {}

  return {
    path: route.path,
    name: routeName,
    title: routeTitle,
    meta: { ...(route.meta || {}) },
    query,
    params
  }
}

export const useTagsViewStore = defineStore('tagsView', {
  state: (): TagsViewState => ({
    visitedViews: [],
    cachedViews: []
  }),
  actions: {
    addVisitedView(view: TagView): void {
      if (!view.meta.isTagsView) {
        return
      }
      if (view.meta.isLink) {
        return
      }
      if (this.visitedViews.some((item) => isPathAndQueryEqual(item, view))) {
        return
      }

      this.visitedViews.push({
        ...view,
        title: getTagViewTitle(view)
      })
    },
    addCachedView(view: TagView): void {
      if (this.cachedViews.includes(view.name)) {
        return
      }
      if (view.meta.isKeepAlive) {
        this.cachedViews.push(view.name)
      }
    },
    async delVisitedView(view: TagView): Promise<TagView[]> {
      for (const [index, item] of this.visitedViews.entries()) {
        if (isPathAndQueryEqual(item, view)) {
          this.visitedViews.splice(index, 1)
          break
        }
      }
      return [...this.visitedViews]
    },
    async delCachedView(view: TagView): Promise<string[]> {
      const index = this.cachedViews.indexOf(view.name)
      if (index > -1) {
        this.cachedViews.splice(index, 1)
      }
      return [...this.cachedViews]
    },
    async delOtherVisitedViews(view: TagView): Promise<TagView[]> {
      this.visitedViews = this.visitedViews.filter((item) => {
        return item.meta?.isAffix || isPathAndQueryEqual(item, view)
      })
      return [...this.visitedViews]
    },
    async delOtherCachedViews(view: TagView): Promise<string[]> {
      const index = this.cachedViews.indexOf(view.name)
      if (index > -1) {
        this.cachedViews = this.cachedViews.slice(index, index + 1)
      } else {
        this.cachedViews = []
      }
      return [...this.cachedViews]
    },
    updateVisitedView(view: TagView): void {
      const matchedView = this.visitedViews.find((item) => isPathAndQueryEqual(item, view))
      if (matchedView) {
        Object.assign(matchedView, view)
      }
    },
    addView(view: TagView): void {
      this.addVisitedView(view)
      this.addCachedView(view)
    },
    async delView(view: TagView): Promise<TagsViewState> {
      await this.delVisitedView(view)
      await this.delCachedView(view)
      return {
        visitedViews: [...this.visitedViews],
        cachedViews: [...this.cachedViews]
      }
    },
    async delLeftViews(view: TagView): Promise<Pick<TagsViewState, 'visitedViews'>> {
      const currentIndex = this.visitedViews.findIndex((item) => isPathAndQueryEqual(item, view))
      if (currentIndex === -1) {
        return {
          visitedViews: [...this.visitedViews]
        }
      }

      this.visitedViews = this.visitedViews.filter((item, index) => {
        const cacheIndex = this.cachedViews.indexOf(item.name)
        if (cacheIndex > -1) {
          this.cachedViews.splice(cacheIndex, 1)
        }
        return index >= currentIndex || item.meta?.isAffix
      })

      return {
        visitedViews: [...this.visitedViews]
      }
    },
    async delRightViews(view: TagView): Promise<Pick<TagsViewState, 'visitedViews'>> {
      const currentIndex = this.visitedViews.findIndex((item) => isPathAndQueryEqual(item, view))
      if (currentIndex === -1) {
        return {
          visitedViews: [...this.visitedViews]
        }
      }

      this.visitedViews = this.visitedViews.filter((item, index) => {
        const cacheIndex = this.cachedViews.indexOf(item.name)
        if (cacheIndex > -1) {
          this.cachedViews.splice(cacheIndex, 1)
        }
        return index <= currentIndex || item.meta?.isAffix
      })

      return {
        visitedViews: [...this.visitedViews]
      }
    },
    async delOtherViews(view: TagView): Promise<TagsViewState> {
      await this.delOtherVisitedViews(view)
      await this.delOtherCachedViews(view)
      return {
        visitedViews: [...this.visitedViews],
        cachedViews: [...this.cachedViews]
      }
    },
    async delAllViews(): Promise<TagsViewState> {
      const affixTags = this.visitedViews.filter((item) => item.meta?.isAffix)
      this.visitedViews = affixTags
      this.cachedViews = []
      return {
        visitedViews: [...this.visitedViews],
        cachedViews: [...this.cachedViews]
      }
    },
    resetTagsView(): void {
      this.$reset()
    }
  }
})
