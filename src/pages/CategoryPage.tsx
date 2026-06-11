import { useParams } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { RecipeList } from '../components/RecipeList';
import { Loading } from '../components/Loading';
import { useRecipeIndex } from '../hooks/useRecipeIndex';
import { useCategory } from '../hooks/useCategory';

export function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { categories } = useRecipeIndex();
  const { recipes, loading, error } = useCategory(id);

  const categoryMeta = categories.find((category) => category.id === id);
  const categoryName = categoryMeta?.name || id || '';

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen px-6">
        <div className="pt-4 pb-4">
          <BackButton />
        </div>
        <p className="text-center text-sm text-[var(--color-text-secondary)] py-12">
          加载失败：{error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pb-12">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-[var(--color-bg)] -mx-6 px-6 flex items-center justify-between pt-4 pb-6">
        <BackButton />
        <h2 className="font-title text-lg font-semibold text-[var(--color-text-primary)]">
          {categoryName}
          <span className="text-sm text-[var(--color-text-secondary)] font-normal ml-2">
            ({recipes.length})
          </span>
        </h2>
        <div className="w-12" />
      </div>

      <RecipeList recipes={recipes} categoryName={categoryName} />
    </div>
  );
}
