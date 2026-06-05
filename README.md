# Vue Elven

Vue Elven 是一个基于 Vue 3、TypeScript、Vite 和 Naive UI 的中后台前端模板。项目经过精简后，保留了后台系统常用的登录鉴权、动态路由、菜单权限、标签页、主题配置、Mock 接口和常用业务组件示例，适合作为后台管理系统的二次开发起点。

## 技术栈

- Vue 3.5+
- TypeScript 5
- Vite 7
- Naive UI
- Pinia
- Vue Router 4
- Axios
- VueUse
- Sass
- vite-plugin-mock
- ESLint / Prettier / Stylelint / Husky / lint-staged / Commitlint

## 功能特性

- 登录鉴权：基于 Token 的登录、登出、路由守卫和权限初始化。
- 动态路由：根据后端菜单生成路由，并挂载到 Layout 下。
- 权限控制：支持角色、权限标识和 `v-permission` 指令。
- 菜单能力：支持普通页面、外链、iframe、隐藏菜单、激活菜单和菜单标记。
- 标签页：支持缓存、固定标签、关闭当前、关闭其他、关闭左侧、关闭右侧和关闭全部。
- 主题配置：支持明暗主题、主题色覆盖、侧边栏配置、布局模式和水印。
- Mock 接口：开发环境内置登录、用户信息、权限菜单和上传接口。
- 常用组件：富文本编辑器、Markdown 编辑器、图片裁剪、电子签名、图标选择器、SVG 图标。
- 自定义指令：复制、长按、防抖节流、权限控制。
- 工程化：内置类型检查、构建、代码格式化、提交前检查和提交信息校验。

## 环境要求

- Node.js：`^20.19.0 || >=22.13.0`
- pnpm：`>=9`

## 快速开始

```bash
pnpm install
pnpm dev
```

开发服务默认读取 `.env` 中的端口配置：

```bash
VITE_PORT = 7956
```

如果端口被占用，Vite 会自动尝试下一个可用端口。

## 测试账号

开发环境 Mock 登录账号：

| 用户名   | 密码     | 角色说明   |
| -------- | -------- | ---------- |
| `admin`  | `123456` | 平台管理员 |
| `system` | `123456` | 系统管理员 |

## 常用命令

```bash
pnpm dev          # 启动开发服务
pnpm build        # 类型检查并构建生产包
pnpm preview      # 本地预览生产包
pnpm type-check   # TypeScript 类型检查
pnpm lint         # 依次执行 ESLint、Prettier、Stylelint
pnpm lint:eslint  # ESLint 检查
pnpm lint:prettier # Prettier 格式化
pnpm lint:stylelint # Stylelint 检查并修复样式
```

## 目录结构

```text
.
├── docs/                 # 组件 API 文档
├── mock/                 # 开发环境 Mock 接口
├── public/               # 静态资源
├── src/
│   ├── api/              # 接口封装、HTTP 请求、接口类型
│   ├── assets/           # 图片与 SVG 资源
│   ├── components/       # 通用组件
│   ├── directives/       # 全局自定义指令
│   ├── enums/            # 枚举常量
│   ├── hooks/            # 组合式函数
│   ├── layout/           # 后台布局、头部、侧边栏、标签页、路由容器
│   ├── plugins/          # Vue 插件注册入口
│   ├── router/           # 静态路由、动态路由、路由守卫
│   ├── store/            # Pinia 状态模块
│   ├── styles/           # 全局样式、主题样式、布局样式
│   ├── utils/            # 工具函数
│   └── views/            # 页面视图
├── types/                # 全局类型声明
├── vite.config.ts        # Vite 配置
└── package.json          # 项目依赖与脚本
```

## 核心流程

### 登录与权限

1. 访问受保护页面时，路由守卫会检查 Token。
2. 没有 Token 时跳转到 `/login`。
3. 有 Token 时，首次进入会并行获取用户信息和权限菜单。
4. 权限菜单会转换为动态路由并挂载到 `Layout` 下。
5. 路由挂载完成后，页面继续跳转到目标地址。

### 动态菜单类型

后端菜单中的 `menuType` 决定菜单行为：

| 值  | 说明     |
| --- | -------- |
| `0` | 普通页面 |
| `1` | iframe   |
| `2` | 外链     |
| `3` | 按钮权限 |

### 页面路径规则

动态路由通过后端菜单的 `component` 字段匹配 `src/views` 下的页面：

```text
component: "fun/editor/index"
```

对应文件：

```text
src/views/fun/editor/index.vue
```

## 环境变量

基础环境变量在 `.env` 中配置：

| 变量名                   | 说明                     |
| ------------------------ | ------------------------ |
| `VITE_PORT`              | 开发服务端口             |
| `VITE_GLOB_TITLE`        | 应用标题                 |
| `VITE_OPEN`              | 启动开发服务后打开浏览器 |
| `VITE_OPEN_VISUALIZER`   | 是否开启构建分析         |
| `VITE_CRYPTO_SECRET_KEY` | 本地持久化加密密钥       |
| `VITE_CRYPTO_IV_KEY`     | 本地持久化加密向量       |

开发环境 `.env.development`：

| 变量名              | 说明             |
| ------------------- | ---------------- |
| `VITE_PUBLIC_PATH`  | 应用基础路径     |
| `VITE_DROP_CONSOLE` | 是否移除 console |
| `VITE_API_BASE_URL` | 接口代理目标地址 |

生产环境 `.env.production`：

| 变量名              | 说明             |
| ------------------- | ---------------- |
| `VITE_PUBLIC_PATH`  | 应用基础路径     |
| `VITE_DROP_CONSOLE` | 是否移除 console |
| `VITE_API_BASE_URL` | 线上接口地址     |

## 内置组件文档

组件 API 文档位于 `docs/component-api`：

- `cropper.md`：图片裁剪组件
- `editor.md`：富文本编辑器
- `icon.md`：图标选择器
- `markdown-editor.md`：Markdown 编辑器
- `signature-pad.md`：电子签名组件

## 开发约定

### 新增页面

1. 在 `src/views` 下创建页面组件。
2. 后端菜单的 `component` 字段填写相对 `src/views` 的路径，不需要 `.vue` 后缀。
3. 登录后权限菜单会自动转换为路由和菜单。

### 权限按钮

```vue
<n-button v-permission="'sys:user:add'">新增</n-button>
```

### 提交检查

项目使用 Husky 管理 Git Hooks：

- `pre-commit`：执行 `pnpm lint-staged`
- `commit-msg`：执行 `pnpm exec commitlint --edit "$1"`

`lint-staged` 会根据暂存文件类型执行：

| 文件类型                        | 命令                            |
| ------------------------------- | ------------------------------- |
| `*.{js,ts,tsx,vue}`             | `eslint --max-warnings 0 --fix` |
| `*.{css,scss,less,postcss,vue}` | `stylelint --fix`               |
| `*.{json,md,html}`              | `prettier --write`              |

提交信息遵循 Conventional Commits：

```text
type(scope): subject
```

示例：

```text
feat(auth): 新增登录功能
fix(router): 修复路由重定向问题
refactor(core): 收敛通用类型定义
docs(readme): 更新项目说明
```

## 构建部署

```bash
pnpm build
```

构建产物输出到 `dist/`。生产构建会根据 `vite.config.ts` 进行资源压缩、静态资源分组和 gzip 产物生成。

## 仓库

```text
https://github.com/xbaof/vue-elven
```

## License

MIT
