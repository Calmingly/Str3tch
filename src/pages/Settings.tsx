import { useEffect, useState } from 'react';
import { useReminderSettings } from '../hooks/useReminderSettings';
import {
  notificationsSupported,
  requestNotificationPermission,
} from '../hooks/useReminderScheduler';

export function Settings() {
  const { settings, setSettings } = useReminderSettings();
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    notificationsSupported() ? Notification.permission : 'unsupported',
  );

  useEffect(() => {
    if (notificationsSupported()) setPermission(Notification.permission);
  }, [settings.enabled]);

  const handleToggle = async (enabled: boolean) => {
    if (enabled) {
      const result = await requestNotificationPermission();
      setPermission(result);
      if (result !== 'granted') {
        setSettings((prev) => ({ ...prev, enabled: false }));
        return;
      }
    }
    setSettings((prev) => ({ ...prev, enabled }));
  };

  return (
    <div className="flex flex-col gap-6 pb-4">
      <header>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
      </header>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Daily reminder</p>
            <p className="text-xs text-slate-400">A nudge to stretch each day.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.enabled}
            onClick={() => handleToggle(!settings.enabled)}
            className={`h-6 w-11 shrink-0 rounded-full transition-colors ${
              settings.enabled ? 'bg-sky-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform ${
                settings.enabled ? 'translate-x-[22px]' : ''
              }`}
            />
          </button>
        </div>

        {settings.enabled && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
            <label htmlFor="reminder-time" className="text-sm text-slate-300">
              Remind me at
            </label>
            <input
              id="reminder-time"
              type="time"
              value={settings.time}
              onChange={(e) => setSettings((prev) => ({ ...prev, time: e.target.value }))}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-white"
            />
          </div>
        )}

        {permission === 'unsupported' && (
          <p className="mt-3 text-xs text-amber-400">
            Notifications aren't supported in this browser.
          </p>
        )}
        {permission === 'denied' && (
          <p className="mt-3 text-xs text-amber-400">
            Notifications are blocked for this site. Enable them in your browser/OS settings to
            use reminders.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
        <p className="font-medium text-slate-200">About reminders</p>
        <p className="mt-1">
          This is a local-only app with no account or server, so reminders only fire while
          Str3tch is open or running in the background on devices that support it. For the most
          reliable nudges, add Str3tch to your home screen (browser menu → "Add to Home Screen")
          and keep notifications allowed. iOS Safari in particular limits background
          notifications for web apps.
        </p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
        <p className="font-medium text-slate-200">Your data</p>
        <p className="mt-1">
          Session history and settings are stored only on this device (browser local storage).
          Clearing your browser data will erase your history.
        </p>
      </section>
    </div>
  );
}
