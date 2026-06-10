import { useState, useEffect } from 'react';
import type { Recipe } from '../types/recipe';
import { fetchJson } from '../utils/fetcher';

interface RecipeData {
  recipe: Recipe | null;
  loading: boolean;
  error: string | null;
}

export function useRecipe(recipeId: string | undefined): RecipeData {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recipeId) return;

    setLoading(true);
    setError(null);

    fetchJson<Recipe>(`/data/recipes/${recipeId}.json`)
      .then(setRecipe)
      .catch((err) => setError(err instanceof Error ? err.message : '加载失败'))
      .finally(() => setLoading(false));
  }, [recipeId]);

  return { recipe, loading, error };
}
