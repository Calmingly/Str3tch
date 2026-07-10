import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeSettings, type ThemeMode, type TextSize } from '../hooks/useThemeSettings';
import { THEMES } from '../lib/themes';
import { ArrowLeftIcon, AutoIcon, CheckIcon, MoonIcon, SunIcon } from '../components/icons';

const MODES: { value: ThemeMode; label: string; Icon: typeof SunIcon }[] = [
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
  { value: 'auto', label: 'Auto', Icon: AutoIcon },
];

const TEXT_SIZES: { value: TextSize; label: string }[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Large' },
];

export function Settings() {
  const { themeId, setThemeId, mode, setMode, textSize, setTextSize } = useThemeSettings();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm"
          style={{ color: 'var(--ink-soft)' }}
        >
          <ArrowLeftIcon size={16} /> Routines
        </Link>
        <h1 className="font-serif mt-4 text-3xl font-medium leading-tight">Settings</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
          Make it yours. Changes apply immediately.
        </p>
      </div>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--ink-soft)' }}>
          Appearance
        </h2>
        <div className="mt-3 flex gap-2">
          {MODES.map(({ value, label, Icon }) => {
            const active = mode === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className="flex flex-1 flex-col items-center gap-1.5 rounded-2xl py-3 text-xs font-medium transition-transform active:scale-[0.97]"
                style={{
                  border: `1.4px solid ${active ? 'var(--accent)' : 'var(--rule)'}`,
                  color: active ? 'var(--accent)' : 'var(--ink-soft)',
                }}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--ink-soft)' }}>
          Text size
        </h2>
        <div className="mt-3 flex gap-2">
          {TEXT_SIZES.map(({ value, label }) => {
            const active = textSize === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setTextSize(value)}
                className="flex-1 rounded-2xl py-3 text-sm font-medium transition-transform active:scale-[0.97]"
                style={{
                  border: `1.4px solid ${active ? 'var(--accent)' : 'var(--rule)'}`,
                  color: active ? 'var(--accent)' : 'var(--ink-soft)',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--ink-soft)' }}>
          Theme
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {THEMES.map((theme) => {
            const active = themeId === theme.id;
            return (
              <motion.button
                key={theme.id}
                type="button"
                onClick={() => setThemeId(theme.id)}
                whileTap={{ scale: 0.96 }}
                className="relative flex flex-col gap-2 overflow-hidden rounded-2xl p-2.5 text-left"
                style={{ border: `1.4px solid ${active ? theme.light.accent : 'var(--rule)'}` }}
              >
                <div className="relative flex h-16 w-full overflow-hidden rounded-xl">
                  <div className="flex-1" style={{ backgroundColor: theme.light.paper }} />
                  <div className="flex-1" style={{ backgroundColor: theme.dark.paper }} />
                  <div
                    className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${theme.light.accent} 50%, ${theme.dark.accent} 50%)`,
                      boxShadow: '0 0 0 2px var(--paper)',
                    }}
                  />
                  {active && (
                    <span
                      className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ backgroundColor: theme.light.accent, color: theme.light.paper }}
                    >
                      <CheckIcon size={12} />
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-serif text-sm font-medium">{theme.name}</p>
                  <p className="mt-0.5 text-[11px] leading-snug" style={{ color: 'var(--ink-soft)' }}>
                    {theme.blurb}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
