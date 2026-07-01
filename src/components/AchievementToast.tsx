import type { Achievement } from '../data/achievements';

export function AchievementToast({ achievement }: { achievement: Achievement }) {
  return (
    <div className="animate-pop flex items-center gap-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-3 text-white shadow-lg">
      <achievement.icon className="text-3xl" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
          Achievement unlocked
        </p>
        <p className="text-sm font-bold">{achievement.name}</p>
      </div>
    </div>
  );
}
