import { createContext, useContext, useEffect } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import { ACCENT_THEMES, DEFAULT_ACCENT_ID, type AccentTheme } from '../lib/accentThemes';

const KEY = 'str3tch:accent';

interface AccentContextValue {
  accentId: string;
  setAccentId: (id: string) => void;
  accent: AccentTheme;
}

export const AccentContext = createContext<AccentContextValue | null>(null);

function isCustomHex(id: string) {
  return /^#[0-9a-f]{6}$/i.test(id);
}

export function useAccentThemeState() {
  const [accentId, setAccentId] = useLocalStorageState<string>(KEY, DEFAULT_ACCENT_ID);
  const accent: AccentTheme = isCustomHex(accentId)
    ? { id: accentId, name: 'Custom', hex: accentId, hexSoft: `${accentId}22` }
    : (ACCENT_THEMES.find((a) => a.id === accentId) ?? ACCENT_THEMES[0]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', accent.hex);
    root.style.setProperty('--accent-soft', accent.hexSoft);
  }, [accent.hex, accent.hexSoft]);

  return { accentId, setAccentId, accent };
}

export function useAccentTheme() {
  const ctx = useContext(AccentContext);
  if (!ctx) throw new Error('useAccentTheme must be used within AccentContext.Provider');
  return ctx;
}
