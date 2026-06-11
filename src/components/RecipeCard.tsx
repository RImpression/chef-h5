import { Link } from 'react-router-dom';
import { getDifficultyLabel } from '../types/recipe';
import { getCaloriesColor, getDifficultyColor } from '../utils/color';

const DEFAULT_IMAGE = '/default-dish.jpg';

interface RecipeCardProps {
  id: string;
  title: string;
  description?: string;
  image?: string;
  calories?: number;
  difficulty?: number;
  categoryName?: string;
}


export function RecipeCard({ id, title, description, image, calories, difficulty, categoryName }: RecipeCardProps) {
  const difficultyValue = difficulty ?? 2;
  const difficultyLabel = getDifficultyLabel(difficultyValue);
  const displayCalories = calories ?? 250;
  const imageUrl = image || DEFAULT_IMAGE;
  const caloriesColor = getCaloriesColor(displayCalories);
  const difficultyColor = getDifficultyColor(difficultyValue);

  return (
    <Link
      to={`/recipe/${encodeURIComponent(id)}`}
      className="block bg-[var(--color-card)] rounded-2xl card-shadow border border-[var(--color-divider)] hover:shadow-md active:scale-[0.98] transition-all duration-200 no-underline overflow-hidden"
    >
      {/* 第一行：菜品图片 */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-[var(--color-search-bg)]">
        {categoryName && (
          <span className="absolute top-2 left-2 z-[1] px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/40 text-white backdrop-blur-sm leading-none flex items-center h-5">
            {categoryName}
          </span>
        )}
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(event) => {
            const target = event.currentTarget;
            if (target.src !== DEFAULT_IMAGE) {
              target.src = DEFAULT_IMAGE;
            }
          }}
        />
      </div>

      <div className="px-3 pt-3 pb-3">
        {/* 第二行：菜品名称 */}
        <h3 className="font-title text-[14px] font-semibold text-[var(--color-text-primary)] leading-snug mb-1 truncate">
          {title}
        </h3>

        {/* 第三行：菜品描述 */}
        <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed mb-2.5 truncate">
          {description || '暂无描述'}
        </p>

        {/* 第四行：卡路里 + 难度（颜色分级） */}
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 font-medium" style={{ color: caloriesColor }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={caloriesColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V10" />
              <path d="M18 20V4" />
              <path d="M6 20v-4" />
            </svg>
            {displayCalories} kcal
          </span>
          <span className="flex items-center gap-1 font-medium" style={{ color: difficultyColor }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={difficultyColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {difficultyLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
