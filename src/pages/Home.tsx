import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ROUTINES } from '../data/routines';
import { routineDurationSeconds } from '../data/expand';
import { GOAL_COLORS, GOAL_LABELS, primaryGoal } from '../lib/goals';
import { StretchIllustration } from '../components/StretchIllustration';
import type { Goal } from '../types';

const FILTERS: { label: string; value: Goal | null }[] = [
  { label: 'All', value: null },
  ...(Object.keys(GOAL_LABELS) as Goal[]).map((g) => ({ label: GOAL_LABELS[g], value: g })),
];

function minutes(seconds: number) {
  return Math.round(seconds / 60);
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function Sprig() {
  return (
    <svg
      width="72"
      height="28"
      viewBox="0 0 72 28"
      fill="none"
      aria-hidden="true"
      className="opacity-70"
    >
      <path
        d="M2 24C16 24 20 6 36 6S56 24 70 24"
        stroke="var(--accent)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="14" cy="17.5" r="1.6" fill="var(--accent)" />
      <circle cx="36" cy="6" r="1.8" fill="var(--accent)" />
      <circle cx="58" cy="17.5" r="1.6" fill="var(--accent)" />
    </svg>
  );
}

export function Home() {
  const [filter, setFilter] = useState<Goal | null>(null);

  const visible = useMemo(
    () => (filter ? ROUTINES.filter((r) => r.goal.includes(filter)) : ROUTINES),
    [filter],
  );

  const totalMinutes = useMemo(
    () => ROUTINES.reduce((sum, r) => sum + minutes(routineDurationSeconds(r)), 0),
    [],
  );

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col items-start gap-3">
        <div className="flex w-full items-center justify-between">
          <Sprig />
          <span
            className="font-serif text-[11px] uppercase italic tracking-[0.2em]"
            style={{ color: 'var(--ink-soft)' }}
          >
            Vol. 01
          </span>
        </div>
        <h1 className="font-serif text-5xl font-medium leading-none tracking-tight">
          Str<span style={{ color: 'var(--accent)' }}>3</span>tch
        </h1>
        <p className="text-sm italic" style={{ color: 'var(--ink-soft)' }}>
          A short list of routines. Pick one and go.
        </p>
        <div
          className="mt-1 h-px w-full"
          style={{ background: 'linear-gradient(to right, var(--rule), transparent 85%)' }}
        />
        <div className="h-px w-full" style={{ backgroundColor: 'var(--rule)' }} />
      </header>

      <LayoutGroup>
        <nav className="flex flex-wrap gap-x-1 text-sm">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.label}
                type="button"
                onClick={() => setFilter(f.value)}
                className="relative px-2.5 pb-2"
                style={{
                  color: active ? 'var(--ink)' : 'var(--ink-soft)',
                  fontWeight: active ? 600 : 400,
                }}
              >
                {f.label}
                {active && (
                  <motion.span
                    layoutId="filter-underline"
                    className="absolute inset-x-2 bottom-0 h-[1.5px]"
                    style={{ backgroundColor: 'var(--accent)' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </LayoutGroup>

      <ol className="flex flex-col">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((routine, i) => {
            const goal = primaryGoal(routine.goal);
            return (
              <motion.li
                key={routine.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i, 5) * 0.04 }}
                className="relative overflow-hidden"
                style={{ borderTop: '1px solid var(--rule)' }}
              >
                <span
                  aria-hidden="true"
                  className="font-serif pointer-events-none absolute -right-2 -top-3 select-none text-[86px] font-medium leading-none"
                  style={{ color: 'var(--ink)', opacity: 0.045 }}
                >
                  {pad(i + 1)}
                </span>
                <Link
                  to={`/routine/${routine.id}`}
                  className="group relative flex items-center gap-4 py-5 transition-colors active:bg-[var(--paper-2)]"
                >
                  <span
                    className="font-serif w-6 shrink-0 text-lg tabular-nums"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    {pad(i + 1)}
                  </span>
                  <StretchIllustration
                    stretchId={routine.steps[0].stretchId}
                    tone="duotone"
                    size={52}
                    className="ring-1 ring-black/5 transition-transform group-active:scale-95 dark:ring-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-xl font-medium">{routine.name}</p>
                    <p className="mt-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
                      {routine.description}
                    </p>
                    <p
                      className="mt-2 flex items-center gap-1.5 text-xs uppercase tracking-wide"
                      style={{ color: 'var(--ink-soft)' }}
                    >
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: GOAL_COLORS[goal] }}
                      />
                      {GOAL_LABELS[goal]} · {minutes(routineDurationSeconds(routine))} min
                    </p>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>

      <footer
        className="flex flex-col items-center gap-1 pb-2 pt-2 text-center text-[11px] uppercase tracking-[0.2em]"
        style={{ color: 'var(--ink-soft)' }}
      >
        <Sprig />
        <p className="mt-1">
          {ROUTINES.length} routines · {totalMinutes} minutes, cover to cover
        </p>
      </footer>
    </div>
  );
}
