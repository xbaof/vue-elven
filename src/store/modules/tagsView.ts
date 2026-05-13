import { defineStore } from 'pinia'
import { isSameRoute, getTagTitle } from '@/utils'
import type { TagsViewState, TagView } from '../types'

export const useTagsViewStore = defineStore('tagsView', {
  state: (): TagsViewState => ({
    visitedViews: [],
    cachedViews: []
  }),
  actions: {
    addVisitedView(view: TagView): void {
      if (!view.meta.isTagsView || view.meta.isLink) return
      if (this.visitedViews.some((item) => isSameRoute(item, view))) return

      this.visitedViews.push({ ...view, title: getTagTitle(view) })
    },

    addCachedView(view: TagView): void {
      if (this.cachedViews.includes(view.name)) return
      if (view.meta.isKeepAlive) {
        this.cachedViews.push(view.name)
      }
    },

    delVisitedView(view: TagView): TagView[] {
      const index = this.visitedViews.findIndex((item) => isSameRoute(item, view))
      if (index > -1) {
        this.visitedViews.splice(index, 1)
      }
      return [...this.visitedViews]
    },

    delCachedView(view: TagView): string[] {
      const index = this.cachedViews.indexOf(view.name)
      if (index > -1) {
        this.cachedViews.splice(index, 1)
      }
      return [...this.cachedViews]
    },

    delOtherVisitedViews(view: TagView): TagView[] {
      this.visitedViews = this.visitedViews.filter((item) => item.meta?.isAffix || isSameRoute(item, view))
      return [...this.visitedViews]
    },

    delOtherCachedViews(view: TagView): string[] {
      const index = this.cachedViews.indexOf(view.name)
      this.cachedViews = index > -1 ? this.cachedViews.slice(index, index + 1) : []
      return [...this.cachedViews]
    },

    delLeftViews(view: TagView): Pick<TagsViewState, 'visitedViews'> {
      const currentIndex = this.visitedViews.findIndex((item) => isSameRoute(item, view))
      if (currentIndex === -1) {
        return { visitedViews: [...this.visitedViews] }
      }

      this.visitedViews = this.visitedViews.filter((item, index) => {
        if (index < currentIndex && !item.meta?.isAffix) {
          const cacheIndex = this.cachedViews.indexOf(item.name)
          if (cacheIndex > -1) this.cachedViews.splice(cacheIndex, 1)
          return false
        }
        return true
      })

      return { visitedViews: [...this.visitedViews] }
    },

    delRightViews(view: TagView): Pick<TagsViewState, 'visitedViews'> {
      const currentIndex = this.visitedViews.findIndex((item) => isSameRoute(item, view))
      if (currentIndex === -1) {
        return { visitedViews: [...this.visitedViews] }
      }

      this.visitedViews = this.visitedViews.filter((item, index) => {
        if (index > currentIndex && !item.meta?.isAffix) {
          const cacheIndex = this.cachedViews.indexOf(item.name)
          if (cacheIndex > -1) this.cachedViews.splice(cacheIndex, 1)
          return false
        }
        return true
      })

      return { visitedViews: [...this.visitedViews] }
    },

    updateVisitedView(view: TagView): void {
      const matchedView = this.visitedViews.find((item) => isSameRoute(item, view))
      if (matchedView) {
        Object.assign(matchedView, view)
      }
    },

    addView(view: TagView): void {
      this.addVisitedView(view)
      this.addCachedView(view)
    },

    delView(view: TagView): TagsViewState {
      return {
        visitedViews: this.delVisitedView(view),
        cachedViews: this.delCachedView(view)
      }
    },

    delOtherViews(view: TagView): TagsViewState {
      return {
        visitedViews: this.delOtherVisitedViews(view),
        cachedViews: this.delOtherCachedViews(view)
      }
    },

    delAllViews(): TagsViewState {
      this.visitedViews = this.visitedViews.filter((item) => item.meta?.isAffix)
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
