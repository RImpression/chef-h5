# 🍳 食光 — 移动端菜谱应用

一款日式禅意风格的移动端菜谱 H5 应用，基于开源菜谱仓库 [HowToCook](https://github.com/Anduin2017/HowToCook) 的数据构建。

## 预览

- **首页**：品牌展示、分类导航、烹饪技巧入口、随机推荐
- **搜索**：基于 Fuse.js 的模糊搜索，支持菜名和食材关键词
- **分类浏览**：10 大分类（主食、荤菜、素菜、汤品、早餐、饮品、甜品、水产、半成品、酱料）
- **菜品详情**：Markdown 渲染，支持图片、表格、引用等丰富内容
- **烹饪技巧**：17 篇教学文章，涵盖厨房准备、基础技法、高级技巧等

## 技术栈

- **框架**：React 19 + TypeScript + Vite
- **样式**：TailwindCSS 4
- **路由**：React Router 7
- **搜索**：Fuse.js（客户端模糊搜索）
- **Markdown**：marked（菜谱详情 & 技巧文章渲染）
- **数据构建**：自定义 Node.js 脚本，从 HowToCook 仓库解析 Markdown → JSON

## 数据来源

菜谱数据来源于开源项目 **[Anduin2017/HowToCook](https://github.com/Anduin2017/HowToCook)**（程序员做饭指南），遵循其 [Unlicense](https://github.com/Anduin2017/HowToCook/blob/master/LICENSE) 开源协议。

构建脚本会自动 clone 该仓库到 `.cache/HowToCook/`，解析 `dishes/` 和 `tips/` 目录下的 Markdown 文件，生成结构化的 JSON 数据供前端使用。图片资源通过 GitHub Media URL 直接引用。

## 快速开始

### 安装依赖

```bash
npm install
```

### 同步数据

首次运行或需要更新菜谱数据时，执行数据构建脚本：

```bash
npm run sync
```

该命令会：
1. 自动 clone / 更新 HowToCook 仓库到 `.cache/`
2. 解析所有菜谱 Markdown 文件（364+ 道菜谱）
3. 解析烹饪技巧文章（17 篇）
4. 生成 `public/data/` 目录下的 JSON 数据文件

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
chef-h5/
├── public/
│   ├── data/                # 构建生成的 JSON 数据
│   │   ├── index.json       # 菜谱索引
│   │   ├── categories.json  # 分类列表
│   │   ├── tips.json        # 技巧索引
│   │   ├── recipes/         # 各菜谱详情 JSON
│   │   └── tips/            # 各技巧文章 JSON
│   ├── icons/               # 分类 & 技巧模块图标
│   ├── logo.png             # 品牌 Logo
│   └── logo-text.png        # 品牌字体 Logo
├── scripts/
│   ├── build.ts             # 数据构建入口
│   ├── parse.ts             # 菜谱 Markdown 解析
│   ├── parseTips.ts         # 技巧文章解析
│   ├── sync.ts              # Git 仓库同步
│   └── utils.ts             # 构建工具函数
├── src/
│   ├── components/          # 通用组件
│   ├── hooks/               # 自定义 Hooks
│   ├── pages/               # 页面组件
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 前端工具函数
│   └── styles/              # 全局样式
├── DESIGN.md                # 详细设计文档
└── package.json
```

## 路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 分类导航、技巧入口、随机推荐 |
| `/search` | 搜索结果 | 模糊搜索菜谱 |
| `/category/:id` | 分类页 | 按分类浏览菜谱 |
| `/recipe/:id` | 菜品详情 | Markdown 渲染完整菜谱 |
| `/tips` | 烹饪技巧 | 技巧文章列表 |
| `/tips/:group/:id` | 技巧详情 | 单篇技巧文章 |

## 许可证

本项目代码部分采用 MIT 许可证。菜谱数据版权归 [HowToCook](https://github.com/Anduin2017/HowToCook) 项目所有，遵循 Unlicense 协议。
