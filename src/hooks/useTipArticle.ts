import { useState, useEffect } from 'react';
import type { TipArticle } from '../types/tip';
import { fetchJson } from '../utils/fetcher';

interface TipArticleData {
  article: TipArticle | null;
  loading: boolean;
  error: string | null;
}

export function useTipArticle(group: string | undefined, id: string | undefined): TipArticleData {
  const [article, setArticle] = useState<TipArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!group || !id) return;

    setLoading(true);
    setError(null);

    fetchJson<TipArticle>(`/data/tips/${group}/${id}.json`)
      .then(setArticle)
      .catch((err) => setError(err instanceof Error ? err.message : '加载失败'))
      .finally(() => setLoading(false));
  }, [group, id]);

  return { article, loading, error };
}
