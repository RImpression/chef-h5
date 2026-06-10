export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[var(--color-divider)] border-t-[var(--color-accent)] rounded-full animate-spin" />
      <p className="mt-4 text-sm text-[var(--color-text-secondary)] font-body">
        加载中...
      </p>
    </div>
  );
}
