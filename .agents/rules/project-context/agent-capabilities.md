# Agent 能力规范

本文件定义 Agent 在当前项目中可使用的底层能力及其约束。
Agent 在编写代码时必须遵循这些封装规范，不得绕过已有封装直接使用底层库。

## 网络请求

- **统一封装**: `src/utils/fetcher.ts` 的 `fetchJson<T>(path: string)` 函数
- 所有数据加载必须通过 `fetchJson` 发起，禁止直接使用原生 `fetch`
- `fetchJson` 内置内存缓存（Map），相同 path 只发一次请求
- 数据源为 `/data/` 目录下的静态 JSON 文件，无需鉴权
- 使用模式：`const data = await fetchJson<TypeName>('/data/xxx.json')`

## UI 组件

- 无第三方组件库，所有 UI 均为自研组件
- 可复用组件放在 `src/components/` 目录
- 页面级组件放在 `src/pages/` 目录
- 组件 Props 必须定义 `interface`，置于组件上方
- 已有组件清单：
  - `RecipeCard` — 菜品卡片（含图片、标题、描述、卡路里、难度）
  - `RecipeList` — 菜品列表容器
  - `CategoryTag` — 分类标签
  - `SearchBar` — 搜索输入框
  - `BackButton` — 返回按钮
  - `Loading` — 加载态骨架屏

## 路由

- 方案：`react-router-dom` v7 + `BrowserRouter`
- 路由配置位于 `src/App.tsx`
- 新增页面需：1) 创建页面组件 2) 在 App.tsx 中用 `lazy()` 注册路由
- 路由参数通过 `useParams<{ id: string }>()` 获取
- id 参数需 `encodeURIComponent`/`decodeURIComponent` 编解码
- 现有路由：
  - `/` → `HomePage`（非 lazy，首屏直出）
  - `/search` → `SearchResultPage`（lazy）
  - `/category/:id` → `CategoryPage`（lazy）
  - `/recipe/:id` → `RecipePage`（lazy）

## 样式

- **方案**: Tailwind CSS 4 + `@theme` CSS 变量
- **主题变量**（定义在 `src/styles/index.css`）：
  - 背景: `--color-bg`、`--color-card`、`--color-search-bg`
  - 文字: `--color-text-primary`、`--color-text-secondary`
  - 强调: `--color-accent`（绿色 #7BA05B）、`--color-accent-warm`（橙色 #C4956A）
  - 分割线: `--color-divider`
  - 字体: `--font-serif`（Noto Serif SC）、`--font-sans`（Noto Sans SC）
- **自定义工具类**：`.font-title`（serif 字体）、`.card-shadow`、`.search-bar-shadow`
- **颜色规则**: 禁止在 className 中硬编码色值，必须使用 CSS 变量（`var(--color-xxx)`）
- **布局约束**: `body` 设置 `max-width: 480px` 居中，面向移动端

## 构建工具

- **构建工具**: Vite 8 + `@vitejs/plugin-react` + `@tailwindcss/vite`
- **TypeScript**: `tsc -b` 类型检查 + Vite 编译
- **开发命令**: `npm run dev`（含 `--host` 局域网可访问）
- **数据同步**: `npm run sync`（执行 `scripts/build.ts`，将源数据构建为静态 JSON）

## 工具函数

- 工具函数放在 `src/utils/` 目录
- 已有工具：
  - `fetcher.ts` — 带缓存的 JSON 数据获取
  - `color.ts` — 卡路里/难度颜色分级（`getCaloriesColor`、`getDifficultyColor`）
- 工具函数必须是纯函数，无副作用
- 新增工具前先检查 `src/utils/` 是否已有类似实现
- 项目已引入的外部工具库：`fuse.js`（模糊搜索）、`marked`（Markdown 解析）

## 类型系统

- 类型定义统一放在 `src/types/` 目录
- 核心数据模型定义在 `src/types/recipe.ts`：
  - `Recipe` — 完整菜谱（含 ingredients、steps、tips）
  - `RecipeIndexItem` — 索引列表项（轻量）
  - `CategoryMeta` — 分类元数据
  - `CategoryRecipeItem` — 分类下的菜谱项
  - `Ingredient`、`Step` — 子结构
- Hook 内部返回类型用 `interface` 定义在 hook 文件内
- 使用 `import type` 导入纯类型
