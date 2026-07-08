import type { Routine, SessionRecord } from '../types';

export function pickSuggestedRoutine(routines: Routine[], sessions: SessionRecord[]): Routine {
  const lastCompleted = new Map<string, number>();
  for (const s of sessions) {
    const time = new Date(s.completedAt).getTime();
    const prev = lastCompleted.get(s.routineId);
    if (prev === undefined || time > prev) lastCompleted.set(s.routineId, time);
  }

  const ranked = routines
    .map((routine, index) => ({
      routine,
      index,
      last: lastCompleted.get(routine.id) ?? -Infinity,
    }))
    .sort((a, b) => a.last - b.last || a.index - b.index);

  return ranked[0].routine;
}
