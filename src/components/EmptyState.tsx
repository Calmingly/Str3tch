import type { Icon } from '../lib/iconType';

interface EmptyStateProps {
  icon: Icon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: IconComponent, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/60 px-6 py-10 text-center dark:bg-white/[0.03]">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: 'var(--accent-soft)' }}
      >
        <IconComponent size={26} style={{ color: 'var(--accent)' }} />
      </div>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{title}</p>
      {description && (
        <p className="max-w-[220px] text-xs text-slate-400 dark:text-slate-500">{description}</p>
      )}
    </div>
  );
}
