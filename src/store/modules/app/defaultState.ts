import { AppState } from '../../interface'

const defaultState = (): AppState => ({
  layout: 'vertical',
  device: 'desktop',
  isDark: false,
  overrideColor: {
    primary: '#409eff',
    info: '#909399',
    success: '#67c23a',
    warning: '#e6a23c',
    error: '#f56c6c'
  },
  sidebar: {
    // 展开
    opened: true,
    // 判断是否手动点击Collapse
    isClickCollapse: false,
    // 显示logo
    showLogo: true,
    // 侧边栏宽度
    sidebarWidth: 210,
    // 菜单手风琴
    accordion: true,
    // 主题反转
    inverted: true
  },
  // 显示Footer
  showFooter: false,
  // 标签页
  tagsView: {
    show: true,
    fullScreen: false
  },
  watermark: {
    show: false,
    content: 'vue-elven'
  },
  breadcrumb: {
    // 面包屑图标
    showIcon: true,
    // 面包屑下拉
    dropdown: false
  }
})

export default defaultState
