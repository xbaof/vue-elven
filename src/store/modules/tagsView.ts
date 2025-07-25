import { defineStore } from 'pinia'
import { getTagViewTitle } from '@/utils'
import { isObjectValueEqual } from '@/utils'
import type { TagsViewState, TagView } from '../interface'

export const isPathAndQueryEqual = (a: TagView, b: TagView) =>
  decodeURI(a.path) === decodeURI(b.path) && isObjectValueEqual(a?.query || {}, b?.query || {})

export const useTagsViewStore = defineStore('tagsView', {
  state: (): TagsViewState => ({
    visitedViews: [],
    cachedViews: [] //  keepAlive 缓存页面
  }),
  actions: {
    addVisitedView(view: TagView) {
      if (view.meta.noTagsView) {
        return
      }
      if (view.meta.isLink) {
        return
      }
      if (this.visitedViews.some((v) => isPathAndQueryEqual(v, view))) {
        return
      }
      this.visitedViews.push(
        Object.assign({}, view, {
          title: getTagViewTitle(view)
        })
      )
    },
    addCachedView(view: TagView) {
      if (this.cachedViews.includes(view.name)) {
        return
      }
      if (view.meta.isKeepAlive) {
        this.cachedViews.push(view.name)
      }
    },
    delVisitedView(view: TagView) {
      return new Promise((resolve) => {
        for (const [i, v] of this.visitedViews.entries()) {
          if (isPathAndQueryEqual(v, view)) {
            this.visitedViews.splice(i, 1)
            break
          }
        }
        resolve([...this.visitedViews])
      })
    },
    delCachedView(view: TagView) {
      return new Promise((resolve) => {
        const index = this.cachedViews.indexOf(view.name)
        index > -1 && this.cachedViews.splice(index, 1)
        resolve([...this.cachedViews])
      })
    },
    delOtherVisitedViews(view: TagView) {
      return new Promise((resolve) => {
        this.visitedViews = this.visitedViews.filter((v) => {
          return v.meta?.isAffix || isPathAndQueryEqual(v, view)
        })
        resolve([...this.visitedViews])
      })
    },
    delOtherCachedViews(view: TagView) {
      return new Promise((resolve) => {
        const index = this.cachedViews.indexOf(view.name)
        if (index > -1) {
          this.cachedViews = this.cachedViews.slice(index, index + 1)
        } else {
          this.cachedViews = []
        }
        resolve([...this.cachedViews])
      })
    },
    updateVisitedView(view: TagView) {
      for (let v of this.visitedViews) {
        if (isPathAndQueryEqual(v, view)) {
          v = Object.assign(v, view)
          break
        }
      }
    },
    addView(view: TagView) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },
    delView(view: TagView) {
      return new Promise((resolve) => {
        this.delVisitedView(view)
        this.delCachedView(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },
    delLeftViews(view: TagView) {
      return new Promise((resolve) => {
        const currIndex = this.visitedViews.findIndex((v) => isPathAndQueryEqual(v, view))
        if (currIndex === -1) {
          return
        }
        this.visitedViews = this.visitedViews.filter((v, i) => {
          const cacheIndex = this.cachedViews.indexOf(v.name)
          cacheIndex > -1 && this.cachedViews.splice(cacheIndex, 1)
          return i >= currIndex || v?.meta?.isAffix
        })
        resolve({
          visitedViews: [...this.visitedViews]
        })
      })
    },
    delRightViews(view: TagView) {
      return new Promise((resolve) => {
        const currIndex = this.visitedViews.findIndex((v) => isPathAndQueryEqual(v, view))
        if (currIndex === -1) {
          return
        }
        this.visitedViews = this.visitedViews.filter((v, i) => {
          const cacheIndex = this.cachedViews.indexOf(v.name)
          cacheIndex > -1 && this.cachedViews.splice(cacheIndex, 1)
          return i <= currIndex || v?.meta?.isAffix
        })
        resolve({
          visitedViews: [...this.visitedViews]
        })
      })
    },
    delOtherViews(view: TagView) {
      return new Promise((resolve) => {
        this.delOtherVisitedViews(view)
        this.delOtherCachedViews(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },
    delAllViews() {
      return new Promise((resolve) => {
        const isAffixTags = this.visitedViews.filter((tag: TagView) => tag.meta?.isAffix)
        this.visitedViews = isAffixTags
        this.cachedViews = []
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    }
  }
})
