## 如何使用本索引

1. 通过本文件理解项目背景、技术栈和模块边界。
2. 若已经能判断任务影响范围，可直接进入对应源码目录。
3. 若模块映射不明确，再读取 `.agents/overviews/glossary.md`。
4. 本文件负责"背景与边界"，不承载硬性规则正文。

## project-intro

- **Summary**: "食光" — 一款日式禅意风格的移动端菜谱 H5 应用。基于开源项目 [HowToCook](https://github.com/Anduin2017/HowToCook) 的数据构建，通过静态 JSON 提供菜品浏览、分类筛选、模糊搜索、随机推荐、烹饪技巧阅读等功能。面向移动端（max-width 480px），无后端依赖。已部署至 Vercel。

## tech-stack

- **核心框架**: React 19 + TypeScript 6
- **构建工具**: Vite 8 + @vitejs/plugin-react
- **样式方案**: Tailwind CSS 4（@theme CSS 变量主题）
- **路由**: react-router-dom 7（BrowserRouter + lazy 加载）
- **搜索**: fuse.js（客户端模糊搜索）
- **Markdown**: marked（菜品详情 + 技巧文章渲染）
- **代码质量**: ESLint 10 + typescript-eslint
- **部署**: Vercel（GitHub 仓库关联，自动 CI/CD）

## source-structure

```
src/
├── pages/              # 6 个页面
│   ├── HomePage.tsx        # 首页（品牌、分类、技巧入口、随机推荐）
│   ├── SearchResultPage.tsx # 搜索结果页
│   ├── CategoryPage.tsx    # 分类页
│   ├── RecipePage.tsx      # 菜品详情页（Markdown 渲染）
│   ├── TipsPage.tsx        # 烹饪技巧首页
│   └── TipArticlePage.tsx  # 技巧文章详情页（Markdown 渲染）
├── components/         # 7 个可复用组件
│   ├── RecipeCard.tsx      # 菜品卡片
│   ├── RecipeList.tsx      # 菜品列表
│   ├── CategoryTag.tsx     # 分类标签（图片图标）
│   ├── SearchBar.tsx       # 搜索输入框
│   ├── BackButton.tsx      # 返回按钮
│   ├── Loading.tsx         # 加载态
│   ├── TipCard.tsx         # 技巧文章卡片
│   └── icons/
│       └── CategoryIcons.tsx # 分类 SVG 图标 & BrandLogo
├── hooks/              # 6 个数据 Hooks
│   ├── useRecipeIndex.ts   # 菜谱索引 + 分类（带模块级缓存）
│   ├── useRecipe.ts        # 单菜谱详情
│   ├── useCategory.ts      # 分类下菜谱列表
│   ├── useSearch.ts        # Fuse.js 模糊搜索
│   ├── useTipsIndex.ts     # 技巧分组索引（带模块级缓存）
│   └── useTipArticle.ts   # 单篇技巧文章
├── types/              # TypeScript 类型定义
│   ├── recipe.ts           # 菜谱相关类型
│   └── tip.ts              # 技巧文章相关类型
├── utils/              # 工具函数
│   ├── fetcher.ts          # 带内存缓存的 JSON 获取
│   └── color.ts            # 卡路里/难度颜色分级
├── styles/
│   └── index.css           # 全局样式 + 主题变量 + Markdown 渲染样式
├── App.tsx             # 路由配置（6 条路由）
└── main.tsx            # 入口挂载

scripts/                # 数据构建脚本
├── build.ts            # 构建入口（编排同步+解析+输出）
├── sync.ts             # Git 仓库克隆/更新
├── parse.ts            # 菜谱 Markdown → JSON（含图片路径转 GitHub URL）
├── parseTips.ts        # 技巧文章 Markdown → JSON
└── utils.ts            # 解析工具函数（标题/段落提取、食材/步骤解析等）

public/
├── data/               # 构建产物：静态 JSON 数据
│   ├── index.json          # 菜谱索引
│   ├── categories.json     # 分类列表
│   ├── tips.json           # 技巧分组索引
│   ├── recipes/            # 各菜谱详情 JSON（含 rawMarkdown）
│   └── tips/               # 各技巧文章 JSON（含 rawMarkdown）
├── icons/
│   ├── categories/         # 分类图标（PNG，手绘风）
│   └── tips/               # 技巧模块图标
├── logo.png            # 品牌 Logo
└── logo-text.png       # 品牌字体 Logo
```

## routes

| 路径 | 页面 | 加载方式 |
|------|------|----------|
| `/` | HomePage | 直出（非 lazy） |
| `/search` | SearchResultPage | lazy |
| `/category/:id` | CategoryPage | lazy |
| `/recipe/:id` | RecipePage | lazy |
| `/tips` | TipsPage | lazy |
| `/tips/:group/:id` | TipArticlePage | lazy |

## data-flow

- **数据源**: 开源项目 [Anduin2017/HowToCook](https://github.com/Anduin2017/HowToCook)，通过 `npm run sync` 自动 clone 到 `.cache/HowToCook/`
- **构建流程**: `scripts/build.ts` → 解析 Markdown → 生成 `public/data/` 下的静态 JSON
- **获取方式**: `fetchJson` 工具（带内存缓存）→ 自定义 Hooks（带模块级缓存）→ 页面组件
- **Markdown 渲染**: 菜品详情和技巧文章均使用 `marked` 渲染原始 Markdown（`rawMarkdown` 字段）
- **图片处理**: 构建时将 Markdown 中的相对图片路径 `./xxx.jpg` 转为 GitHub Media URL
- 无后端 API、无鉴权、无全局状态管理库

## dev-guide

- **安装依赖**: `npm install`
- **启动开发**: `npm run dev`（含 `--host` 局域网可访问）
- **同步数据**: `npm run sync`（首次启动或菜谱更新后需执行）
- **构建生产**: `npm run build`（tsc 类型检查 + Vite 打包）
- **代码检查**: `npm run lint`
- **部署**: 推送到 GitHub `main` 分支，Vercel 自动部署
