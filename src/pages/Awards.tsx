import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RiCheckFill } from '@remixicon/react';
import { ACHIEVEMENTS } from '../data/achievements';
import { useSessions } from '../hooks/useSessions';
import { useCustomRoutines } from '../hooks/useCustomRoutines';

export function Awards() {
  const { sessions } = useSessions();
  const { customRoutines } = useCustomRoutines();

  const ctx = useMemo(
    () => ({ sessions, customRoutineCount: customRoutines.length }),
    [sessions, customRoutines],
  );

  const sortedAchievements = useMemo(() => {
    return [...ACHIEVEMENTS].sort((a, b) => {
      const aUnlocked = a.isUnlocked(ctx);
      const bUnlocked = b.isUnlocked(ctx);
      if (aUnlocked === bUnlocked) return 0;
      return aUnlocked ? -1 : 1;
    });
  }, [ctx]);

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.isUnlocked(ctx)).length;

  return (
    <div className="flex flex-col gap-5 pb-2">
      <header>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">Awards</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {unlockedCount} of {ACHIEVEMENTS.length} unlocked
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {sortedAchievements.map((achievement, i) => {
          const unlocked = achievement.isUnlocked(ctx);
          return (
            <motion.div
              key={achievement.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: Math.min(i, 8) * 0.03 }}
              className={`relative flex flex-col items-center gap-2 rounded-2xl p-4 text-center ring-1 transition-opacity ${
                unlocked
                  ? 'bg-white ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]'
                  : 'bg-white/60 opacity-50 ring-slate-100 dark:bg-white/[0.03] dark:ring-[var(--surface-border)]'
              }`}
            >
              {unlocked && (
                <span
                  className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  <RiCheckFill size="1em" />
                </span>
              )}
              <achievement.icon
                size={30}
                className={unlocked ? '' : 'text-slate-400 dark:text-slate-600'}
                style={unlocked ? { color: 'var(--accent)' } : undefined}
              />
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {achievement.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {achievement.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
