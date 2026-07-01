import type { Routine } from '../types';
import { useLocalStorageState } from './useLocalStorageState';

const KEY = 'str3tch:customRoutines';

export function useCustomRoutines() {
  const [customRoutines, setCustomRoutines] = useLocalStorageState<Routine[]>(KEY, []);

  const save = (routine: Routine) => {
    setCustomRoutines((prev) => {
      const existingIndex = prev.findIndex((r) => r.id === routine.id);
      if (existingIndex === -1) return [...prev, routine];
      const next = [...prev];
      next[existingIndex] = routine;
      return next;
    });
  };

  const remove = (id: string) => {
    setCustomRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  return { customRoutines, save, remove };
}
