import fs from 'fs';
import path from 'path';

/**
 * 简易中文转拼音映射（常用字），用于生成 URL 友好的 id
 * 不依赖外部拼音库，仅处理文件名中的常见字符
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    || text;
}

/**
 * 从 Markdown 内容中提取标题（第一个 # 开头的行）
 */
export function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}

/**
 * 从 Markdown 中提取指定二级标题下的内容
 */
export function extractSection(markdown: string, headingPattern: RegExp): string {
  const lines = markdown.split('\n');
  let capturing = false;
  const sectionLines: string[] = [];

  for (const line of lines) {
    if (capturing) {
      // 遇到下一个二级标题时停止
      if (/^##\s+/.test(line)) break;
      sectionLines.push(line);
    } else if (headingPattern.test(line)) {
      capturing = true;
    }
  }

  return sectionLines.join('\n').trim();
}

/**
 * 从食材段落中解析食材列表
 */
export function parseIngredients(section: string): Array<{ name: string; amount: string }> {
  const ingredients: Array<{ name: string; amount: string }> = [];
  const lines = section.split('\n').filter((line) => line.trim());

  for (const line of lines) {
    const cleaned = line.replace(/^[-*·•]\s*/, '').trim();
    if (!cleaned || /^[|#]/.test(cleaned)) continue;

    // 尝试匹配 "食材 数量" 格式
    const match = cleaned.match(/^(.+?)\s+(\d+[\s\S]*|适量|少许|若干|一些)$/);
    if (match) {
      ingredients.push({ name: match[1].trim(), amount: match[2].trim() });
    } else {
      ingredients.push({ name: cleaned, amount: '适量' });
    }
  }

  return ingredients;
}

/**
 * 从步骤段落中解析步骤列表
 */
export function parseSteps(section: string): Array<{ order: number; content: string }> {
  const steps: Array<{ order: number; content: string }> = [];
  const lines = section.split('\n').filter((line) => line.trim());
  let order = 1;

  for (const line of lines) {
    const cleaned = line
      .replace(/^\d+[.、)\]]\s*/, '')   // 去掉有序列表编号
      .replace(/^[-*]\s*/, '')           // 去掉无序列表标记
      .trim();

    if (!cleaned || /^[|#!]/.test(cleaned)) continue;

    steps.push({ order, content: cleaned });
    order++;
  }

  return steps;
}

/**
 * 从文件路径中提取分类信息
 * 路径格式: dishes/category/recipe.md 或 dishes/category/subdir/recipe.md
 * 始终取 dishes/ 下的第一级目录作为分类
 */
export function extractCategoryFromPath(relativePath: string): { id: string; name: string } {
  const parts = relativePath.split('/');
  // parts[0] = "dishes", parts[1] = 分类目录
  if (parts.length >= 2 && parts[0] === 'dishes') {
    const categoryDir = parts[1];
    return {
      id: categoryDir,
      name: CATEGORY_NAME_MAP[categoryDir] || categoryDir,
    };
  }
  return { id: 'other', name: '其他' };
}

/**
 * 分类中文名映射
 */
export const CATEGORY_NAME_MAP: Record<string, string> = {
  'aquatic': '水产',
  'breakfast': '早餐',
  'condiment': '酱料',
  'dessert': '甜品',
  'drink': '饮品',
  'meat_dish': '荤菜',
  'semi-finished': '半成品',
  'soup': '汤品',
  'staple': '主食',
  'vegetable_dish': '素菜',
  'template': '模板',
};

/**
 * 分类图标映射
 */
export const CATEGORY_ICON_MAP: Record<string, string> = {
  'aquatic': '🐟',
  'breakfast': '🌅',
  'condiment': '🧂',
  'dessert': '🍰',
  'drink': '🥤',
  'meat_dish': '🥩',
  'semi-finished': '🥡',
  'soup': '🍲',
  'staple': '🍚',
  'vegetable_dish': '🥬',
  'template': '📝',
};

/**
 * 从 Markdown 中提取所有图片引用路径（本地相对路径或 URL）
 * 返回第一张图片的文件名
 */
export function extractImageRefs(markdown: string): string[] {
  const refs: string[] = [];
  // 匹配 ![alt](path) 格式，path 可以是相对路径或 URL
  const regex = /!\[.*?]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    const ref = match[1].trim();
    refs.push(ref);
  }
  return refs;
}

/**
 * 从文件所在目录查找第一张可用的图片文件
 */
export function findFirstImage(mdFilePath: string, imageRefs: string[]): string {
  const mdDir = path.dirname(mdFilePath);

  // 优先使用 md 中引用的第一张图片
  for (const ref of imageRefs) {
    if (ref.startsWith('http')) continue;
    const cleanRef = ref.replace(/^\.\//, '');
    const fullPath = path.join(mdDir, cleanRef);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  // 检查是否有远程 URL
  for (const ref of imageRefs) {
    if (ref.startsWith('http')) return ref;
  }

  // 如果 md 中没有引用但目录下有图片文件
  if (fs.existsSync(mdDir)) {
    const files = fs.readdirSync(mdDir) as string[];
    const imageFile = files.find((f: string) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
    if (imageFile) {
      return path.join(mdDir, imageFile);
    }
  }

  return '';
}

/**
 * 基于食材估算卡路里（粗略值，单位 kcal）
 */
const CALORIE_MAP: Record<string, number> = {
  '米': 350, '面': 350, '面粉': 350, '挂面': 350, '面条': 350, '意面': 360,
  '饭': 350, '米饭': 170, '糯米': 350, '粉丝': 340, '馒头': 220,
  '猪肉': 395, '五花肉': 508, '排骨': 278, '肉末': 230, '肉沫': 230,
  '牛肉': 250, '牛腩': 332, '鸡肉': 167, '鸡胸': 133, '鸡腿': 181,
  '鸡翅': 194, '鸡蛋': 144, '鸭': 240, '羊肉': 203, '培根': 533,
  '虾': 87, '鱼': 104, '三文鱼': 208, '蟹': 97, '鳝': 89,
  '豆腐': 81, '豆': 125, '黄豆': 390, '花生': 563,
  '土豆': 77, '红薯': 86, '番薯': 86,
  '西红柿': 18, '番茄': 18, '黄瓜': 15, '茄子': 25, '白菜': 13,
  '青菜': 15, '生菜': 13, '菠菜': 23, '西兰花': 34, '胡萝卜': 41,
  '洋葱': 40, '蘑菇': 22, '木耳': 21, '豆芽': 18,
  '糖': 400, '白砂糖': 400, '奶油': 340, '黄油': 717, '芝士': 350,
  '牛奶': 66, '椰浆': 197, '巧克力': 546,
  '油': 900, '食用油': 900, '橄榄油': 884,
};

export function estimateCalories(
  ingredients: Array<{ name: string; amount: string }>,
  category: string,
): number {
  if (ingredients.length === 0) {
    // 基于分类的默认值
    const categoryDefaults: Record<string, number> = {
      'meat_dish': 380, 'aquatic': 220, 'vegetable_dish': 150,
      'breakfast': 300, 'staple': 350, 'soup': 180,
      'dessert': 320, 'drink': 120, 'condiment': 50, 'semi-finished': 250,
    };
    return categoryDefaults[category] || 250;
  }

  let totalCalories = 0;
  let matchedCount = 0;

  for (const ingredient of ingredients) {
    const name = ingredient.name;
    for (const [keyword, kcal] of Object.entries(CALORIE_MAP)) {
      if (name.includes(keyword)) {
        totalCalories += kcal * 0.3; // 假设每种食材约用100-150g
        matchedCount++;
        break;
      }
    }
  }

  if (matchedCount === 0) return 250; // 默认值

  // 粗略估算一份的卡路里
  const estimated = Math.round(totalCalories / matchedCount * Math.min(matchedCount, 4));
  return Math.max(80, Math.min(estimated, 800)); // 限制在合理范围
}

/**
 * 基于步骤数和食材数估算烹饪难度（1-5星）
 */
export function estimateDifficulty(
  steps: Array<{ order: number; content: string }>,
  ingredients: Array<{ name: string; amount: string }>,
  category: string,
): number {
  const stepCount = steps.length;
  const ingredientCount = ingredients.length;

  // 基础难度分
  let score = 0;

  // 步骤数影响
  if (stepCount <= 3) score += 1;
  else if (stepCount <= 6) score += 2;
  else if (stepCount <= 10) score += 3;
  else if (stepCount <= 15) score += 4;
  else score += 5;

  // 食材数影响
  if (ingredientCount <= 3) score += 1;
  else if (ingredientCount <= 5) score += 2;
  else if (ingredientCount <= 8) score += 3;
  else score += 4;

  // 分类影响
  const categoryDifficultyBonus: Record<string, number> = {
    'drink': -1, 'condiment': 0, 'dessert': 1,
    'aquatic': 1, 'breakfast': -1,
  };
  score += categoryDifficultyBonus[category] || 0;

  // 检查关键词
  const allStepText = steps.map((s) => s.content).join(' ');
  if (/发酵|醒面|腌制|慢炖|熬/.test(allStepText)) score += 1;
  if (/油温|火候|翻炒/.test(allStepText)) score += 0.5;

  // 映射到1-5星
  const normalized = Math.round(score / 2);
  return Math.max(1, Math.min(normalized, 5));
}
