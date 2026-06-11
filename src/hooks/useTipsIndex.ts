import { useState, useEffect } from 'react';
import type { TipGroup } from '../types/tip';
import { fetchJson } from '../utils/fetcher';

interface TipsIndexData {
  groups: TipGroup[];
  loading: boolean;
  error: string | null;
}

let cachedGroups: TipGroup[] | null = null;

export function useTipsIndex(): TipsIndexData {
  const [groups, setGroups] = useState<TipGroup[]>(cachedGroups ?? []);
  const [loading, setLoading] = useState(!cachedGroups);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedGroups) return;

    fetchJson<TipGroup[]>('/data/tips.json')
      .then((data) => {
        cachedGroups = data;
        setGroups(data);
      })
      .catch((err) => setError(err instanceof Error ? err.message : '加载失败'))
      .finally(() => setLoading(false));
  }, []);

  return { groups, loading, error };
}
