import type { SessionRecord } from '../types';
import type { StreakInfo } from './streak';

export interface MomentumResult {
  score: number;
  tier: 'low' | 'mid' | 'high';
  message: string;
}

const WEEKLY_GOAL = 5;

export function computeMomentum(
  streak: StreakInfo,
  daysThisWeek: number,
  sessions: SessionRecord[],
): MomentumResult {
  const streakPoints = Math.min(streak.current / 7, 1) * 40;
  const weeklyPoints = Math.min(daysThisWeek / WEEKLY_GOAL, 1) * 40;

  const recentFeelings = sessions
    .slice(0, 5)
    .map((s) => s.feeling)
    .filter((f): f is NonNullable<typeof f> => f != null);
  const avgFeeling =
    recentFeelings.length > 0
      ? recentFeelings.reduce((sum, f) => sum + f, 0) / recentFeelings.length
      : 3;
  const feelingPoints = (avgFeeling / 5) * 20;

  const score = Math.round(streakPoints + weeklyPoints + feelingPoints);

  const tier: MomentumResult['tier'] = score >= 75 ? 'high' : score >= 40 ? 'mid' : 'low';
  const message =
    tier === 'high'
      ? 'Great momentum — keep it up'
      : tier === 'mid'
        ? 'Building momentum'
        : "Let's get moving";

  return { score, tier, message };
}
