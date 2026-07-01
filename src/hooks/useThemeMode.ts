import { createContext, useContext, useEffect } from 'react';
import { useLocalStorageState } from './useLocalStorageState';

export type ThemeMode = 'light' | 'dark' | 'auto';

const KEY = 'str3tch:theme';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolved: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useThemeModeState() {
  const [mode, setMode] = useLocalStorageState<ThemeMode>(KEY, 'auto');
  const resolved = mode === 'auto' ? (systemPrefersDark() ? 'dark' : 'light') : mode;

  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const isDark = mode === 'auto' ? systemPrefersDark() : mode === 'dark';
      root.classList.toggle('dark', isDark);
    };
    apply();

    if (mode === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [mode]);

  return { mode, setMode, resolved };
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeContext.Provider');
  return ctx;
}
