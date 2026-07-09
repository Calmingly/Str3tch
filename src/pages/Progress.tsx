import { useMemo, useState } from 'react';
import { FaceFrownIcon, MinusCircleIcon, FaceSmileIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  FaceFrownIcon as FaceFrownIconSolid,
  FaceSmileIcon as FaceSmileIconSolid,
} from '@heroicons/react/24/solid';
import { useSessions } from '../hooks/useSessions';
import { useCountUp } from '../hooks/useCountUp';
import { addDays, dayKey, formatFriendlyDate, formatTime, todayKey } from '../lib/date';
import { RingProgress } from '../components/RingProgress';

type HistoryRange = 'all' | '7d' | '30d';

const RANGE_OPTIONS: { value: HistoryRange; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
];

const FEELING_ICON: Record<number, typeof MinusCircleIcon> = {
  1: FaceFrownIconSolid,
  2: FaceFrownIcon,
  3: MinusCircleIcon,
  4: FaceSmileIcon,
  5: FaceSmileIconSolid,
};

const STREAK_RING_GOAL_DAYS = 7;

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function last28Days(): string[] {
  const today = todayKey();
  const days: string[] = [];
  for (let i = 27; i >= 0; i--) days.push(addDays(today, -i));
  return days;
}

function last7Days(): string[] {
  const today = todayKey();
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) days.push(addDays(today, -i));
  return days;
}

export function Progress() {
  const { sessions, streak } = useSessions();
  const days = last28Days();
  const week = last7Days();
  const [query, setQuery] = useState('');
  const [range, setRange] = useState<HistoryRange>('all');

  const filteredSessions = useMemo(() => {
    const cutoffDays = range === '7d' ? 7 : range === '30d' ? 30 : null;
    const cutoffTime = cutoffDays !== null ? Date.now() - cutoffDays * 86400000 : null;
    const q = query.trim().toLowerCase();
    return sessions.filter((s) => {
      if (q && !s.routineName.toLowerCase().includes(q)) return false;
      if (cutoffTime !== null && new Date(s.completedAt).getTime() < cutoffTime) return false;
      return true;
    });
  }, [sessions, query, range]);

  const minutesByDay = new Map<string, number>();
  for (const s of sessions) {
    const key = dayKey(s.completedAt);
    minutesByDay.set(key, (minutesByDay.get(key) ?? 0) + s.durationSeconds / 60);
  }
  const maxMinutes = Math.max(1, ...week.map((d) => minutesByDay.get(d) ?? 0));

  const animatedCurrent = useCountUp(streak.current);
  const animatedLongest = useCountUp(streak.longest);
  const animatedTotal = useCountUp(streak.totalSessions);

  return (
    <div className="flex flex-col gap-6 pb-4">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Progress</h1>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-1 rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
          <RingProgress
            progress={Math.min(1, streak.current / STREAK_RING_GOAL_DAYS)}
            size={52}
            strokeWidth={5}
            color="var(--accent)"
            trackColor="var(--accent-soft)"
          >
            <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
              {animatedCurrent}
            </p>
          </RingProgress>
          <p className="text-xs text-slate-500 dark:text-slate-400">Day streak</p>
        </div>
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
          <p className="text-2xl font-bold text-orange-500">{animatedLongest}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Best streak</p>
        </div>
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
          <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
            {animatedTotal}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total sessions</p>
        </div>
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-400">
          This week
        </h2>
        <div className="flex items-end justify-between gap-2" style={{ height: 96 }}>
          {week.map((day) => {
            const mins = minutesByDay.get(day) ?? 0;
            const heightPct = Math.max(6, (mins / maxMinutes) * 100);
            const weekday = new Date(day).getDay();
            return (
              <div key={day} className="flex flex-1 flex-col items-center justify-end gap-1.5">
                <div className="flex h-20 w-full items-end">
                  <div
                    className={`w-full rounded-full transition-all ${
                      mins === 0 ? 'bg-slate-100 dark:bg-slate-800' : ''
                    }`}
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: mins > 0 ? 'var(--accent)' : undefined,
                    }}
                    title={`${Math.round(mins)} min`}
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  {WEEKDAY_LABELS[weekday]}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">
          Last 4 weeks
        </h2>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => (
            <div
              key={day}
              title={day}
              className={`aspect-square rounded-md ${
                streak.daysThisWeek.has(day) ? '' : 'bg-slate-100 dark:bg-slate-800'
              }`}
              style={streak.daysThisWeek.has(day) ? { backgroundColor: 'var(--accent)' } : undefined}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">History</h2>

        {sessions.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
              <MagnifyingGlassIcon className="size-[1em] text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by routine name"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
            </div>
            <div className="flex gap-2">
              {RANGE_OPTIONS.map((opt) => {
                const active = range === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRange(opt.value)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      active
                        ? 'text-white'
                        : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                    style={active ? { backgroundColor: 'var(--accent)' } : undefined}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {sessions.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No sessions yet — finish a routine to see it here.
          </p>
        )}
        {sessions.length > 0 && filteredSessions.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No sessions match your search.
          </p>
        )}
        {filteredSessions.map((s) => {
          const FeelingIcon = s.feeling ? FEELING_ICON[s.feeling] : null;
          return (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {s.routineName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatFriendlyDate(s.completedAt)} · {formatTime(s.completedAt)} ·{' '}
                  {Math.round(s.durationSeconds / 60)} min
                </p>
              </div>
              {FeelingIcon && (
                <FeelingIcon className="size-[1.25em] text-slate-400 dark:text-slate-500" />
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
