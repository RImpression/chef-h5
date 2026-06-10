import { useState, useEffect } from 'react';
import type { CategoryRecipeItem } from '../types/recipe';
import { fetchJson } from '../utils/fetcher';

interface CategoryData {
  recipes: CategoryRecipeItem[];
  loading: boolean;
  error: string | null;
}

export function useCategory(categoryId: string | undefined): CategoryData {
  const [recipes, setRecipes] = useState<CategoryRecipeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    setLoading(true);
    setError(null);

    fetchJson<CategoryRecipeItem[]>(`/data/categories/${categoryId}.json`)
      .then(setRecipes)
      .catch((err) => setError(err instanceof Error ? err.message : '加载失败'))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return { recipes, loading, error };
}
