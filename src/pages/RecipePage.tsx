import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { Loading } from '../components/Loading';
import { useRecipe } from '../hooks/useRecipe';
import { getDifficultyLabel } from '../types/recipe';
import { getCaloriesColor, getDifficultyColor } from '../utils/color';

const DEFAULT_IMAGE = '/default-dish.jpg';

export function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const decodedId = id ? decodeURIComponent(id) : undefined;
  const { recipe, loading, error } = useRecipe(decodedId);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (loading) return <Loading />;

  if (error || !recipe) {
    return (
      <div className="min-h-screen px-6">
        <div className="pt-4 pb-4">
          <BackButton />
        </div>
        <p className="text-center text-sm text-[var(--color-text-secondary)] py-12">
          {error || '菜谱不存在'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 - 固定不参与滚动 */}
      <div className="sticky top-0 z-10 bg-[var(--color-bg)] px-6 flex items-center justify-between pt-4 pb-3">
        <BackButton />
        <h1 className="font-title text-lg font-bold text-[var(--color-text-primary)] truncate max-w-[60%] text-center">
          {recipe.title}
        </h1>
        <div className="w-12" />
      </div>

      {/* 可滚动内容区域 */}
      <div className="flex-1 overflow-y-auto px-6 pb-12">
        {/* 菜品图片 */}
        <div className="mb-6 mt-4 w-full aspect-[4/3] overflow-hidden rounded-xl bg-[var(--color-search-bg)]">
          <img
            src={recipe.image || DEFAULT_IMAGE}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src !== DEFAULT_IMAGE) {
                target.src = DEFAULT_IMAGE;
              }
            }}
          />
        </div>

        {/* 描述 + 卡路里/难度/分类信息 */}
        <div className="mb-8">
          {recipe.description && (
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
              {recipe.description}
            </p>
          )}
          <div className="flex items-center gap-3 text-[13px]">
            {/* 卡路里 */}
            <span className="flex items-center gap-1 font-medium" style={{ color: getCaloriesColor(recipe.calories ?? 250) }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={getCaloriesColor(recipe.calories ?? 250)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-4" />
              </svg>
              {recipe.calories ?? 250} kcal
            </span>
            {/* 烹饪难度 */}
            <span className="flex items-center gap-1 font-medium" style={{ color: getDifficultyColor(recipe.difficulty ?? 2) }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={getDifficultyColor(recipe.difficulty ?? 2)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {getDifficultyLabel(recipe.difficulty ?? 2)}
            </span>
            {/* 菜品分类 */}
            <span className="flex items-center gap-1 text-[var(--color-accent)] font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 7V4h16v3" />
                <path d="M9 20h6" />
                <path d="M12 4v16" />
              </svg>
              {recipe.categoryName}
            </span>
          </div>
        </div>

      {/* 食材清单 */}
          {recipe.ingredients.length > 0 && (
            <div className="mb-8">
              <div className="divider-ornament mb-5">
                <span>食材清单</span>
              </div>
              <div className="bg-[var(--color-card)] rounded-xl p-5 card-shadow">
                {recipe.ingredients.map((ingredient, index) => {
                  const isChecked = checkedIngredients.has(index);
                  return (
                    <button
                      key={index}
                      onClick={() => toggleIngredient(index)}
                      className={`flex items-center justify-between gap-1 w-full py-2.5 border-b border-[var(--color-divider)] last:border-b-0 text-left cursor-pointer bg-transparent transition-colors duration-150 ${
                        isChecked ? 'ingredient-checked' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex flex-shrink-0 items-center justify-center transition-colors duration-150 ${
                            isChecked
                              ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                              : 'border-[var(--color-divider)]'
                          }`}
                        >
                          {isChecked && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                        </div>
                        <span className="text-[15px]">{ingredient.name}</span>
                      </div>
                      <span className="text-sm text-[var(--color-text-secondary)]" style={{ minWidth: '28px' }}>
                        {ingredient.amount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 烹饪步骤 */}
          {recipe.steps.length > 0 && (
            <div className="mb-8">
              <div className="divider-ornament mb-5">
                <span>烹饪步骤</span>
              </div>
              <div className="flex flex-col gap-5">
                {recipe.steps.map((step) => (
                  <div key={step.order} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center text-sm font-medium font-title">
                      {step.order}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-[15px] leading-relaxed text-[var(--color-text-primary)]">
                        {step.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 小贴士 */}
          {recipe.tips.length > 0 && (
            <div>
              <div className="divider-ornament mb-5">
                <span>小贴士</span>
              </div>
              <div className="bg-[var(--color-search-bg)] rounded-xl p-5">
                {recipe.tips.map((tip, index) => (
                  <p
                    key={index}
                    className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-2 last:mb-0"
                  >
                    · {tip}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
