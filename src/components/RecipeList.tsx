import { RecipeCard } from './RecipeCard';
import type { RecipeIndexItem, CategoryRecipeItem } from '../types/recipe';

interface RecipeListProps {
  recipes: (RecipeIndexItem | CategoryRecipeItem)[];
}

export function RecipeList({ recipes }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-text-secondary)] text-sm">
        暂无菜谱
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          id={recipe.id}
          title={recipe.title}
          description={'description' in recipe ? recipe.description : undefined}
          image={recipe.image}
          calories={recipe.calories}
          difficulty={recipe.difficulty}
        />
      ))}
    </div>
  );
}
