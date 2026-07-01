import { useEffect } from 'react';
import type { ReminderSettings } from '../types';
import { todayKey } from '../lib/date';

const LAST_NOTIFIED_KEY = 'str3tch:lastNotified';

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) return 'denied';
  if (Notification.permission !== 'default') return Notification.permission;
  return Notification.requestPermission();
}

export function useReminderScheduler(settings: ReminderSettings) {
  useEffect(() => {
    if (!settings.enabled || !notificationsSupported()) return;

    const checkAndFire = () => {
      if (Notification.permission !== 'granted') return;
      const lastNotified = localStorage.getItem(LAST_NOTIFIED_KEY);
      if (lastNotified === todayKey()) return;

      const now = new Date();
      const [hh, mm] = settings.time.split(':').map(Number);
      const dueTime = new Date();
      dueTime.setHours(hh, mm, 0, 0);

      if (now >= dueTime) {
        new Notification('Time to stretch', {
          body: 'A few minutes now will save you from stiffness later.',
          icon: `${import.meta.env.BASE_URL}icons/icon-192.png`,
          tag: 'str3tch-daily-reminder',
        });
        localStorage.setItem(LAST_NOTIFIED_KEY, todayKey());
      }
    };

    checkAndFire();
    const interval = window.setInterval(checkAndFire, 60_000);
    return () => window.clearInterval(interval);
  }, [settings.enabled, settings.time]);
}
