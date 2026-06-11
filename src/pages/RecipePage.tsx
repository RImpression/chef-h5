import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { marked } from 'marked';
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
  const markdownRef = useRef<HTMLDivElement>(null);

  // Markdown 渲染：去掉一级标题和首张图片（已在顶部展示）
  useEffect(() => {
    if (!recipe || !markdownRef.current) return;
    let content = recipe.rawMarkdown
      .replace(/^#\s+.+$/m, '')
      .trim();
    content = content.replace(/!\[[^\]]*\]\([^)]+\)/, '');
    markdownRef.current.innerHTML = marked.parse(content) as string;
  }, [recipe]);

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
          {/* {recipe.description && (
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
              {recipe.description}
            </p>
          )} */}
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

      {/* Markdown 渲染 */}
      <div
        ref={markdownRef}
        className="recipe-markdown prose prose-sm max-w-none text-[var(--color-text-primary)]"
      />

        </div>
      </div>
  );
}
