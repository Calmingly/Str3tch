import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import { THEMES, DEFAULT_THEME_ID, type Palette } from '../lib/themes';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type TextSize = 'normal' | 'large';

interface ThemeSettingsValue {
  themeId: string;
  setThemeId: (id: string) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  isDark: boolean;
}

export const ThemeSettingsContext = createContext<ThemeSettingsValue | null>(null);

function useSystemPrefersDark() {
  const [prefersDark, setPrefersDark] = useState(
    () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefersDark;
}

function applyPalette(palette: Palette) {
  const root = document.documentElement.style;
  root.setProperty('--paper', palette.paper);
  root.setProperty('--paper-2', palette.paper2);
  root.setProperty('--ink', palette.ink);
  root.setProperty('--ink-soft', palette.inkSoft);
  root.setProperty('--rule', palette.rule);
  root.setProperty('--accent', palette.accent);
  root.setProperty('--accent-soft', palette.accentSoft);
}

export function useThemeSettingsState(): ThemeSettingsValue {
  const [themeId, setThemeId] = useLocalStorageState<string>('str3tch:theme', DEFAULT_THEME_ID);
  const [mode, setMode] = useLocalStorageState<ThemeMode>('str3tch:mode', 'auto');
  const [textSize, setTextSize] = useLocalStorageState<TextSize>('str3tch:text-size', 'normal');
  const prefersDark = useSystemPrefersDark();

  const isDark = mode === 'auto' ? prefersDark : mode === 'dark';

  useEffect(() => {
    const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
    applyPalette(isDark ? theme.dark : theme.light);
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [themeId, isDark]);

  useEffect(() => {
    document.documentElement.classList.toggle('text-large', textSize === 'large');
  }, [textSize]);

  return { themeId, setThemeId, mode, setMode, textSize, setTextSize, isDark };
}

export function useThemeSettings() {
  const ctx = useContext(ThemeSettingsContext);
  if (!ctx) throw new Error('useThemeSettings must be used within ThemeSettingsContext.Provider');
  return ctx;
}
