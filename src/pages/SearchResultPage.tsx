import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { RecipeList } from '../components/RecipeList';
import { BackButton } from '../components/BackButton';
import { Loading } from '../components/Loading';
import { useRecipeIndex } from '../hooks/useRecipeIndex';
import { useSearch } from '../hooks/useSearch';

export function SearchResultPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const { recipes, loading } = useRecipeIndex();
  const { results, searching } = useSearch(recipes, queryParam);

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      setSearchParams({ q: newQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen px-6 pb-12">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3 pt-4 pb-4">
        <BackButton />
        <div className="flex-1">
          <SearchBar value={queryParam} onSearch={handleSearch} autoFocus />
        </div>
      </div>

      {/* 结果 */}
      {searching ? (
        <p className="text-center text-sm text-[var(--color-text-secondary)] py-8">搜索中...</p>
      ) : (
        <>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            找到 {results.length} 道相关菜谱
          </p>
          <RecipeList recipes={results} />
          {results.length > 0 && (
            <div className="divider-ornament mt-8">
              <span>没有更多了</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
