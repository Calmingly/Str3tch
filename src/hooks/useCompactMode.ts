import { createContext, useContext, useEffect } from 'react';
import { useLocalStorageState } from './useLocalStorageState';

const KEY = 'str3tch:compact';

interface CompactModeContextValue {
  compact: boolean;
  setCompact: (compact: boolean) => void;
}

export const CompactModeContext = createContext<CompactModeContextValue | null>(null);

export function useCompactModeState() {
  const [compact, setCompact] = useLocalStorageState<boolean>(KEY, false);

  useEffect(() => {
    document.documentElement.classList.toggle('compact', compact);
  }, [compact]);

  return { compact, setCompact };
}

export function useCompactMode() {
  const ctx = useContext(CompactModeContext);
  if (!ctx) throw new Error('useCompactMode must be used within CompactModeContext.Provider');
  return ctx;
}
