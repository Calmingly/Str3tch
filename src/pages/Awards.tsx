import { useMemo } from 'react';
import { motion } from 'framer-motion';
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

  const unlockedCount = ACHIEVEMENTS.filter((a) => a.isUnlocked(ctx)).length;

  return (
    <div className="flex flex-col gap-5 pb-2">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Awards</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {unlockedCount} of {ACHIEVEMENTS.length} unlocked
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {ACHIEVEMENTS.map((achievement, i) => {
          const unlocked = achievement.isUnlocked(ctx);
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: Math.min(i, 8) * 0.03 }}
              className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-center shadow-sm ring-1 transition-opacity ${
                unlocked
                  ? 'bg-white ring-slate-100 dark:bg-slate-900 dark:ring-slate-800'
                  : 'bg-white/60 opacity-50 ring-slate-100 dark:bg-slate-900/40 dark:ring-slate-800'
              }`}
            >
              <span className={`text-3xl ${unlocked ? '' : 'grayscale'}`}>{achievement.icon}</span>
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
