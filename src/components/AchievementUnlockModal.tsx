import { motion } from 'framer-motion';
import type { Achievement } from '../data/achievements';

interface AchievementUnlockModalProps {
  achievements: Achievement[];
  onDismiss: () => void;
}

export function AchievementUnlockModal({ achievements, onDismiss }: AchievementUnlockModalProps) {
  const [first, ...rest] = achievements;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-6 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', bounce: 0.45, duration: 0.6 }}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-xs flex-col items-center gap-3 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-center text-white shadow-2xl"
      >
        <p className="text-xs font-bold uppercase tracking-wide text-white/80">
          Achievement unlocked
        </p>
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.6, delay: 0.15, duration: 0.5 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20"
        >
          <first.icon size={44} />
        </motion.div>
        <p className="text-xl font-extrabold">{first.name}</p>
        <p className="text-sm text-white/90">{first.description}</p>
        {rest.length > 0 && (
          <p className="text-xs font-semibold text-white/80">+{rest.length} more unlocked</p>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="mt-2 w-full rounded-xl bg-white/20 py-2.5 text-sm font-bold"
        >
          Nice!
        </button>
      </motion.div>
    </motion.div>
  );
}
