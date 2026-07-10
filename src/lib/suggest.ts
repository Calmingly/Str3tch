import type { Goal, Routine, SessionRecord } from '../types';

function preferredGoalForTime(hour: number): Goal {
  if (hour >= 5 && hour < 11) return 'habit-building';
  if (hour >= 11 && hour < 17) return 'targeted-relief';
  if (hour >= 17 && hour < 21) return 'activity-recovery';
  return 'general-mobility';
}

export function pickSuggestedRoutine(
  routines: Routine[],
  sessions: SessionRecord[],
  now: Date = new Date(),
): Routine {
  const lastCompleted = new Map<string, number>();
  for (const s of sessions) {
    const time = new Date(s.completedAt).getTime();
    const prev = lastCompleted.get(s.routineId);
    if (prev === undefined || time > prev) lastCompleted.set(s.routineId, time);
  }

  const rank = (list: Routine[]) =>
    list
      .map((routine, index) => ({
        routine,
        index,
        last: lastCompleted.get(routine.id) ?? -Infinity,
      }))
      .sort((a, b) => a.last - b.last || a.index - b.index);

  const preferredGoal = preferredGoalForTime(now.getHours());
  const timeMatched = routines.filter((r) => r.goal.includes(preferredGoal));
  const pool = timeMatched.length > 0 ? timeMatched : routines;

  return rank(pool)[0].routine;
}
