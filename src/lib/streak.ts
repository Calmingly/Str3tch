import type { SessionRecord } from '../types';
import { addDays, dayKey, todayKey } from './date';

export interface StreakInfo {
  current: number;
  longest: number;
  totalSessions: number;
  daysThisWeek: Set<string>;
  graceUsed: boolean;
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
  let graceUsed = false;
  let graceAvailable = true;
  while (true) {
    if (days.has(cursor)) {
      current += 1;
      cursor = addDays(cursor, -1);
      continue;
    }
    // Forgive a single missed day per streak so one busy evening doesn't zero it out.
    if (graceAvailable && current > 0 && days.has(addDays(cursor, -1))) {
      graceAvailable = false;
      graceUsed = true;
      cursor = addDays(cursor, -1);
      continue;
    }
    break;
  }

  return {
    current,
    longest,
    totalSessions: sessions.length,
    daysThisWeek: days,
    graceUsed,
  };
}
