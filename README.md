# Vue Elven

基于 `Vue 3 + TypeScript + Vite + Naive UI` 的中后台管理系统模板，内置权限路由、标签页缓存、主题配置、Mock 接口与常用工程化规范。

## 技术栈

- `Vue 3`
- `TypeScript`
- `Vite`
- `Naive UI`
- `Pinia`
- `Vue Router`
- `VueUse`
- `ESLint + Prettier + Stylelint`
- `Husky + lint-staged + commitlint`

## 环境要求

- `Node.js`: `^20.19.0 || >=22.13.0`
- `pnpm`: `>=9`

## 快速开始

```bash
pnpm install
pnpm dev
```

启动后默认访问本地开发地址（通常为 `http://localhost:7956` 或 Vite 控制台输出地址）。

## 常用命令

- `pnpm dev`：启动本地开发服务
- `pnpm build`：执行类型检查并构建生产产物
- `pnpm preview`：本地预览构建结果
- `pnpm type-check`：执行 TypeScript 类型检查
- `pnpm lint`：执行 ESLint、Prettier、Stylelint
- `pnpm lint:eslint:fix`：自动修复可修复的 ESLint 问题
- `pnpm lint-staged`：仅校验暂存区文件
- `pnpm commitlint`：校验最近一次提交信息

## 目录结构

```text
.
├─ mock/                        # 本地 Mock 接口
├─ public/                      # 静态资源
├─ src/
│  ├─ api/                      # 接口层（按业务域拆分）
│  ├─ components/               # 通用组件
│  ├─ directives/               # 自定义指令
│  ├─ enums/                    # 枚举常量
│  ├─ hooks/                    # 复用逻辑
│  ├─ layout/                   # 布局系统（头部/侧栏/主内容）
│  ├─ plugins/                  # 插件注册
│  ├─ router/                   # 静态路由、动态路由、守卫
│  ├─ store/                    # Pinia 状态管理
│  ├─ styles/                   # 全局样式
│  ├─ utils/                    # 工具函数
│  └─ views/                    # 页面视图
├─ types/                       # 全局类型声明
└─ vite.config.ts               # Vite 配置
```

## 开发规范摘要

### 提交规范

- 提交信息必须使用：`type(scope): subject`
- `type` 允许值：
  - `feat`、`fix`、`perf`、`style`、`docs`、`test`、`refactor`
  - `build`、`ci`、`chore`、`revert`、`wip`、`workflow`、`types`、`release`

示例：

```text
feat(auth): 增加刷新令牌逻辑
fix(router): 修复白名单路由判断
```

### 分支规范

- 功能分支：`feature/<任务号>-<短描述>`
- 缺陷分支：`fix/<任务号>-<短描述>`
- 紧急修复：`hotfix/<任务号>-<短描述>`
- 工程维护：`chore/<任务号>-<短描述>`

### 合并门禁

- 合并前需通过：
  - `pnpm lint`
  - `pnpm type-check`

## 开发流程建议

1. 新建符合规范的分支。
2. 开发完成后先执行 `pnpm lint` 与 `pnpm type-check`。
3. 提交时由 `husky` 自动触发 `lint-staged` 与 `commitlint`。
4. 发起 PR，补充变更原因、影响范围、验证步骤与回滚方案。

## 许可证

本项目使用 [MIT](LICENSE) 许可证。

## 仓库地址

- GitHub: `https://github.com/xbaof/vue-elven`
