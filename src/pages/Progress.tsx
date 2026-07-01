import { useSessions } from '../hooks/useSessions';
import { addDays, formatFriendlyDate, formatTime, todayKey } from '../lib/date';

const FEELING_EMOJI: Record<number, string> = {
  1: '😣',
  2: '😕',
  3: '🙂',
  4: '😌',
  5: '🤩',
};

function last28Days(): string[] {
  const today = todayKey();
  const days: string[] = [];
  for (let i = 27; i >= 0; i--) days.push(addDays(today, -i));
  return days;
}

export function Progress() {
  const { sessions, streak } = useSessions();
  const days = last28Days();

  return (
    <div className="flex flex-col gap-6 pb-4">
      <header>
        <h1 className="text-2xl font-semibold text-white">Progress</h1>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center">
          <p className="text-2xl font-semibold text-sky-400">{streak.current}</p>
          <p className="text-xs text-slate-400">Day streak</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center">
          <p className="text-2xl font-semibold text-white">{streak.longest}</p>
          <p className="text-xs text-slate-400">Best streak</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-center">
          <p className="text-2xl font-semibold text-white">{streak.totalSessions}</p>
          <p className="text-xs text-slate-400">Total sessions</p>
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Last 4 weeks
        </h2>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => (
            <div
              key={day}
              title={day}
              className={`aspect-square rounded-md ${
                streak.daysThisWeek.has(day) ? 'bg-sky-500' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          History
        </h2>
        {sessions.length === 0 && (
          <p className="text-sm text-slate-500">
            No sessions yet — finish a routine to see it here.
          </p>
        )}
        {sessions.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-white">{s.routineName}</p>
              <p className="text-xs text-slate-400">
                {formatFriendlyDate(s.completedAt)} · {formatTime(s.completedAt)} ·{' '}
                {Math.round(s.durationSeconds / 60)} min
              </p>
            </div>
            {s.feeling && <span className="text-xl">{FEELING_EMOJI[s.feeling]}</span>}
          </div>
        ))}
      </section>
    </div>
  );
}
