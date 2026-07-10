import { useLocalStorageState } from './useLocalStorageState';

export interface ActiveSessionState {
  routineId: string;
  index: number;
  msLeft: number;
  startedAt: string;
}

const KEY = 'str3tch:activeSession';

export function useActiveSession() {
  const [session, setSession] = useLocalStorageState<ActiveSessionState | null>(KEY, null);
  return { session, setSession };
}
