# Vue Elven

Vue3 + TypeScript + Naive UI 企业级管理系统

## 项目特性

- 🚀 **Vue 3 + TypeScript** - 现代化的前端技术栈
- 🎨 **Naive UI** - 高质量 Vue 3 组件库
- 📦 **Vite** - 极速的前端构建工具
- 🗃️ **Pinia** - Vue 官方状态管理库
- 🔐 **数据加密** - Store 持久化数据加密存储
- 🎯 **权限管理** - 基于角色的访问控制
- 📱 **响应式设计** - 支持多端适配
- 🎨 **主题切换** - 支持明暗主题切换

## 数据加密功能

本项目使用 `pinia-plugin-persistedstate` 配合 `crypto-js` 实现对 store 持久化数据的加密存储。

### 加密特性

- 🔐 **AES 加密算法** - 使用业界标准的 AES 加密
- 🎯 **条件加密** - 只对敏感字段进行加密，提高性能
- 🔑 **环境变量配置** - 支持通过环境变量配置加密密钥
- 🛡️ **错误处理** - 加密失败时自动降级，确保应用正常运行

### 快速开始

1. **配置环境变量**

```bash
# .env
VITE_CRYPTO_SECRET_KEY=your-secret-key-here
```

2. **使用加密序列化器**

```typescript
import { createConditionalEncryptedSerializer } from '@/utils/crypto'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '', // 敏感数据
    name: '', // 非敏感数据
    perms: [] // 敏感数据
  }),
  persist: {
    key: 'auth',
    storage: localStorage,
    // 只对 token 和 perms 进行加密
    serializer: createConditionalEncryptedSerializer(['token', 'perms'])
  }
})
```

详细文档请查看 [Store 加密指南](./docs/store-encryption.md)

## 推荐开发环境

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并禁用 Vetur)。

## TypeScript 支持

TypeScript 默认无法处理 `.vue` 导入的类型信息，因此我们使用 `vue-tsc` 替代 `tsc` CLI 进行类型检查。在编辑器中，需要 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 来让 TypeScript 语言服务了解 `.vue` 类型。

## 自定义配置

查看 [Vite 配置参考](https://vitejs.dev/config/)。

## 项目设置

```sh
pnpm install
```

### 开发环境编译和热重载

```sh
pnpm dev
```

### 生产环境类型检查、编译和压缩

```sh
pnpm build
```

## 项目结构

```
vue-elven/
├── src/
│   ├── api/              # API 接口
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   ├── layout/           # 布局组件
│   ├── plugins/          # 插件配置
│   ├── router/           # 路由配置
│   ├── store/            # 状态管理
│   ├── styles/           # 样式文件
│   ├── utils/            # 工具函数
│   └── views/            # 页面组件
├── docs/                 # 文档
└── types/                # 类型定义
```

## 许可证

MIT
