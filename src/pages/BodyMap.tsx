import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiSearchLine } from '@remixicon/react';
import type { BodyArea } from '../types';
import { useAllRoutines } from '../hooks/useAllRoutines';
import { primaryGoalStyle, routineIcon } from '../lib/theme';
import { routineDurationSeconds } from '../data/expand';
import { EmptyState } from '../components/EmptyState';

interface Hotspot {
  areas: BodyArea[];
  label: string;
  cx: number;
  cy: number;
  r: number;
}

const HOTSPOTS: Hotspot[] = [
  { areas: ['neck'], label: 'Neck', cx: 50, cy: 16, r: 10 },
  { areas: ['shoulders'], label: 'Shoulders', cx: 50, cy: 33, r: 15 },
  { areas: ['wrists'], label: 'Wrists', cx: 22, cy: 51, r: 8 },
  { areas: ['back'], label: 'Back', cx: 50, cy: 58, r: 17 },
  { areas: ['hips'], label: 'Hips', cx: 50, cy: 82, r: 13 },
  { areas: ['hamstrings', 'quads'], label: 'Thighs', cx: 50, cy: 108, r: 14 },
  { areas: ['calves'], label: 'Calves', cx: 50, cy: 138, r: 12 },
];

function minutes(seconds: number) {
  return Math.round(seconds / 60);
}

export function BodyMap() {
  const [selected, setSelected] = useState<Hotspot | null>(null);
  const { all } = useAllRoutines();

  const matches = selected
    ? all.filter((r) => r.area.some((a) => selected.areas.includes(a)))
    : [];

  return (
    <div className="flex flex-col gap-5 pb-2">
      <header>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-100">Where's it tight?</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Tap a spot to find routines for that area.
        </p>
      </header>

      <div className="rounded-3xl bg-white p-4 ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <svg viewBox="0 0 100 160" className="mx-auto h-80 w-auto">
          <g fill="none" stroke="#cbd5e1" strokeWidth={3} strokeLinecap="round" className="dark:stroke-slate-700">
            <circle cx={50} cy={14} r={9} />
            <path d="M50 23 L50 85" />
            <path d="M50 30 L28 50" />
            <path d="M50 30 L72 50" />
            <path d="M35 85 L30 140" />
            <path d="M65 85 L70 140" />
            <path d="M35 85 L65 85" />
          </g>
          {HOTSPOTS.map((h) => {
            const isSelected = selected?.label === h.label;
            return (
              <g key={h.label} onClick={() => setSelected(h)} className="cursor-pointer">
                <circle
                  cx={h.cx}
                  cy={h.cy}
                  r={h.r}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  style={{
                    fill: 'var(--accent-soft)',
                    stroke: 'var(--accent)',
                    opacity: isSelected ? 1 : 0.55,
                  }}
                />
                <text
                  x={h.cx}
                  y={h.cy + 3}
                  textAnchor="middle"
                  className="pointer-events-none select-none fill-slate-600 dark:fill-slate-300"
                  fontSize={6}
                  fontWeight={600}
                >
                  {h.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selected && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
            Routines for {selected.label.toLowerCase()}
          </h2>
          {matches.length === 0 && (
            <EmptyState
              icon={RiSearchLine}
              title="No routines target this area yet"
              description="Try another spot, or build your own routine."
            />
          )}
          {matches.length > 0 && (
            <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
              {matches.map((routine) => {
                const style = primaryGoalStyle(routine.goal);
                const Icon = routineIcon(routine);
                return (
                  <Link
                    key={routine.id}
                    to={`/routine/${routine.id}`}
                    className="flex items-center gap-3 border-b border-slate-100 py-3 pl-3 pr-4 transition-colors last:border-0 active:bg-slate-50 dark:border-white/5 dark:active:bg-white/5"
                  >
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br text-lg text-white ${style.gradient}`}
                    >
                      <Icon size="1em" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-black dark:text-white">
                        {routine.name}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-slate-400">
                      {minutes(routineDurationSeconds(routine))} min
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
