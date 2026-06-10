import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { RecipeIndexItem } from '../types/recipe';

interface SearchResult {
  results: RecipeIndexItem[];
  searching: boolean;
}

export function useSearch(
  recipes: RecipeIndexItem[],
  query: string,
): SearchResult {
  const [results, setResults] = useState<RecipeIndexItem[]>([]);
  const [searching, setSearching] = useState(false);

  const fuse = useMemo(() => {
    if (recipes.length === 0) return null;
    return new Fuse(recipes, {
      keys: [
        { name: 'title', weight: 0.6 },
        { name: 'tags', weight: 0.3 },
        { name: 'categoryName', weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
    });
  }, [recipes]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || !fuse) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timer = setTimeout(() => {
      const fuseResults = fuse.search(trimmed, { limit: 30 });
      setResults(fuseResults.map((result) => result.item));
      setSearching(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [query, fuse]);

  return { results, searching };
}
