const cache = new Map<string, unknown>();

export async function fetchJson<T>(path: string): Promise<T> {
  if (cache.has(path)) {
    return cache.get(path) as T;
  }

  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  const data = await response.json();
  cache.set(path, data);
  return data as T;
}
