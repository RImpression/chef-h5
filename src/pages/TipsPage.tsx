import { BackButton } from '../components/BackButton';
import { TipCard } from '../components/TipCard';
import { Loading } from '../components/Loading';
import { useTipsIndex } from '../hooks/useTipsIndex';

export function TipsPage() {
  const { groups, loading, error } = useTipsIndex();

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
      <div className="sticky top-0 z-10 bg-[var(--color-bg)] -mx-6 px-6 flex items-center justify-between pt-4 pb-4">
        <BackButton />
        <h2 className="font-title text-lg font-semibold text-[var(--color-text-primary)]">
          烹饪技巧
        </h2>
        <div className="w-12" />
      </div>

      {/* 分组列表 */}
      <div className="space-y-8 mt-2">
        {groups.map((group) => {
          const isSingleArticle = group.articles.length === 1;

          return (
            <section key={group.id}>
              {/* 分组标题 */}
              <div className="flex items-center gap-2 mb-3">
                <img src={group.icon} alt={group.name} className="w-6 h-6 object-contain" />
                <h3 className="font-title text-base font-semibold text-[var(--color-text-primary)]">
                  {group.name}
                </h3>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {group.articles.length} 篇
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mb-3 -mt-1">
                {group.description}
              </p>

              {/* 文章卡片 */}
              {isSingleArticle ? (
                <TipCard
                  id={group.articles[0].id}
                  title={group.articles[0].title}
                  summary={group.articles[0].summary}
                />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {group.articles.map((article) => (
                    <TipCard
                      key={article.id}
                      id={article.id}
                      title={article.title}
                      summary={article.summary}
                      compact
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <div className="divider-ornament mt-10">
        <span>学无止境</span>
      </div>
    </div>
  );
}
