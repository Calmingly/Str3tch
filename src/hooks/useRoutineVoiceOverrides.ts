import { useLocalStorageState } from './useLocalStorageState';

export type VoiceOverride = 'on' | 'off' | null;

const KEY = 'str3tch:voiceOverrides';

export function useRoutineVoiceOverrides() {
  const [overrides, setOverrides] = useLocalStorageState<Record<string, VoiceOverride>>(KEY, {});

  const getOverride = (routineId: string): VoiceOverride => overrides[routineId] ?? null;

  const setOverride = (routineId: string, value: VoiceOverride) => {
    setOverrides((prev) => {
      if (value === null) {
        const { [routineId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [routineId]: value };
    });
  };

  return { getOverride, setOverride };
}

export function resolveVoiceEnabled(globalEnabled: boolean, override: VoiceOverride): boolean {
  if (override === 'on') return true;
  if (override === 'off') return false;
  return globalEnabled;
}
