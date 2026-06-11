# 🍳 今天吃什么 - H5 菜谱应用详细设计

## 一、项目概述

基于开源项目 [HowToCook](https://github.com/Anduin2017/HowToCook) 的菜谱数据，构建一个日式禅意风格的纯前端 H5 菜谱查询及教程应用。

### 设计风格

- **日式禅意极简风**：大量留白、莫兰迪色系、手绘线条风图标
- **无底部导航栏**：通过页面内交互完成所有导航
- **以搜索为核心**：首页视觉焦点聚焦于搜索框

### 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 |
| 构建 | Vite 5 |
| 语言 | TypeScript |
| 样式 | TailwindCSS 3 |
| 路由 | React Router v6 |
| 搜索 | Fuse.js |
| Markdown 解析 | marked |
| 数据同步 | Node.js 脚本 + simple-git |

---

## 二、架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────┐
│                    构建阶段                          │
│                                                     │
│  HowToCook Repo ──git pull──▶ sync 脚本             │
│                               │                     │
│                    ┌──────────┼──────────┐           │
│                    ▼          ▼          ▼           │
│              index.json  categories/  recipes/       │
│              (轻量索引)  (分类摘要)   (完整菜谱)      │
│                    │          │          │           │
│                    └──────────┼──────────┘           │
│                               ▼                     │
│                       public/data/                   │
└─────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────┐
│                    运行阶段                          │
│                                                     │
│  用户访问 ──▶ 首页（加载 index.json ~20KB gzip）     │
│          ──▶ 搜索（Fuse.js 基于 index.json 检索）    │
│          ──▶ 分类（懒加载 categories/*.json）        │
│          ──▶ 详情（懒加载 recipes/*.json）           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2.2 目录结构

```
chef-h5/
├── public/
│   └── data/                    # 构建生成的静态数据（gitignore）
│       ├── index.json           # 轻量索引（id, title, category, tags）
│       ├── categories.json      # 分类元信息
│       ├── categories/          # 按分类拆分的菜谱列表
│       │   ├── home-cooking.json
│       │   ├── soup.json
│       │   └── ...
│       └── recipes/             # 单个菜谱完整数据
│           ├── xi-hong-shi-chao-ji-dan.json
│           └── ...
├── scripts/                     # 数据同步与构建脚本
│   ├── sync.ts                  # 拉取/更新 HowToCook 仓库
│   ├── parse.ts                 # 解析 md → 结构化数据
│   ├── build.ts                 # 编排：sync → parse → 输出 JSON
│   └── utils.ts                 # 脚本工具函数（拼音转换等）
├── src/
│   ├── main.tsx                 # 应用入口
│   ├── App.tsx                  # 根组件 + 路由配置
│   ├── components/              # 通用组件
│   │   ├── SearchBar.tsx        # 搜索框组件
│   │   ├── CategoryTag.tsx      # 分类标签组件
│   │   ├── RecipeCard.tsx       # 菜谱卡片组件
│   │   ├── RecipeList.tsx       # 菜谱列表组件
│   │   ├── BackButton.tsx       # 返回按钮组件
│   │   └── Loading.tsx          # 加载状态组件
│   ├── pages/                   # 页面组件
│   │   ├── HomePage.tsx         # 首页
│   │   ├── SearchResultPage.tsx # 搜索结果页
│   │   ├── CategoryPage.tsx     # 分类详情页
│   │   └── RecipePage.tsx       # 菜谱详情页
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useRecipeIndex.ts    # 加载与缓存索引数据
│   │   ├── useSearch.ts         # Fuse.js 搜索逻辑
│   │   ├── useCategory.ts      # 分类数据懒加载
│   │   └── useRecipe.ts        # 单个菜谱懒加载
│   ├── types/                   # TypeScript 类型定义
│   │   └── recipe.ts           # 菜谱相关类型
│   ├── utils/                   # 工具函数
│   │   └── fetcher.ts          # 数据 fetch 封装
│   └── styles/
│       └── index.css            # 全局样式 + TailwindCSS 入口
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
└── DESIGN.md
```

---

## 三、数据模型设计

### 3.1 菜谱索引项（index.json）

```typescript
interface RecipeIndexItem {
  id: string;            // 唯一标识，基于文件路径生成（如 "home-cooking/xi-hong-shi-chao-ji-dan"）
  title: string;         // 菜名（如 "西红柿炒鸡蛋"）
  category: string;      // 分类标识（如 "home-cooking"）
  categoryName: string;  // 分类中文名（如 "家常菜"）
  tags: string[];        // 关键词标签（食材 + 菜名分词）
}
```

首屏仅加载此文件，预估 200+ 道菜约 **80KB 原始 / 20KB gzip**。

### 3.2 分类元信息（categories.json）

```typescript
interface CategoryMeta {
  id: string;            // 分类标识
  name: string;          // 中文名
  icon: string;          // 线条风图标标识
  count: number;         // 菜谱数量
}
```

### 3.3 分类菜谱列表（categories/{id}.json）

```typescript
interface CategoryRecipeItem {
  id: string;
  title: string;
  description: string;   // 简介（取 md 前 50 字）
  ingredients: string[];  // 主要食材（前 5 个）
}
```

### 3.4 完整菜谱（recipes/{id}.json）

```typescript
interface Recipe {
  id: string;
  title: string;
  category: string;
  categoryName: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  tips: string[];
  rawMarkdown: string;    // 原始 md 内容（备用渲染）
}

interface Ingredient {
  name: string;
  amount: string;
}

interface Step {
  order: number;
  content: string;
  image?: string;
}
```

---

## 四、页面设计

### 4.1 首页（HomePage）

```
┌─────────────────────────────────┐
│          (大量留白)              │
│                                 │
│                                 │
│         🍙                      │  ← 手绘线条风图标
│        食 光                    │  ← 品牌名，衬线体
│     探索每一道家常味            │  ← 副标题，浅灰色小字
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🔍 想吃点什么...           │  │  ← 大搜索框，圆角，轻阴影
│  └───────────────────────────┘  │
│                                 │
│  ╭──╮ ╭──╮ ╭──╮ ╭──╮ ╭──╮    │
│  │家│ │汤│ │凉│ │甜│ │早│    │  ← 分类图标（线条手绘风）
│  │常│ │品│ │菜│ │品│ │餐│    │
│  ╰──╯ ╰──╯ ╰──╯ ╰──╯ ╰──╯    │
│                                 │
│  ─── ✿ 随机推荐 ✿ ───          │  ← 分隔线
│                                 │
│  ┌─────────────────────────┐   │
│  │  西红柿炒鸡蛋             │   │  ← 推荐卡片，轻描边
│  │  番茄 · 鸡蛋 · 15分钟     │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  可乐鸡翅                 │   │
│  │  鸡翅 · 可乐 · 30分钟     │   │
│  └─────────────────────────┘   │
│                                 │
│     🎲 换一批                   │  ← 点击刷新随机推荐
│                                 │
└─────────────────────────────────┘
```

**交互说明**：
- 搜索框点击后自动聚焦，输入即搜索（debounce 300ms），搜索结果在当前页下方实时展示
- 分类图标点击后跳转至分类详情页
- 随机推荐每次展示 2-3 道菜，点击"换一批"刷新
- 向下滚动时搜索框吸顶

### 4.2 搜索结果页（SearchResultPage）

```
┌─────────────────────────────────┐
│  ← 返回     🔍 西红柿           │  ← 顶部搜索栏（可编辑）
│─────────────────────────────────│
│  找到 5 道相关菜谱               │
│                                 │
│  ┌─────────────────────────┐   │
│  │  西红柿炒鸡蛋             │   │
│  │  家常菜 · 番茄 鸡蛋        │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │  西红柿鸡蛋汤             │   │
│  │  汤品 · 番茄 鸡蛋          │   │
│  └─────────────────────────┘   │
│  ...                            │
│                                 │
│  ─── 没有更多了 ───             │
└─────────────────────────────────┘
```

**交互说明**：
- 使用 Fuse.js 模糊搜索，支持菜名 + 食材关键词匹配
- 结果实时更新，无需点击搜索按钮
- 点击卡片进入菜谱详情

### 4.3 分类详情页（CategoryPage）

```
┌─────────────────────────────────┐
│  ← 返回          家常菜 (32)    │  ← 分类名 + 数量
│─────────────────────────────────│
│                                 │
│  ┌─────────────────────────┐   │
│  │  西红柿炒鸡蛋             │   │
│  │  番茄 · 鸡蛋 · 葱          │   │
│  └─────────────────────────┘   │
│  ┌─────────────────────────┐   │
│  │  青椒炒肉                 │   │
│  │  青椒 · 猪肉              │   │
│  └─────────────────────────┘   │
│  ...                            │
│                                 │
└─────────────────────────────────┘
```

### 4.4 菜谱详情页（RecipePage）

```
┌─────────────────────────────────┐
│  ← 返回              家常菜     │
│─────────────────────────────────│
│                                 │
│     西红柿炒鸡蛋                │  ← 菜名，衬线体大字
│     家常菜 · 简单 · 15分钟      │  ← 标签信息
│                                 │
│  ─── 食材清单 ───               │
│                                 │
│  ○ 西红柿  2个                  │  ← 可勾选（纯前端状态）
│  ○ 鸡蛋    3个                  │
│  ○ 葱      适量                 │
│  ○ 盐      适量                 │
│                                 │
│  ─── 烹饪步骤 ───               │
│                                 │
│  𝟏                              │
│  西红柿洗净切块，鸡蛋打散        │
│  加少许盐搅拌均匀                │
│                                 │
│  𝟐                              │
│  锅中倒油，油热后倒入蛋液        │
│  翻炒至凝固后盛出备用            │
│                                 │
│  𝟑                              │
│  锅中再倒少许油，放入西红柿      │
│  翻炒出汁后加入鸡蛋              │
│                                 │
│  ─── 小贴士 ───                 │
│  · 西红柿要炒出汁才好吃          │
│                                 │
└─────────────────────────────────┘
```

**交互说明**：
- 食材清单支持勾选（方便购物对照），状态保持在当前会话
- 步骤分步展示，大字号易读
- 有图片的步骤展示对应图片

---

## 五、数据同步脚本设计

### 5.1 同步流程

```
npm run sync
    │
    ├── 1. sync.ts
    │   ├── 检查 .cache/HowToCook 是否存在
    │   ├── 不存在 → git clone --depth 1
    │   └── 存在 → git pull
    │
    ├── 2. parse.ts
    │   ├── 遍历 dishes/**/*.md
    │   ├── 对每个 md 文件：
    │   │   ├── 提取标题（# 开头的第一行）
    │   │   ├── 提取食材清单（"## 必备原料和工具" 或类似标题下的列表）
    │   │   ├── 提取步骤（"## 操作" 或类似标题下的有序列表）
    │   │   ├── 提取小贴士（"## 附加内容" 下的内容）
    │   │   └── 生成 id（目录路径 + 拼音化文件名）
    │   └── 输出结构化数据数组
    │
    └── 3. build.ts
        ├── 生成 public/data/index.json（轻量索引）
        ├── 生成 public/data/categories.json（分类元信息）
        ├── 按分类拆分 → public/data/categories/{id}.json
        ├── 按菜谱拆分 → public/data/recipes/{id}.json
        └── 输出统计信息（菜谱总数、分类数、数据大小）
```

### 5.2 npm scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "sync": "tsx scripts/build.ts",
    "sync:full": "tsx scripts/build.ts --full",
    "preview": "vite preview"
  }
}
```

---

## 六、首屏性能优化策略

| 策略 | 实现方式 | 预期效果 |
|------|----------|----------|
| **数据分片** | index.json 仅含标题/分类/标签，详情按需加载 | 首屏数据量 < 30KB (gzip) |
| **路由懒加载** | React.lazy + Suspense 拆分页面组件 | 首屏 JS < 60KB (gzip) |
| **搜索索引预热** | 首屏加载 index.json 后立即初始化 Fuse.js 实例 | 搜索响应 < 50ms |
| **数据缓存** | 已加载的分类/菜谱数据缓存在内存中 | 二次访问零延迟 |
| **TailwindCSS Purge** | 构建时自动移除未使用的 CSS | CSS < 10KB (gzip) |
| **Vite 优化** | 代码拆分 + gzip 压缩 + 预加载 | 总资源 < 100KB |

**首屏加载预估**：

```
index.html          ~1KB
main.js (gzip)      ~50KB (React + Router + Fuse.js)
index.css (gzip)    ~8KB  (TailwindCSS purged)
index.json (gzip)   ~20KB (菜谱索引)
──────────────────────────
总计                 ~79KB → 3G 网络 < 1s，4G/WiFi < 0.3s
```

---

## 七、设计规范

### 7.1 色彩系统

| 用途 | 色值 | 说明 |
|------|------|------|
| 背景色 | `#FAFAF7` | 米白，温暖纸质感 |
| 卡片背景 | `#FFFFFF` | 纯白 |
| 主文字 | `#2D3436` | 深灰，柔和不刺眼 |
| 副文字 | `#A0A4A8` | 浅灰 |
| 主色调 | `#7BA05B` | 鼠尾草绿，自然清新 |
| 辅助色 | `#C4956A` | 暖棕，大地色系 |
| 分隔线 | `#E8E4DF` | 极浅暖灰 |
| 搜索框背景 | `#F5F3EF` | 浅暖灰 |

### 7.2 字体

```css
font-family:
  "Noto Serif SC",          /* 中文衬线 - 标题 */
  "Noto Sans SC",           /* 中文无衬线 - 正文 */
  "Georgia", serif;         /* 英文衬线回退 */
```

- **品牌标题**：Noto Serif SC, 28px, font-weight 700
- **页面标题**：Noto Serif SC, 22px, font-weight 600
- **正文**：Noto Sans SC, 15px, font-weight 400
- **辅助文字**：Noto Sans SC, 13px, font-weight 300

### 7.3 间距与圆角

- 页面边距：`24px`
- 卡片圆角：`12px`
- 搜索框圆角：`24px`（全圆角）
- 标签圆角：`16px`
- 卡片间距：`16px`
- 卡片内边距：`16px 20px`

### 7.4 阴影

```css
/* 卡片阴影 - 极轻 */
box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

/* 搜索框阴影 */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

/* 搜索框聚焦阴影 */
box-shadow: 0 2px 12px rgba(123, 160, 91, 0.15);
```

---

## 八、路由设计

| 路径 | 页面 | 数据加载 |
|------|------|----------|
| `/` | 首页 | index.json（首屏） |
| `/search?q=xxx` | 搜索结果 | 基于已加载的 index.json |
| `/category/:id` | 分类详情 | 懒加载 categories/{id}.json |
| `/recipe/:id` | 菜谱详情 | 懒加载 recipes/{id}.json |

---

## 九、部署方案

- **推荐**：Vercel / Netlify（GitHub 推送自动部署）
- **备选**：GitHub Pages
- **构建流程**：`npm run sync && npm run build`
- **CI 配置**：可设置定时任务（如每周一次）自动 sync + 重新部署

---

## 十、后续可扩展方向

1. **PWA 离线支持**：Service Worker 缓存已访问过的菜谱
2. **收藏功能**：基于 localStorage 实现本地收藏
3. **深色模式**：TailwindCSS dark mode 一键切换
4. **食材搜索增强**："冰箱里有什么就做什么" 多食材交集搜索
5. **分享功能**：生成菜谱卡片图片，分享到社交平台
6. **烹饪技巧模块**：迁入 HowToCook tips 目录的教学内容（详见第十一节）

---

## 十一、烹饪技巧模块设计

### 11.1 数据分析

HowToCook 仓库 `tips/` 目录包含 **17 篇** Markdown 教学文章，天然分为 4 个主题分组：

| 分组 | 目录位置 | 文章数 | 内容概述 |
|------|----------|--------|----------|
| 🔧 厨房准备 | `tips/厨房准备.md` | 1 | 厨房基础物品清单、工具准备 |
| 🤔 选择吃什么 | `tips/如何选择现在吃什么.md` | 1 | 用数学方式决策吃什么 |
| 📖 基础学习 | `tips/learn/*.md` | 11 | 去腥、凉拌、炒煎、焯水、煮、腌、蒸、微波炉、空气炸锅、食品安全、高压力锅 |
| 🎓 高级技巧 | `tips/advanced/*.md` | 4 | 油温判断、糖色炒制、辅料技巧、专业术语 |

各文章行数分布（5~171 行），均为纯 Markdown 文本，无图片依赖。

### 11.2 数据模型

```typescript
/** 技巧分组 */
interface TipGroup {
  id: string;           // 分组标识：preparation / decision / learn / advanced
  name: string;         // 中文名："厨房准备" / "选择吃什么" / "基础学习" / "高级技巧"
  icon: string;         // emoji 图标
  description: string;  // 分组简介
  articles: TipArticleMeta[];
}

/** 技巧文章索引项 */
interface TipArticleMeta {
  id: string;           // 文章标识（拼音化文件名，如 "learn/qu-xing"）
  title: string;        // 文章标题（从 Markdown # 提取）
  group: string;        // 所属分组 id
  summary: string;      // 摘要（正文前 60 字）
}

/** 技巧文章完整数据 */
interface TipArticle extends TipArticleMeta {
  content: string;      // 完整 Markdown 正文
  sections: TipSection[];  // 二级标题拆分的段落
}

/** 文章段落（按 ## 拆分） */
interface TipSection {
  title: string;        // 段落标题
  content: string;      // 段落 Markdown 内容
}
```

### 11.3 数据文件结构

构建脚本产出以下静态 JSON 文件，与现有菜谱数据目录平行：

```
public/data/
├── tips.json                    # 技巧索引（所有分组 + 文章元信息，~3KB）
└── tips/                        # 单篇文章完整数据（按需懒加载）
    ├── preparation/
    │   └── chu-fang-zhun-bei.json
    ├── decision/
    │   └── ru-he-xuan-ze-chi-shen-me.json
    ├── learn/
    │   ├── qu-xing.json
    │   ├── xue-xi-liang-ban.json
    │   ├── xue-xi-chao-yu-jian.json
    │   ├── xue-xi-chao-shui.json
    │   ├── xue-xi-zhu.json
    │   ├── xue-xi-yan.json
    │   ├── xue-xi-zheng.json
    │   ├── wei-bo-lu.json
    │   ├── kong-qi-zha-guo.json
    │   ├── shi-pin-an-quan.json
    │   └── gao-ya-li-guo.json
    └── advanced/
        ├── you-wen-pan-duan-ji-qiao.json
        ├── tang-se-de-chao-zhi.json
        ├── fu-liao-ji-qiao.json
        └── gao-ji-zhuan-ye-shu-yu.json
```

### 11.4 构建脚本扩展

在现有 `scripts/` 中新增 `parseTips.ts`，负责：

1. 遍历 `.cache/HowToCook/tips/` 目录，按文件结构映射到 4 个分组
2. 解析每个 Markdown 文件：提取标题、摘要、按 `##` 拆分段落
3. 生成 `tips.json` 索引 + 各文章独立 JSON
4. 在 `build.ts` 中调用，与菜谱数据构建并行执行

```
npm run sync 扩展流程:
    │
    ├── parseAllRecipes()     ← 已有
    └── parseAllTips()        ← 新增
        ├── 遍历 tips/ 目录
        ├── 对每个 md: 提取标题、摘要、分段
        ├── 生成 public/data/tips.json
        └── 生成 public/data/tips/{group}/{id}.json
```

### 11.5 路由设计

新增 2 个路由，与现有路由体系一致：

| 路径 | 页面 | 数据加载 |
|------|------|----------|
| `/tips` | 技巧首页 | 加载 tips.json 索引 |
| `/tips/:group/:id` | 技巧文章详情 | 懒加载 tips/{group}/{id}.json |

### 11.6 页面设计

#### 11.6.1 技巧首页（TipsPage）

从首页新增入口（如导航区或分类区下方），进入技巧首页：

```
┌─────────────────────────────────┐
│  ← 返回          烹饪技巧       │
│─────────────────────────────────│
│                                 │
│  🔧 厨房准备                    │  ← 分组标题 + 图标
│  ┌─────────────────────────┐   │
│  │ 📋 厨房准备               │   │  ← 文章卡片，圆角轻阴影
│  │ 在阅读菜谱之前，假想你     │   │  ← 摘要灰字
│  │ 已经准备好了下列物品...     │   │
│  └─────────────────────────┘   │
│                                 │
│  🤔 选择吃什么                  │
│  ┌─────────────────────────┐   │
│  │ 🎯 如何决策吃什么          │   │
│  │ 用数学方式解决吃什么...     │   │
│  └─────────────────────────┘   │
│                                 │
│  📖 基础学习                    │
│  ┌──────────┐ ┌──────────┐    │  ← 双列网格
│  │ 去腥      │ │ 学习凉拌  │    │
│  │ 做菜的一  │ │ 凉拌是什  │    │
│  │ 道工序... │ │ 么...     │    │
│  └──────────┘ └──────────┘    │
│  ┌──────────┐ ┌──────────┐    │
│  │ 炒与煎    │ │ 焯水      │    │
│  └──────────┘ └──────────┘    │
│  ...                            │
│                                 │
│  🎓 高级技巧                    │
│  ┌──────────┐ ┌──────────┐    │
│  │ 油温判断  │ │ 糖色炒制  │    │
│  │ 技巧      │ │           │    │
│  └──────────┘ └──────────┘    │
│  ...                            │
│                                 │
└─────────────────────────────────┘
```

**布局说明**：
- 独立文章（厨房准备、选择吃什么）使用全宽单列卡片，突出显示
- 多文章分组（基础学习、高级技巧）使用双列网格卡片，紧凑展示
- 每张卡片展示标题 + 摘要前 40 字
- 分组标题左侧带 emoji 图标，使用与首页分类一致的排版风格

#### 11.6.2 技巧文章详情页（TipArticlePage）

```
┌─────────────────────────────────┐
│  ← 返回          基础学习       │  ← 所属分组名
│─────────────────────────────────│
│                                 │
│     去 腥                       │  ← 标题，衬线体大字
│     📖 基础学习                 │  ← 分组标签
│                                 │
│  ─── 目录 ───                   │  ← 文章目录（按 ## 生成）
│  · 什么情况需要去腥              │
│  · 去腥方法                     │
│  · 注意事项                     │
│                                 │
│  ─────────────                  │
│                                 │
│  去腥是做菜过程中的一道工序...    │  ← Markdown 渲染正文
│                                 │
│  ## 什么情况需要去腥             │
│  处理肉类、海鲜时...             │
│                                 │
│  ## 去腥方法                     │
│  1. 料酒去腥...                  │
│  2. 姜去腥...                    │
│                                 │
│  ─── ✿ ───                     │  ← 文末装饰分隔
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📖 上一篇：学习凉拌       │   │  ← 上下篇导航
│  │ 📖 下一篇：学习炒与煎     │   │
│  └─────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

**交互说明**：
- 正文使用 `marked` 渲染 Markdown（复用现有 RecipePage 的渲染逻辑）
- 目录点击锚点定位到对应段落
- 底部提供同分组内上/下一篇导航
- 长文支持返回顶部浮动按钮

### 11.7 首页入口设计

在首页分类区域下方、随机推荐上方，新增技巧模块入口：

```
│  ─── 🍳 烹饪技巧 ───           │  ← 分隔线
│                                 │
│  ┌──────────┐ ┌──────────┐    │  ← 横向滚动卡片
│  │ 🔧       │ │ 📖       │    │
│  │ 厨房准备  │ │ 基础学习  │    │
│  │ 4 篇技巧  │ │ 11 篇技巧 │    │
│  └──────────┘ └──────────┘    │
│              ··                 │  ← 滚动指示器
│       查看全部 →                │  ← 跳转 /tips
```

### 11.8 Hooks 设计

```typescript
// hooks/useTipsIndex.ts — 加载技巧索引
function useTipsIndex(): {
  groups: TipGroup[];
  loading: boolean;
  error: string | null;
}

// hooks/useTipArticle.ts — 加载单篇文章
function useTipArticle(group: string, id: string): {
  article: TipArticle | null;
  loading: boolean;
  error: string | null;
}
```

### 11.9 新增文件清单

| 文件路径 | 类型 | 说明 |
|----------|------|------|
| `scripts/parseTips.ts` | 构建脚本 | 解析 tips 目录，生成 JSON |
| `src/types/tip.ts` | 类型定义 | TipGroup / TipArticleMeta / TipArticle |
| `src/hooks/useTipsIndex.ts` | Hook | 加载技巧索引 |
| `src/hooks/useTipArticle.ts` | Hook | 加载单篇文章 |
| `src/pages/TipsPage.tsx` | 页面 | 技巧首页 |
| `src/pages/TipArticlePage.tsx` | 页面 | 技巧文章详情 |
| `src/components/TipCard.tsx` | 组件 | 技巧文章卡片 |

### 11.10 性能考量

- **tips.json 索引**：17 篇文章的元信息，预估 ~3KB（gzip < 1KB），可在首页一并预加载或 /tips 页首屏加载
- **单篇文章 JSON**：最大 171 行（高级专业术语），预估 ~8KB，按需懒加载
- **路由懒加载**：TipsPage 和 TipArticlePage 均使用 `React.lazy` 分包
- **不影响首屏**：技巧模块的数据和页面组件完全独立，不增加首屏加载体积
