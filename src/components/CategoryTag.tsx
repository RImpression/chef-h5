import { Link } from 'react-router-dom';
import type { CategoryMeta } from '../types/recipe';
import { getCategoryIcon } from './icons/CategoryIcons';

interface CategoryTagProps {
  category: CategoryMeta;
}

export function CategoryTag({ category }: CategoryTagProps) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="flex flex-col items-center gap-2.5 min-w-[64px] no-underline group"
    >
      <div className="w-[56px] h-[56px] flex items-center justify-center rounded-2xl bg-[var(--color-card)] card-shadow group-hover:shadow-md transition-all duration-200 group-active:scale-95">
        {getCategoryIcon(category.id)}
      </div>
      <span className="text-xs text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors font-medium">
        {category.name}
      </span>
    </Link>
  );
}
