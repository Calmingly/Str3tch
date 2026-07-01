import { useMemo } from 'react';
import type { SessionRecord } from '../types';
import { useLocalStorageState } from './useLocalStorageState';
import { computeStreak } from '../lib/streak';

const KEY = 'str3tch:sessions';

export function useSessions() {
  const [sessions, setSessions] = useLocalStorageState<SessionRecord[]>(KEY, []);

  const addSession = (record: Omit<SessionRecord, 'id'>) => {
    const withId: SessionRecord = { ...record, id: crypto.randomUUID() };
    setSessions((prev) => [withId, ...prev]);
    return withId;
  };

  const sorted = useMemo(
    () => [...sessions].sort((a, b) => b.completedAt.localeCompare(a.completedAt)),
    [sessions],
  );

  const streak = useMemo(() => computeStreak(sessions), [sessions]);

  return { sessions: sorted, addSession, streak };
}
