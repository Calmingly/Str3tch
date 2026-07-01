import type { ReminderSettings } from '../types';
import { useLocalStorageState } from './useLocalStorageState';

const KEY = 'str3tch:reminder';
const DEFAULT: ReminderSettings = { enabled: false, time: '07:30' };

export function useReminderSettings() {
  const [settings, setSettings] = useLocalStorageState<ReminderSettings>(KEY, DEFAULT);
  return { settings, setSettings };
}
