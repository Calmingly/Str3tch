import {
  TbMoodCry,
  TbMoodSad,
  TbMoodNeutral,
  TbMoodSmile,
  TbMoodHappy,
} from 'react-icons/tb';
import { useSessions } from '../hooks/useSessions';
import { useCountUp } from '../hooks/useCountUp';
import { addDays, dayKey, formatFriendlyDate, formatTime, todayKey } from '../lib/date';

const FEELING_ICON: Record<number, typeof TbMoodNeutral> = {
  1: TbMoodCry,
  2: TbMoodSad,
  3: TbMoodNeutral,
  4: TbMoodSmile,
  5: TbMoodHappy,
};

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
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
          <p className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
            {animatedCurrent}
          </p>
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
        {sessions.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No sessions yet — finish a routine to see it here.
          </p>
        )}
        {sessions.map((s) => {
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
                <FeelingIcon className="text-xl text-slate-400 dark:text-slate-500" />
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
