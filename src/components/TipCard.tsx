import { Link } from 'react-router-dom';

interface TipCardProps {
  id: string;
  title: string;
  summary: string;
  compact?: boolean;
}

export function TipCard({ id, title, summary, compact = false }: TipCardProps) {
  return (
    <Link
      to={`/tips/${id}`}
      className={`block rounded-xl bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${compact ? '' : ''}`}
    >
      <h4 className="font-title text-sm font-semibold text-[var(--color-text-primary)] mb-1 line-clamp-1">
        {title}
      </h4>
      <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed">
        {summary}
      </p>
    </Link>
  );
}
