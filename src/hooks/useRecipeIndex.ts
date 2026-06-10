import { useState, useEffect } from 'react';
import type { RecipeIndexItem, CategoryMeta } from '../types/recipe';
import { fetchJson } from '../utils/fetcher';

interface RecipeIndexData {
  recipes: RecipeIndexItem[];
  categories: CategoryMeta[];
  loading: boolean;
  error: string | null;
}

let cachedRecipes: RecipeIndexItem[] | null = null;
let cachedCategories: CategoryMeta[] | null = null;

export function useRecipeIndex(): RecipeIndexData {
  const [recipes, setRecipes] = useState<RecipeIndexItem[]>(cachedRecipes ?? []);
  const [categories, setCategories] = useState<CategoryMeta[]>(cachedCategories ?? []);
  const [loading, setLoading] = useState(!cachedRecipes);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedRecipes && cachedCategories) return;

    const loadData = async () => {
      try {
        const [indexData, categoryData] = await Promise.all([
          fetchJson<RecipeIndexItem[]>('/data/index.json'),
          fetchJson<CategoryMeta[]>('/data/categories.json'),
        ]);
        cachedRecipes = indexData;
        cachedCategories = categoryData;
        setRecipes(indexData);
        setCategories(categoryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '数据加载失败');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { recipes, categories, loading, error };
}
