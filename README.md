# 物流智能问答系统

一个基于 Vue 3 + TypeScript + Vite 开发的物流行业智能问答系统，集成了大语言模型 API，提供专业的物流咨询服务。

## 在线演示

项目已部署在 Vercel 平台，点击访问：[物流智能问答系统](https://postal-q-a-system.vercel.app/)

## 功能特点

- 💬 智能对话：支持自然语言交互，提供流畅的对话体验
- ⚡ 流式响应：实时显示 AI 回复，提供更自然的交互体验
- 📝 Markdown 支持：支持代码高亮、表格、列表等丰富的内容展示
- 💾 记忆化：自动保存对话历史，刷新页面后仍可继续对话
- 📦 物流知识库：内置物流行业专业知识，提供专业的物流咨询
- ⚙️ 灵活配置：支持自定义 API 配置，适配不同的模型服务

## 技术栈

- Vue 3 + TypeScript
- Vite
- Pinia (状态管理)
- Element Plus (UI 组件库)
- Marked (Markdown 渲染)
- Highlight.js (代码高亮)

## 开发环境要求

- Node.js 16+
- npm 7+

## 项目设置

```sh
npm install
```

### 开发环境运行

```sh
npm run dev
```

### 生产环境构建

```sh
npm run build
```

### 运行单元测试

```sh
npm run test:unit
```

### 运行端到端测试

```sh
npm run test:e2e:dev
```

### 代码检查

```sh
npm run lint
```

## 推荐 IDE 设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并禁用 Vetur)

## TypeScript 支持

TypeScript 默认无法处理 `.vue` 导入的类型信息，因此我们使用 `vue-tsc` 替代 `tsc` 进行类型检查。在编辑器中，我们需要 [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 来使 TypeScript 语言服务能够识别 `.vue` 类型。

## 配置参考

查看 [Vite 配置参考](https://vite.dev/config/)
