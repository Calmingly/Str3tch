import type { SessionRecord } from '../types';
import { addDays, dayKey, todayKey } from './date';

export interface StreakInfo {
  current: number;
  longest: number;
  totalSessions: number;
  daysThisWeek: Set<string>;
}

export function computeStreak(sessions: SessionRecord[]): StreakInfo {
  const days = new Set(sessions.map((s) => dayKey(s.completedAt)));
  const sortedDays = Array.from(days).sort();

  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of sortedDays) {
    if (prev !== null && addDays(prev, 1) === day) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = day;
  }

  const today = todayKey();
  let cursor = days.has(today) ? today : addDays(today, -1);
  let current = 0;
  while (days.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  return {
    current,
    longest,
    totalSessions: sessions.length,
    daysThisWeek: days,
  };
}
