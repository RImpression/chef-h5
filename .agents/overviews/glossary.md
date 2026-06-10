# Glossary

## 使用方式

1. 当用户输入的是业务词、产品词、页面别名，而不是明确代码路径时，优先在这里做映射。
2. glossary 负责"术语 → 模块/目录"的桥接，不承载规则正文。
3. 如果一个词汇已经能被 `overview.md` 明确覆盖，则不必重复展开。

## 术语映射

### 食光（Chef H5）

- **别名**: chef-h5、菜谱应用、食谱 App
- **说明**: 基于静态 JSON 数据的移动端菜谱浏览 H5 应用，主打"用心料理，感受食光"

### 首页（HomePage）

- **别名**: 主页、推荐页
- **主要目录**: `src/pages/HomePage.tsx`
- **说明**: 展示品牌区域、分类标签网格、随机一道菜按钮、今日推荐列表
- **依赖**: `useRecipeIndex`, `CategoryTag`, `RecipeList`

### 菜谱详情页（RecipePage）

- **别名**: 菜品页、食谱页、recipe 页
- **主要目录**: `src/pages/RecipePage.tsx`
- **说明**: 展示单个菜谱的完整信息：图片、描述、卡路里/难度/分类、食材清单（可勾选）、烹饪步骤、小贴士
- **依赖**: `useRecipe`

### 分类页（CategoryPage）

- **别名**: 类目页
- **主要目录**: `src/pages/CategoryPage.tsx`
- **说明**: 按分类展示菜谱列表
- **依赖**: `useCategory`, `useRecipeIndex`, `RecipeList`

### 搜索结果页（SearchResultPage）

- **别名**: 搜索页
- **主要目录**: `src/pages/SearchResultPage.tsx`
- **说明**: 基于 fuse.js 模糊搜索菜谱并展示结果
- **依赖**: `useRecipeIndex`, `useSearch`, `RecipeList`

### 数据获取层（fetcher）

- **别名**: 请求工具、fetch 封装
- **主要目录**: `src/utils/fetcher.ts`
- **说明**: 带内存缓存的 fetchJson 工具函数，用于加载 `/data/` 下的静态 JSON 文件
- **被依赖**: 所有 hooks

### 自定义 Hooks

- **别名**: hooks 层、数据 hooks
- **主要目录**: `src/hooks/`
- **说明**: 封装数据加载逻辑，包括 `useRecipeIndex`（索引+分类）、`useRecipe`（单菜谱）、`useCategory`（分类菜谱）、`useSearch`（模糊搜索）
- **依赖**: `fetcher.ts`, `types/recipe.ts`
- **被依赖**: 所有页面组件

### 公共组件

- **别名**: 组件库、UI 组件
- **主要目录**: `src/components/`
- **说明**: 可复用 UI 组件，包括 `RecipeCard`（菜品卡片）、`RecipeList`（菜品列表）、`CategoryTag`（分类标签）、`SearchBar`（搜索输入框）、`BackButton`（返回按钮）、`Loading`（加载态）

### 类型定义（recipe types）

- **别名**: 数据模型、TS 类型
- **主要目录**: `src/types/recipe.ts`
- **说明**: 定义所有数据结构：`Recipe`、`RecipeIndexItem`、`CategoryMeta`、`CategoryRecipeItem`、`Ingredient`、`Step`，以及 `getDifficultyLabel` 工具函数

### 工具函数（utils）

- **别名**: 公共工具
- **主要目录**: `src/utils/`
- **说明**: `fetcher.ts`（数据获取+缓存）、`color.ts`（卡路里/难度颜色分级函数）

### 样式系统

- **别名**: 主题、CSS 变量、设计体系
- **主要目录**: `src/styles/index.css`
- **说明**: 基于 Tailwind CSS 4 的 `@theme` 定义 CSS 变量主题（颜色、字体），配合自定义工具类（`.font-title`、`.card-shadow`、`.search-bar-shadow`）

### 数据同步脚本

- **别名**: build 脚本、sync 命令
- **主要目录**: `scripts/build.ts`
- **说明**: 通过 `npm run sync` 执行，将菜谱源数据构建为 `/public/data/` 下的静态 JSON 文件
