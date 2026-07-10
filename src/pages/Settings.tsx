import { useEffect, useRef, useState } from 'react';
import {
  RiSunLine,
  RiMoonLine,
  RiComputerLine,
  RiCheckFill,
  RiPaletteLine,
  RiDownload2Line,
  RiUpload2Line,
  RiDeleteBin6Line,
} from '@remixicon/react';
import { useReminderSettings } from '../hooks/useReminderSettings';
import {
  notificationsSupported,
  requestNotificationPermission,
} from '../hooks/useReminderScheduler';
import { useVoiceSettings, speechSupported } from '../hooks/useVoiceSettings';
import { useThemeMode, type ThemeMode } from '../hooks/useThemeMode';
import { useAccentTheme } from '../hooks/useAccentTheme';
import { useTextSize } from '../hooks/useTextSize';
import { useCompactMode } from '../hooks/useCompactMode';
import { ACCENT_THEMES } from '../lib/accentThemes';
import { exportData, importData, resetAllData } from '../lib/dataTransfer';

const THEME_OPTIONS: { value: ThemeMode; label: string; Icon: typeof RiSunLine }[] = [
  { value: 'light', label: 'Light', Icon: RiSunLine },
  { value: 'dark', label: 'Dark', Icon: RiMoonLine },
  { value: 'auto', label: 'Auto', Icon: RiComputerLine },
];

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="h-6 w-11 shrink-0 rounded-full transition-colors bg-slate-200 dark:bg-slate-700"
      style={checked ? { backgroundColor: 'var(--accent)' } : undefined}
    >
      <span
        className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[22px]' : ''
        }`}
      />
    </button>
  );
}

const CUSTOM_HEX_RE = /^#[0-9a-f]{6}$/i;

export function Settings() {
  const { settings, setSettings } = useReminderSettings();
  const { settings: voice, setSettings: setVoice } = useVoiceSettings();
  const { mode, setMode } = useThemeMode();
  const { accentId, accent, setAccentId } = useAccentTheme();
  const { textSize, setTextSize } = useTextSize();
  const { compact, setCompact } = useCompactMode();
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    notificationsSupported() ? Notification.permission : 'unsupported',
  );
  const importInputRef = useRef<HTMLInputElement>(null);
  const isCustomAccent = CUSTOM_HEX_RE.test(accentId);

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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
      </header>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <p className="mb-3 font-semibold text-slate-900 dark:text-slate-100">Appearance</p>
        <div className="grid grid-cols-3 gap-2">
          {THEME_OPTIONS.map((opt) => {
            const active = mode === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMode(opt.value)}
                className={`flex flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-semibold transition-colors ${
                  active
                    ? 'text-white'
                    : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
                style={active ? { backgroundColor: 'var(--accent)' } : undefined}
              >
                <opt.Icon size="1.1em" />
                {opt.label}
              </button>
            );
          })}
        </div>

        <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Color theme
        </p>
        <div className="grid grid-cols-7 gap-2">
          {ACCENT_THEMES.map((theme) => {
            const active = accentId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setAccentId(theme.id)}
                aria-label={theme.name}
                title={theme.name}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform ${
                  active ? 'scale-110' : ''
                }`}
                style={{ backgroundColor: theme.hex }}
              >
                {active && <RiCheckFill size="1em" className="text-white" />}
              </button>
            );
          })}
          <label
            className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-1 ring-inset ring-black/10 transition-transform dark:ring-white/15 ${
              isCustomAccent ? 'scale-110' : ''
            }`}
            style={{
              background: isCustomAccent
                ? accent.hex
                : 'conic-gradient(from 0deg, #f43f5e, #f97316, #eab308, #10b981, #0ea5e9, #8b5cf6, #f43f5e)',
            }}
            title="Custom color"
          >
            {isCustomAccent ? (
              <RiCheckFill size="1em" className="text-white" />
            ) : (
              <RiPaletteLine size="1em" className="text-white drop-shadow" />
            )}
            <input
              type="color"
              value={isCustomAccent ? accent.hex : '#0ea5e9'}
              onChange={(e) => setAccentId(e.target.value)}
              aria-label="Pick a custom accent color"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">Daily reminder</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A nudge to stretch each day.
            </p>
          </div>
          <ToggleSwitch checked={settings.enabled} onChange={handleToggle} />
        </div>

        {settings.enabled && (
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <label htmlFor="reminder-time" className="text-sm text-slate-600 dark:text-slate-300">
              Remind me at
            </label>
            <input
              id="reminder-time"
              type="time"
              value={settings.time}
              onChange={(e) => setSettings((prev) => ({ ...prev, time: e.target.value }))}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        )}

        {permission === 'unsupported' && (
          <p className="mt-3 text-xs text-amber-600">
            Notifications aren't supported in this browser.
          </p>
        )}
        {permission === 'denied' && (
          <p className="mt-3 text-xs text-amber-600">
            Notifications are blocked for this site. Enable them in your browser/OS settings to
            use reminders.
          </p>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">Larger text</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Increase text size throughout the app.
            </p>
          </div>
          <ToggleSwitch
            checked={textSize === 'large'}
            onChange={(large) => setTextSize(large ? 'large' : 'normal')}
          />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">Compact mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tighten spacing to fit more on screen.
            </p>
          </div>
          <ToggleSwitch checked={compact} onChange={setCompact} />
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">Voice guidance</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Announce each stretch out loud during a session.
            </p>
          </div>
          <ToggleSwitch
            checked={voice.enabled}
            onChange={(enabled) => setVoice({ enabled })}
          />
        </div>
        {!speechSupported() && (
          <p className="mt-3 text-xs text-amber-600">
            Voice guidance isn't supported in this browser.
          </p>
        )}
      </section>

      <section className="rounded-2xl bg-white p-4 text-sm text-slate-500 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:text-slate-400 dark:ring-[var(--surface-border)]">
        <p className="font-semibold text-slate-900 dark:text-slate-100">About reminders</p>
        <p className="mt-1">
          This is a local-only app with no account or server, so reminders only fire while
          Str3tch is open or running in the background on devices that support it. For the most
          reliable nudges, add Str3tch to your home screen (browser menu → "Add to Home Screen")
          and keep notifications allowed. iOS Safari in particular limits background
          notifications for web apps.
        </p>
      </section>

      <section className="rounded-2xl bg-white p-4 text-sm text-slate-500 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:text-slate-400 dark:ring-[var(--surface-border)]">
        <p className="font-semibold text-slate-900 dark:text-slate-100">Your data</p>
        <p className="mt-1">
          Session history and settings are stored only on this device (browser local storage).
          Clearing your browser data will erase your history.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => exportData()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <RiDownload2Line size="1.1em" /> Export
          </button>
          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <RiUpload2Line size="1.1em" /> Import
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importData(file);
              e.target.value = '';
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                'Reset all data? This clears your session history, routines, and settings on this device. This cannot be undone.',
              )
            ) {
              resetAllData();
            }
          }}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-red-50 py-2.5 text-sm font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400"
        >
          <RiDeleteBin6Line size="1.1em" /> Reset all data
        </button>
      </section>
    </div>
  );
}
