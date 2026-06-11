import { Link } from 'react-router-dom';
import type { CategoryMeta } from '../types/recipe';

/** 分类 ID → 图标文件映射 */
const CATEGORY_ICON_MAP: Record<string, string> = {
  staple: '/icons/categories/staple.png',
  meat_dish: '/icons/categories/meat_dish.png',
  vegetable_dish: '/icons/categories/vegetable_dish.png',
  soup: '/icons/categories/soup.png',
  breakfast: '/icons/categories/breakfast.png',
  drink: '/icons/categories/drink.png',
  dessert: '/icons/categories/dessert.png',
  aquatic: '/icons/categories/aquatic.png',
  'semi-finished': '/icons/categories/semi-finished.png',
  condiment: '/icons/categories/condiment.png',
};

interface CategoryTagProps {
  category: CategoryMeta;
}

export function CategoryTag({ category }: CategoryTagProps) {
  const iconSrc = CATEGORY_ICON_MAP[category.id] || CATEGORY_ICON_MAP['staple'];

  return (
    <Link
      to={`/category/${category.id}`}
      className="flex flex-col items-center gap-1.5 min-w-[56px] no-underline group"
    >
      <div className="w-12 h-12 flex items-center justify-center transition-transform duration-200 group-active:scale-90">
        <img
          src={iconSrc}
          alt={category.name}
          className="w-12 h-12 object-contain"
        />
      </div>
      <span className="text-xs text-[var(--color-text-primary)] group-hover:text-[var(--color-text-primary)] transition-colors">
        {category.name}
      </span>
    </Link>
  );
}
