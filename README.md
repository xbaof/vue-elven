# Vue Elven

基于 `Vue 3 + TypeScript + Vite + Naive UI` 的中后台前端模板项目。项目内置登录鉴权、动态路由、标签页缓存、主题与布局配置、Mock 接口、统一错误处理及工程化规范，可作为后台管理系统的开发基座直接二次开发。

## 功能特性

- 基于后端菜单动态生成路由与侧边菜单。
- 登录态鉴权与路由守卫统一处理。
- 支持 `vertical / horizontal / mix` 三种布局模式。
- 支持标签页（TagsView）缓存、刷新、批量关闭、全屏。
- 支持深浅色主题切换与主题色动态配置。
- 内置常用演示能力：
  - 自定义指令（复制、防抖/节流、长按、按钮权限）
  - 富文本编辑器（WangEditor）
  - 图片裁剪（Cropperjs）
  - 图标选择器（Iconify + 本地 SVG）
- 内置 Axios 请求封装：统一错误归一化、重复请求取消、Token 自动注入。
- 内置开发 Mock（`vite-plugin-mock`）。
- 完整工程化门禁：`ESLint + Prettier + Stylelint + Husky + lint-staged + commitlint`。

## 技术栈

- `Vue 3`
- `TypeScript`
- `Vite 7`
- `Naive UI`
- `Pinia + pinia-plugin-persistedstate`
- `Vue Router 4`
- `Axios`
- `VueUse`
- `Sass`

## 环境要求

- `Node.js`: `^20.19.0 || >=22.13.0`
- `pnpm`: `>=9`

## 快速开始

```bash
pnpm install
pnpm dev
```

默认开发端口见 `.env` 中的 `VITE_PORT`（当前为 `7956`）。

## 常用命令

```bash
# 启动开发环境
pnpm dev

# 生产构建（先做类型检查）
pnpm build

# 本地预览构建产物
pnpm preview

# 仅类型检查
pnpm type-check

# 执行 ESLint + Prettier + Stylelint
pnpm lint

# 自动修复 ESLint 问题
pnpm lint:eslint:fix

# 校验最近一次提交信息
pnpm commitlint
```

## 环境变量说明

### `.env`

```bash
VITE_PORT=7956
VITE_GLOB_TITLE=Vue-Elven
VITE_OPEN=true
VITE_OPEN_VISUALIZER=false
VITE_CRYPTO_SECRET_KEY=...
VITE_CRYPTO_IV_KEY=...
```

### `.env.development`

```bash
VITE_PUBLIC_PATH=/
VITE_DROP_CONSOLE=false
VITE_API_BASE_URL=
```

### `.env.production`

```bash
VITE_PUBLIC_PATH=/
VITE_DROP_CONSOLE=true
VITE_API_BASE_URL=https://...
```

## 项目结构

```text
.
├─ docs/                         # 组件文档（Markdown）
├─ mock/                         # 本地 Mock 接口
├─ public/                       # 公共静态资源
├─ src/
│  ├─ api/                       # 接口层（http 封装 + 业务 API）
│  ├─ assets/                    # 资源（图片、SVG）
│  ├─ components/                # 通用组件
│  ├─ directives/                # 全局指令
│  ├─ enums/                     # 枚举与常量
│  ├─ hooks/                     # 复用组合式逻辑
│  ├─ layout/                    # 布局系统（头部/侧栏/内容/页脚）
│  ├─ plugins/                   # 插件注册（pinia/router/naive-ui）
│  ├─ router/                    # 路由（静态、动态、守卫）
│  ├─ store/                     # Pinia 状态管理
│  ├─ styles/                    # 全局样式
│  ├─ utils/                     # 工具函数与错误处理
│  ├─ views/                     # 页面视图
│  ├─ App.vue
│  └─ main.ts
├─ types/                        # 全局类型声明与扩展
├─ vite.config.ts                # Vite 配置
├─ tsconfig.json
└─ package.json
```

## 核心架构说明

### 1. 应用启动链路

`src/main.ts` -> `src/plugins/index.ts` -> 注册 `Pinia / Naive UI / Naive Discrete Api / Router / Global Components / Directives` -> `router.isReady()` 后挂载。

### 2. 鉴权与动态路由

路由守卫在 `src/router/guard/index.ts` 中统一处理：

- 无 Token：仅允许访问白名单（`/login`、`/redirect`）。
- 有 Token：首次进入时并行拉取：
  - 用户信息：`useUserStore().fetchUserInfo()`
  - 权限与菜单：`usePermissionStore().buildRoutes()`
- `buildRoutes()` 会把后端 `menus` 转成 `RouteRecordRaw`，动态挂载到 `Layout` 下。

### 3. 菜单与路由关系

后端菜单 `menuType` 约定：

- `0`：普通页面路由
- `1`：内嵌 iframe 页面
- `2`：外链（新窗口打开）
- `3`：按钮权限点（不生成可访问页面）

菜单元信息通过 `RouteMeta` 承载，例如：

- `isTagsView`: 是否进入标签页
- `isKeepAlive`: 是否缓存
- `isAffix`: 是否固定标签
- `isHidden`: 是否在菜单隐藏
- `activePath`: 详情页高亮归属菜单

### 4. 标签页（TagsView）

由 `src/store/modules/tagsView.ts` 管理：

- `visitedViews`：访问过的标签列表
- `cachedViews`：被 `keep-alive` 缓存的页面 name

支持刷新、关当前、关左/右、关其他、全关、全屏。刷新逻辑通过 `/redirect/:path(.*)` 中转实现页面重建。

### 5. 主题与布局

`src/store/modules/app` 管理全局 UI 配置：

- 布局模式：`vertical / horizontal / mix`
- 侧栏状态、宽度、是否反色
- 主题色覆盖
- 标签栏、页脚、面包屑、水印开关

配置持久化到 `localStorage`，刷新后可恢复。

### 6. 请求与错误处理

`src/api/http/index.ts` 提供统一请求能力：

- 请求拦截：自动注入 Bearer Token。
- 重复请求取消：默认开启，可通过 `cancel: false` 关闭。
- 业务错误与网络错误统一归一化为 `NormalizedError`。
- 支持 `showErrorMessage` 控制是否自动弹错。

## Mock 与后端联调

### 开发 Mock

- 开发模式默认启用 `vite-plugin-mock`。
- Mock 文件位于 `mock/`，当前包含：
  - `mock/auth.ts`
  - `mock/upload.ts`

### 代理规则

`vite.config.ts` 中配置了代理：

- `/api` -> `VITE_API_BASE_URL`
- 会把请求路径前缀 `/api` 重写掉

说明：

- 若你调用 `/api/user/list`，实际转发为 `${VITE_API_BASE_URL}/user/list`。
- 现有 mock 示例接口多为根路径（如 `/login`、`/getPermission`），可按团队约定统一是否使用 `/api` 前缀。

## 开发指南

### 新增页面

1. 在 `src/views` 下创建页面组件。
2. 在后端菜单（或 mock 菜单）配置 `component` 字段，值对应 `views` 下路径（不带 `.vue`）。
3. 确保菜单项 `path`、`name`、`meta` 约定完整。
4. 登录后自动挂载动态路由并出现在菜单中。

### 新增业务 API

1. 在 `src/api/system/types` 定义请求/响应类型。
2. 在 `src/api/system/*.ts` 新增 API 方法。
3. 页面中调用时优先通过 `useUiFeedback` 统一反馈消息。

### 按钮级权限控制

通过 `v-permission` 指令控制元素展示：

```vue
<n-button v-permission="'sys:user:add'">新增用户</n-button>
<n-button v-permission="['sys:user:add', 'sys:user:update']">编辑</n-button>
```

## 代码规范与提交流程

### 代码质量门禁

- `pnpm lint`
- `pnpm type-check`

### Git Hooks

- `pre-commit` 执行 `lint-staged`
- `commit-msg` 执行 `commitlint`

### Commit 规范

格式：

```text
type(scope): subject
```

常用 `type`：

`feat`、`fix`、`perf`、`style`、`docs`、`test`、`refactor`、`build`、`ci`、`chore`、`revert`、`types` 等。

示例：

```text
feat(auth): 增加刷新令牌逻辑
fix(router): 修复动态路由首次刷新重定向问题
```

## 打包与部署说明

- 构建命令：`pnpm build`
- 产物目录：`dist/`
- 已启用 `gzip` 压缩插件（保留原文件）
- 已配置基础分包策略（`framework / vendor / iconify`）

如需二级路径部署，请配置 `VITE_PUBLIC_PATH`。

## License

MIT

## 仓库地址

- GitHub: `https://github.com/xbaof/vue-elven`
