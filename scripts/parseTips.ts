import fs from 'fs';
import path from 'path';
import { extractTitle } from './utils';

interface TipArticleData {
  id: string;
  title: string;
  group: string;
  summary: string;
  content: string;
  sections: Array<{ title: string; content: string }>;
}

interface TipGroupData {
  id: string;
  name: string;
  icon: string;
  description: string;
  articles: Array<{ id: string; title: string; group: string; summary: string }>;
}

/** 分组定义 */
const GROUP_CONFIG: Record<string, { name: string; icon: string; description: string }> = {
  preparation: {
    name: '厨房准备',
    icon: '/icons/tips/preparation.png',
    description: '下厨前的基础准备工作',
  },
  decision: {
    name: '选择吃什么',
    icon: '/icons/tips/decision.png',
    description: '用科学方法决定今天的菜单',
  },
  learn: {
    name: '基础学习',
    icon: '/icons/tips/learn.png',
    description: '掌握常见烹饪技法和厨具使用',
  },
  advanced: {
    name: '高级技巧',
    icon: '/icons/tips/advanced.png',
    description: '进阶烹饪知识与专业术语',
  },
};

/** 文件名 → 分组 ID 映射（根目录下的独立文件） */
const ROOT_FILE_GROUP_MAP: Record<string, string> = {
  '厨房准备.md': 'preparation',
  '如何选择现在吃什么.md': 'decision',
};

/** 中文文件名 → 英文 slug 映射 */
const SLUG_MAP: Record<string, string> = {
  '厨房准备': 'kitchen-preparation',
  '如何选择现在吃什么': 'what-to-eat',
  '去腥': 'remove-odor',
  '学习凉拌': 'cold-mix',
  '学习炒与煎': 'stir-fry-and-pan-fry',
  '学习焯水': 'blanching',
  '学习煮': 'boiling',
  '学习腌': 'marinating',
  '学习蒸': 'steaming',
  '微波炉': 'microwave',
  '空气炸锅': 'air-fryer',
  '食品安全': 'food-safety',
  '高压力锅': 'pressure-cooker',
  '油温判断技巧': 'oil-temperature',
  '糖色的炒制': 'caramel-coloring',
  '辅料技巧': 'seasoning-tips',
  '高级专业术语': 'culinary-terms',
};

/**
 * 从 Markdown 中提取摘要（标题后的第一段非空文字）
 */
function extractSummary(markdown: string, maxLength = 60): string {
  const lines = markdown.split('\n');
  const titleIndex = lines.findIndex((line) => /^#\s+/.test(line));
  if (titleIndex < 0) return '';

  for (let lineIndex = titleIndex + 1; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex].trim();
    if (!line) continue;
    if (/^(##|```|[-*|>!])/.test(line)) continue;
    return line.replace(/\*\*/g, '').slice(0, maxLength);
  }
  return '';
}

/**
 * 按 ## 标题拆分文章为段落
 */
function extractSections(markdown: string): Array<{ title: string; content: string }> {
  const sections: Array<{ title: string; content: string }> = [];
  const lines = markdown.split('\n');
  let currentTitle = '';
  let currentLines: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);
    if (headingMatch) {
      if (currentTitle) {
        sections.push({ title: currentTitle, content: currentLines.join('\n').trim() });
      }
      currentTitle = headingMatch[1].trim();
      currentLines = [];
    } else if (currentTitle) {
      currentLines.push(line);
    }
  }

  if (currentTitle) {
    sections.push({ title: currentTitle, content: currentLines.join('\n').trim() });
  }

  return sections;
}

/**
 * 解析单个 tips Markdown 文件
 */
function parseTipFile(filePath: string, groupId: string): TipArticleData | null {
  const markdown = fs.readFileSync(filePath, 'utf-8');
  const title = extractTitle(markdown);
  if (!title) return null;

  const fileName = path.basename(filePath, '.md');
  const slug = SLUG_MAP[fileName] || fileName;
  const articleId = `${groupId}/${slug}`;
  const summary = extractSummary(markdown);
  const sections = extractSections(markdown);

  // 正文内容：去掉一级标题
  const content = markdown.replace(/^#\s+.+$/m, '').trim();

  return {
    id: articleId,
    title,
    group: groupId,
    summary,
    content,
    sections,
  };
}

/**
 * 解析所有 tips 文件，返回分组数据
 */
export function parseAllTips(repoDir: string): {
  groups: TipGroupData[];
  articles: TipArticleData[];
} {
  const tipsDir = path.join(repoDir, 'tips');

  if (!fs.existsSync(tipsDir)) {
    console.warn('⚠️ tips 目录不存在，跳过技巧解析');
    return { groups: [], articles: [] };
  }

  const allArticles: TipArticleData[] = [];
  const groupArticlesMap = new Map<string, TipArticleData[]>();

  // 初始化分组
  for (const groupId of Object.keys(GROUP_CONFIG)) {
    groupArticlesMap.set(groupId, []);
  }

  // 解析根目录下的独立文件
  for (const [fileName, groupId] of Object.entries(ROOT_FILE_GROUP_MAP)) {
    const filePath = path.join(tipsDir, fileName);
    if (!fs.existsSync(filePath)) continue;

    const article = parseTipFile(filePath, groupId);
    if (article) {
      allArticles.push(article);
      groupArticlesMap.get(groupId)!.push(article);
    }
  }

  // 解析子目录（learn, advanced）
  for (const subDir of ['learn', 'advanced']) {
    const dirPath = path.join(tipsDir, subDir);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.md')).sort();
    for (const fileName of files) {
      const filePath = path.join(dirPath, fileName);
      const article = parseTipFile(filePath, subDir);
      if (article) {
        allArticles.push(article);
        groupArticlesMap.get(subDir)!.push(article);
      }
    }
  }

  // 构建分组数据（按设计顺序）
  const groupOrder = ['preparation', 'decision', 'learn', 'advanced'];
  const groups: TipGroupData[] = groupOrder
    .filter((groupId) => {
      const articles = groupArticlesMap.get(groupId);
      return articles && articles.length > 0;
    })
    .map((groupId) => {
      const config = GROUP_CONFIG[groupId];
      const articles = groupArticlesMap.get(groupId)!;
      return {
        id: groupId,
        name: config.name,
        icon: config.icon,
        description: config.description,
        articles: articles.map(({ id, title, group, summary }) => ({ id, title, group, summary })),
      };
    });

  console.log(`📚 解析技巧文章: ${allArticles.length} 篇，${groups.length} 个分组`);
  return { groups, articles: allArticles };
}
