export interface RecipeIndexItem {
  id: string;
  title: string;
  category: string;
  categoryName: string;
  tags: string[];
  description: string;
  image: string;
  calories: number;
  difficulty: number;
}

export interface CategoryMeta {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface CategoryRecipeItem {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  image: string;
  calories: number;
  difficulty: number;
}

export interface Ingredient {
  name: string;
  amount: string;
}

export interface Step {
  order: number;
  content: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  categoryName: string;
  description: string;
  image: string;
  calories: number;
  difficulty: number;
  ingredients: Ingredient[];
  steps: Step[];
  tips: string[];
  rawMarkdown: string;
}

/** 根据星级返回难度标签：1-2星=简单, 3-4星=中等, 5星=较高 */
export function getDifficultyLabel(difficulty: number): string {
  if (difficulty <= 2) return '简单';
  if (difficulty <= 4) return '中等';
  return '较高';
}
