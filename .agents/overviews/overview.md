## 如何使用本索引

1. 通过本文件理解项目背景、技术栈和模块边界。
2. 若已经能判断任务影响范围，可直接进入对应源码目录。
3. 若模块映射不明确，再读取 `.agents/overviews/glossary.md`。
4. 本文件负责"背景与边界"，不承载硬性规则正文。

## project-intro

- **Summary**: "食光" — 一款移动端菜谱浏览 H5 应用。基于静态 JSON 数据提供菜品浏览、分类筛选、模糊搜索、随机推荐等功能。面向移动端（max-width 480px），无后端依赖。

## tech-stack

- **核心框架**: React 19 + TypeScript 6
- **构建工具**: Vite 8 + @vitejs/plugin-react
- **样式方案**: Tailwind CSS 4（@theme CSS 变量主题）
- **路由**: react-router-dom 7（BrowserRouter + lazy 加载）
- **搜索**: fuse.js（客户端模糊搜索）
- **Markdown**: marked（菜谱原始内容解析）
- **代码质量**: ESLint 10 + typescript-eslint

## source-structure

```
src/
├── pages/          # 4 个页面（Home / Search / Category / Recipe）
├── components/     # 6 个可复用组件（RecipeCard / RecipeList / CategoryTag / SearchBar / BackButton / Loading）
├── hooks/          # 4 个数据 Hooks（useRecipeIndex / useRecipe / useCategory / useSearch）
├── types/          # 类型定义（recipe.ts）
├── utils/          # 工具函数（fetcher.ts / color.ts）
├── styles/         # 全局样式 + 主题变量（index.css）
├── assets/         # 静态资源
├── App.tsx         # 路由配置
└── main.tsx        # 入口挂载
scripts/
└── build.ts        # 数据同步脚本（npm run sync）
public/
└── data/           # 构建产物：静态 JSON 数据文件
```

## data-flow

- 数据源：`/public/data/` 下的静态 JSON（通过 `npm run sync` 从菜谱源数据生成）
- 获取方式：`fetchJson` 工具（带内存缓存）→ 自定义 Hooks → 页面组件
- 无后端 API、无鉴权、无全局状态管理库

## dev-guide

- **安装依赖**: `npm install`
- **启动开发**: `npm run dev`（含 `--host` 局域网可访问）
- **同步数据**: `npm run sync`（首次启动或菜谱更新后需执行）
- **构建生产**: `npm run build`（tsc 类型检查 + Vite 打包）
- **代码检查**: `npm run lint`
