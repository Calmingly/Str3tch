import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTINES } from '../data/routines';
import { routineDurationSeconds } from '../data/expand';
import { GOAL_COLORS, GOAL_LABELS, primaryGoal } from '../lib/goals';
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

export function Home() {
  const [filter, setFilter] = useState<Goal | null>(null);

  const visible = useMemo(
    () => (filter ? ROUTINES.filter((r) => r.goal.includes(filter)) : ROUTINES),
    [filter],
  );

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="font-serif text-4xl font-medium leading-none">
          Str<span style={{ color: 'var(--accent)' }}>3</span>tch
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
          A short list of routines. Pick one and go.
        </p>
      </header>

      <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => setFilter(f.value)}
              className="pb-0.5"
              style={{
                color: active ? 'var(--ink)' : 'var(--ink-soft)',
                borderBottom: active ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                fontWeight: active ? 600 : 400,
              }}
            >
              {f.label}
            </button>
          );
        })}
      </nav>

      <ol className="flex flex-col">
        {visible.map((routine, i) => {
          const goal = primaryGoal(routine.goal);
          return (
            <li key={routine.id} style={{ borderTop: '1px solid var(--rule)' }}>
              <Link
                to={`/routine/${routine.id}`}
                className="flex items-start gap-4 py-5 transition-opacity active:opacity-60"
              >
                <span
                  className="font-serif pt-0.5 text-lg tabular-nums"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  {pad(i + 1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-xl font-medium">{routine.name}</p>
                  <p className="mt-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
                    {routine.description}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: GOAL_COLORS[goal] }}
                    />
                    {GOAL_LABELS[goal]} · {minutes(routineDurationSeconds(routine))} min
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
