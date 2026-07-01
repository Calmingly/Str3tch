import { useLocalStorageState } from './useLocalStorageState';

export interface VoiceSettings {
  enabled: boolean;
}

const KEY = 'str3tch:voice';
const DEFAULT: VoiceSettings = { enabled: false };

export function useVoiceSettings() {
  const [settings, setSettings] = useLocalStorageState<VoiceSettings>(KEY, DEFAULT);
  return { settings, setSettings };
}

export function speechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speak(text: string) {
  if (!speechSupported()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}
