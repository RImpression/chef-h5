import { useParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { marked } from 'marked';
import { BackButton } from '../components/BackButton';
import { Loading } from '../components/Loading';
import { useTipArticle } from '../hooks/useTipArticle';
import { useTipsIndex } from '../hooks/useTipsIndex';
import { Link } from 'react-router-dom';

export function TipArticlePage() {
  const { group, id } = useParams<{ group: string; id: string }>();
  const { article, loading, error } = useTipArticle(group, id);
  const { groups } = useTipsIndex();
  const contentRef = useRef<HTMLDivElement>(null);

  // 找到所属分组信息和上下篇
  const currentGroup = groups.find((g) => g.id === group);
  const groupName = currentGroup?.name || group || '';
  const groupIcon = currentGroup?.icon || '/icons/tips/learn.png';

  const currentIndex = currentGroup?.articles.findIndex((a) => a.id === `${group}/${id}`) ?? -1;
  const prevArticle = currentIndex > 0 ? currentGroup?.articles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < (currentGroup?.articles.length ?? 0) - 1
      ? currentGroup?.articles[currentIndex + 1]
      : null;

  // 渲染 Markdown 内容，为 ## 标题注入锚点 id
  useEffect(() => {
    if (!article || !contentRef.current) return;
    const html = marked.parse(article.content) as string;
    contentRef.current.innerHTML = html;

    // 为所有 h2 标题添加与目录对应的 section-N id
    const headings = contentRef.current.querySelectorAll('h2');
    headings.forEach((heading, index) => {
      heading.id = `section-${index}`;
    });
  }, [article]);

  if (loading) return <Loading />;

  if (error || !article) {
    return (
      <div className="min-h-screen px-6">
        <div className="pt-4 pb-4">
          <BackButton />
        </div>
        <p className="text-center text-sm text-[var(--color-text-secondary)] py-12">
          {error ? `加载失败：${error}` : '文章不存在'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pb-12">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-[var(--color-bg)] -mx-6 px-6 flex items-center justify-between pt-4 pb-4">
        <BackButton />
        <h2 className="font-title text-sm font-medium text-[var(--color-text-secondary)]">
          {groupName}
        </h2>
        <div className="w-12" />
      </div>

      {/* 标题区域 */}
      <div className="text-center mt-2 mb-6">
        <h1 className="font-title text-2xl font-bold text-[var(--color-text-primary)] tracking-wide mb-2">
          {article.title}
        </h1>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[var(--color-search-bg)] text-[var(--color-text-secondary)]">
          <img src={groupIcon} alt={groupName} className="w-4 h-4 object-contain" /> {groupName}
        </span>
      </div>

      {/* 目录 */}
      {article.sections.length > 0 && (
        <div className="mb-6">
          <div className="divider-ornament mb-4">
            <span>目录</span>
          </div>
          <div className="space-y-1.5">
            {article.sections.map((section, index) => (
              <a
                key={index}
                href={`#section-${index}`}
                className="block text-sm text-[var(--color-primary)] hover:underline pl-2"
                onClick={(event) => {
                  event.preventDefault();
                  document.getElementById(`section-${index}`)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                · {section.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Markdown 正文 */}
      <div className="divider-ornament mb-6">
        <span>✿</span>
      </div>

      <div
        ref={contentRef}
        className="recipe-markdown prose prose-sm max-w-none text-[var(--color-text-primary)]"
      />

      {/* 文末装饰 */}
      <div className="divider-ornament mt-8 mb-6">
        <span>✿</span>
      </div>

      {/* 上下篇导航 */}
      {(prevArticle || nextArticle) && (
        <div className="space-y-3">
          {prevArticle && (
            <Link
              to={`/tips/${prevArticle.id}`}
              className="block rounded-xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            >
              <span className="text-xs text-[var(--color-text-secondary)]">← 上一篇</span>
              <p className="text-sm font-medium text-[var(--color-text-primary)] mt-1">
                {prevArticle.title}
              </p>
            </Link>
          )}
          {nextArticle && (
            <Link
              to={`/tips/${nextArticle.id}`}
              className="block rounded-xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            >
              <span className="text-xs text-[var(--color-text-secondary)]">下一篇 →</span>
              <p className="text-sm font-medium text-[var(--color-text-primary)] mt-1">
                {nextArticle.title}
              </p>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
