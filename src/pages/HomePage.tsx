import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CategoryTag } from '../components/CategoryTag';
import { RecipeList } from '../components/RecipeList';
import { Loading } from '../components/Loading';
import { useRecipeIndex } from '../hooks/useRecipeIndex';
import { useTipsIndex } from '../hooks/useTipsIndex';

export function HomePage() {
  const { recipes, categories, loading, error } = useRecipeIndex();
  const { groups: tipGroups } = useTipsIndex();
  const navigate = useNavigate();

  const [randomSeed, setRandomSeed] = useState(0);

  const randomRecipes = useMemo(() => {
    if (recipes.length === 0) return [];
    const shuffled = [...recipes];
    let seedValue = randomSeed + Date.now();
    for (let i = shuffled.length - 1; i > 0; i--) {
      seedValue = (seedValue * 9301 + 49297) % 233280;
      const j = Math.floor((seedValue / 233280) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 4);
  }, [recipes, randomSeed]);


  const handleRefreshRandom = () => {
    setRandomSeed((prev) => prev + 1);
  };

  const handleRandomRecipe = () => {
    if (recipes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const recipe = recipes[randomIndex];
    navigate(`/recipe/${encodeURIComponent(recipe.id)}`);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p className="text-[var(--color-text-secondary)] text-sm">数据加载失败</p>
        <p className="text-[var(--color-text-secondary)] text-xs mt-2">请先运行 npm run sync 同步菜谱数据</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 pb-16">
      {/* 品牌区域 */}
      <div className="mt-4 pb-6 text-center">
        <div className="flex justify-center">
          <img src="/logo.png" alt="食光" className="logo object-contain" />
        </div>
        <div className="flex justify-center title-mt mb-4">
          <img src="/logo-text.png" alt="食光" className="h-10 object-contain" />
        </div>
        <p className="text-[13px] text-[var(--color-text-secondary)] font-light tracking-wider">
          — 用心料理，感受食光 —
        </p>
      </div>

      {/* 搜索框 - 点击跳转到搜索页 */}
      <div className="mb-8 cursor-pointer" onClick={() => navigate('/search')}>
        <div className="relative w-full search-bar-shadow search-input bg-white pointer-events-none">
          <input
            type="text"
            readOnly
            placeholder="想吃点什么..."
            className="w-full h-14 pl-5 pr-14 bg-transparent rounded-2xl text-[15px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] outline-none cursor-pointer"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <>
          {/* 分类标签 */}
          <div className="grid grid-cols-5 gap-y-5 gap-x-2 mb-8">
            {categories.map((category) => (
              <CategoryTag key={category.id} category={category} />
            ))}
          </div>

          {/* 烹饪技巧入口 */}
          {tipGroups.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-title text-[18px] font-bold text-[var(--color-text-primary)]">
                  烹饪技巧
                </h2>
                <Link
                  to="/tips"
                  className="text-[13px] text-[var(--color-accent)] font-medium no-underline"
                >
                  查看全部
                </Link>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {tipGroups.map((group) => (
                  <Link
                    key={group.id}
                    to="/tips"
                    className="flex-shrink-0 w-28 rounded-xl bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)] no-underline"
                  >
                    <img src={group.icon} alt={group.name} className="w-8 h-8 object-contain" />
                    <p className="text-sm font-medium text-[var(--color-text-primary)] mt-1.5 line-clamp-1">
                      {group.name}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-secondary)] mt-0.5">
                      {group.articles.length} 篇技巧
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 随机一道菜按钮 */}
          <div className="mb-8 px-4">
            <button
              onClick={handleRandomRecipe}
              className="w-full h-12 flex items-center justify-center gap-2 bg-[var(--color-accent)] text-white rounded-full text-[18px] font-medium cursor-pointer border-none hover:opacity-90 active:scale-[0.98] transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 3 21 3 21 8" />
                <line x1="4" y1="20" x2="21" y2="3" />
                <polyline points="21 16 21 21 16 21" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="4" y1="4" x2="9" y2="9" />
              </svg>
              随机一道菜
            </button>
          </div>

          {/* 今日推荐标题栏 */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-title text-[18px] font-bold text-[var(--color-text-primary)]">
              今日推荐
            </h2>
            <button
              onClick={handleRefreshRandom}
              className="flex items-center gap-1 text-[13px] text-[var(--color-accent)] cursor-pointer bg-transparent border-none font-medium"
            >
              换一换
            </button>
          </div>

          <RecipeList recipes={randomRecipes} />
        </>
    </div>
  );
}
