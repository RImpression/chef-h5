# 代码规范

## 通用原则

- 模块职责单一，避免循环依赖
- 导入语句按分组排列：外部库 → 项目内绝对路径 → 相对路径（`../`）
- 优先使用具名导出（`export function Xxx`），仅 `App.tsx` 使用 `export default`
- 组件/页面文件使用 PascalCase（如 `RecipePage.tsx`），工具/hooks 使用 camelCase（如 `useRecipe.ts`、`fetcher.ts`）

## React 规范

### 组件

- 函数组件优先，使用 `function` 声明而非箭头函数（如 `export function RecipePage() {}`）
- Props 使用 `interface` 定义，置于组件上方
- 组件文件与组件同名（PascalCase），一个文件只导出一个主组件
- 页面组件放 `src/pages/`，可复用 UI 组件放 `src/components/`

### Hooks

- 自定义 Hook 以 `use` 前缀命名，放在 `src/hooks/` 目录
- Hook 负责数据获取 + 状态管理，通过 `fetchJson` 工具加载数据
- Hook 返回统一结构：`{ data, loading, error }` 模式
- 支持模块级缓存变量避免重复请求（参考 `useRecipeIndex` 的 `cachedRecipes` 模式）

### 状态管理

- 无全局状态管理库，所有状态用 `useState` 管理
- 跨页面数据通过路由参数传递（`useParams`）
- 数据缓存在 hooks 层的模块级变量或 `fetcher.ts` 内存缓存中

### 样式

- 使用 Tailwind CSS 4 + `@theme` CSS 变量体系
- 颜色必须使用 CSS 变量：`var(--color-bg)`、`var(--color-accent)` 等，禁止硬编码颜色值到类名中
- 字体使用工具类 `.font-title`（serif）和默认 sans 字体
- 阴影使用工具类 `.card-shadow`、`.search-bar-shadow`
- 移动端适配：`body` 限制 `max-width: 480px` 居中

### 路由

- 使用 `react-router-dom` v7 的 `BrowserRouter` + `Routes`
- 非首页的页面组件使用 `lazy()` + `Suspense` 按需加载
- 路由参数中的 id 需要 `encodeURIComponent` / `decodeURIComponent` 处理

## 文件组织

```
src/
├── pages/          # 页面级组件（与路由一一对应）
├── components/     # 可复用 UI 组件
├── hooks/          # 自定义数据 Hooks
├── types/          # TypeScript 类型定义
├── utils/          # 纯工具函数（无副作用）
├── styles/         # 全局样式和主题变量
├── assets/         # 静态资源（图片等）
├── App.tsx         # 路由配置入口
└── main.tsx        # 应用挂载入口
```
