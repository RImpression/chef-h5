import fs from 'fs';
import path from 'path';
import { syncRepository } from './sync';
import { parseAllRecipes } from './parse';
import { CATEGORY_ICON_MAP } from './utils';

const OUTPUT_DIR = path.resolve(process.cwd(), 'public/data');

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeJson(filePath: string, data: unknown) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

async function main() {
  console.log('\n🚀 开始构建菜谱数据...\n');

  // 1. 同步仓库
  const repoDir = await syncRepository();

  // 2. 解析所有菜谱
  const recipes = parseAllRecipes(repoDir);

  if (recipes.length === 0) {
    console.error('❌ 未解析到任何菜谱，请检查仓库结构');
    process.exit(1);
  }

  // 3. 准备输出目录
  ensureDir(OUTPUT_DIR);
  ensureDir(path.join(OUTPUT_DIR, 'categories'));
  ensureDir(path.join(OUTPUT_DIR, 'recipes'));

  // 4. 生成 index.json（轻量索引）
  const indexData = recipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    category: recipe.category,
    categoryName: recipe.categoryName,
    tags: recipe.tags,
    description: recipe.description,
    image: recipe.image,
    calories: recipe.calories,
    difficulty: recipe.difficulty,
  }));
  writeJson(path.join(OUTPUT_DIR, 'index.json'), indexData);
  console.log(`📋 index.json: ${indexData.length} 条记录`);

  // 5. 按分类聚合
  const categoryMap = new Map<string, typeof recipes>();
  for (const recipe of recipes) {
    const existing = categoryMap.get(recipe.category) || [];
    existing.push(recipe);
    categoryMap.set(recipe.category, existing);
  }

  // 6. 生成 categories.json（分类元信息）
  const categoriesData = Array.from(categoryMap.entries()).map(([categoryId, categoryRecipes]) => ({
    id: categoryId,
    name: categoryRecipes[0].categoryName,
    icon: CATEGORY_ICON_MAP[categoryId] || '🍽️',
    count: categoryRecipes.length,
  }));
  writeJson(path.join(OUTPUT_DIR, 'categories.json'), categoriesData);
  console.log(`📂 categories.json: ${categoriesData.length} 个分类`);

  // 7. 生成 categories/{id}.json（分类菜谱列表）
  for (const [categoryId, categoryRecipes] of categoryMap) {
    const categoryListData = categoryRecipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients.slice(0, 5).map((ingredient) => ingredient.name),
      image: recipe.image,
      calories: recipe.calories,
      difficulty: recipe.difficulty,
    }));
    writeJson(path.join(OUTPUT_DIR, 'categories', `${categoryId}.json`), categoryListData);
  }
  console.log(`📂 分类列表文件: ${categoryMap.size} 个`);

  // 8. 生成 recipes/{id}.json（完整菜谱）
  for (const recipe of recipes) {
    const recipeDir = path.join(OUTPUT_DIR, 'recipes', recipe.category);
    ensureDir(recipeDir);

    const recipeFileName = recipe.id.split('/').pop()!;
    writeJson(path.join(recipeDir, `${recipeFileName}.json`), {
      id: recipe.id,
      title: recipe.title,
      category: recipe.category,
      categoryName: recipe.categoryName,
      description: recipe.description,
      image: recipe.image,
      calories: recipe.calories,
      difficulty: recipe.difficulty,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      tips: recipe.tips,
      rawMarkdown: recipe.rawMarkdown,
    });
  }
  console.log(`📝 菜谱详情文件: ${recipes.length} 个`);

  // 9. 统计信息
  const indexSize = fs.statSync(path.join(OUTPUT_DIR, 'index.json')).size;
  console.log(`\n✨ 构建完成！`);
  console.log(`   菜谱总数: ${recipes.length}`);
  console.log(`   分类数: ${categoryMap.size}`);
  console.log(`   index.json 大小: ${(indexSize / 1024).toFixed(1)}KB`);
  console.log(`   输出目录: ${OUTPUT_DIR}\n`);
}

main().catch((err) => {
  console.error('❌ 构建失败:', err);
  process.exit(1);
});
