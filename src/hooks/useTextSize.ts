import { createContext, useContext, useEffect } from 'react';
import { useLocalStorageState } from './useLocalStorageState';

export type TextSize = 'normal' | 'large';

const KEY = 'str3tch:textSize';

interface TextSizeContextValue {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
}

export const TextSizeContext = createContext<TextSizeContextValue | null>(null);

export function useTextSizeState() {
  const [textSize, setTextSize] = useLocalStorageState<TextSize>(KEY, 'normal');

  useEffect(() => {
    document.documentElement.classList.toggle('text-large', textSize === 'large');
  }, [textSize]);

  return { textSize, setTextSize };
}

export function useTextSize() {
  const ctx = useContext(TextSizeContext);
  if (!ctx) throw new Error('useTextSize must be used within TextSizeContext.Provider');
  return ctx;
}
