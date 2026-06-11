import fs from 'fs';
import path from 'path';
import {
  extractTitle,
  extractSection,
  parseIngredients,
  parseSteps,
  extractCategoryFromPath,
  extractImageRefs,
  findFirstImage,
  estimateCalories,
  estimateDifficulty,
  slugify,
} from './utils';

const IMAGE_OUTPUT_DIR = path.resolve(process.cwd(), 'public/data/images');

interface ParsedRecipe {
  id: string;
  title: string;
  category: string;
  categoryName: string;
  description: string;
  image: string;
  calories: number;
  difficulty: number;
  ingredients: Array<{ name: string; amount: string }>;
  steps: Array<{ order: number; content: string }>;
  tips: string[];
  tags: string[];
  rawMarkdown: string;
}

/**
 * 递归查找目录下所有 .md 文件
 */
function findMarkdownFiles(directory: string): string[] {
  const results: string[] = [];

  if (!fs.existsSync(directory)) return results;

  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
      results.push(fullPath);
    }
  }

  return results;
}

/**
 * 解析单个 Markdown 文件为结构化菜谱数据
 */
function parseRecipeFile(filePath: string, repoDir: string): ParsedRecipe | null {
  const markdown = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(repoDir, filePath);
  const title = extractTitle(markdown);

  if (!title) return null;

  const { id: categoryId, name: categoryName } = extractCategoryFromPath(relativePath);

  // 跳过模板分类
  if (categoryId === 'template') return null;

  // 从文件名生成 id
  const fileName = path.basename(filePath, '.md');
  const recipeId = `${categoryId}/${slugify(fileName)}`;

  // 提取食材段落（匹配多种可能的标题格式）
  const ingredientSection = extractSection(
    markdown,
    /^##\s*(必备原料|[所需]*原料|食材|材料|配料|用料|必备)/,
  );
  const ingredients = parseIngredients(ingredientSection);

  // 提取步骤
  const stepsSection = extractSection(
    markdown,
    /^##\s*(操作|做法|步骤|烹饪|制作)/,
  );
  const steps = parseSteps(stepsSection);

  // 提取小贴士
  const tipsSection = extractSection(
    markdown,
    /^##\s*(附加|小贴士|注意|提示|tips)/i,
  );
  const tips = tipsSection
    .split('\n')
    .map((line) => line.replace(/^[-*·•]\s*/, '').trim())
    .filter(Boolean);

  // 生成描述：多策略提取
  let description = '';
  // 策略1：标题后第一段非空、非标记文本
  const lines = markdown.split('\n');
  const titleLineIndex = lines.findIndex((line) => /^#\s+/.test(line));
  if (titleLineIndex >= 0) {
    for (let i = titleLineIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      // 跳过二级标题、图片引用、列表标记、表格
      if (/^(##|!\[|[-*|>])/.test(line)) continue;
      description = line.replace(/\*\*/g, '').slice(0, 80);
      break;
    }
  }
  // 策略2：如果还是空，用食材组合作为描述
  if (!description && ingredients.length > 0) {
    description = ingredients.slice(0, 4).map((i) => i.name).join('、');
  }

  // 提取图片：找到本地图片路径后，转为 GitHub media URL（仓库使用 Git LFS 存储图片）
  const imageRefs = extractImageRefs(markdown);
  const localImagePath = findFirstImage(filePath, imageRefs);
  let image = '';
  if (localImagePath && localImagePath.startsWith('http')) {
    image = localImagePath;
  } else if (localImagePath) {
    // 将本地绝对路径转为相对于仓库根目录的路径，再拼接 GitHub media URL
    const relativeToRepo = path.relative(repoDir, localImagePath).replace(/\\/g, '/');
    image = `https://media.githubusercontent.com/media/Anduin2017/HowToCook/master/${encodeURI(relativeToRepo)}`;
  }

  // 估算卡路里
  const calories = estimateCalories(ingredients, categoryId);

  // 估算难度
  const difficulty = estimateDifficulty(steps, ingredients, categoryId);

  // 生成标签（食材名 + 菜名）
  const tags = [
    ...ingredients.slice(0, 5).map((ingredient) => ingredient.name),
    ...title.split(/[,，、\s]+/).filter(Boolean),
  ];

  // 将 rawMarkdown 中的相对图片路径转为 GitHub media URL
  const recipeDir = path.dirname(filePath);
  const processedMarkdown = markdown.replace(
    /!\[([^\]]*)\]\(\.\/([^)]+)\)/g,
    (_match, alt, relativeSrc) => {
      const absPath = path.resolve(recipeDir, relativeSrc);
      const relativeToRepo = path.relative(repoDir, absPath).replace(/\\/g, '/');
      const githubUrl = `https://media.githubusercontent.com/media/Anduin2017/HowToCook/master/${encodeURI(relativeToRepo)}`;
      return `![${alt}](${githubUrl})`;
    },
  );

  return {
    id: recipeId,
    title,
    category: categoryId,
    categoryName,
    description,
    image,
    calories,
    difficulty,
    ingredients,
    steps,
    tips,
    tags: [...new Set(tags)],
    rawMarkdown: processedMarkdown,
  };
}

/**
 * 解析所有菜谱文件
 */
export function parseAllRecipes(repoDir: string): ParsedRecipe[] {
  const dishesDir = path.join(repoDir, 'dishes');
  const markdownFiles = findMarkdownFiles(dishesDir);

  console.log(`📄 找到 ${markdownFiles.length} 个菜谱文件`);

  const recipes: ParsedRecipe[] = [];

  for (const filePath of markdownFiles) {
    const recipe = parseRecipeFile(filePath, repoDir);
    if (recipe) {
      recipes.push(recipe);
    }
  }

  console.log(`✅ 成功解析 ${recipes.length} 道菜谱`);
  return recipes;
}
