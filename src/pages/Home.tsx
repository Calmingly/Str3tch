import { Link } from 'react-router-dom';
import { ROUTINES } from '../data/routines';
import { routineDurationSeconds } from '../data/expand';
import { useSessions } from '../hooks/useSessions';
import { GOAL_STYLES, primaryGoalStyle } from '../lib/theme';
import { RingProgress } from '../components/RingProgress';
import { addDays, dayKey, todayKey } from '../lib/date';

const WEEKLY_GOAL = 5;

function minutes(seconds: number) {
  return Math.round(seconds / 60);
}

export function Home() {
  const { streak, sessions } = useSessions();
  const suggested = ROUTINES[0];
  const suggestedStyle = primaryGoalStyle(suggested.goal);

  const today = todayKey();
  const last7 = new Set<string>();
  for (let i = 0; i < 7; i++) last7.add(addDays(today, -i));
  const daysThisWeekCount = new Set(
    sessions.map((s) => dayKey(s.completedAt)).filter((d) => last7.has(d)),
  ).size;

  return (
    <div className="flex flex-col gap-5 pb-2">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {streak.current > 0 ? `${streak.current} day streak 🔥` : 'Let’s get moving today'}
          </p>
          <h1 className="text-2xl font-bold text-slate-900">Str3tch</h1>
        </div>
      </header>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center gap-5">
          <RingProgress
            progress={daysThisWeekCount / WEEKLY_GOAL}
            size={92}
            strokeWidth={9}
            color="#0ea5e9"
            trackColor="#e0f2fe"
          >
            <div className="text-center">
              <p className="text-xl font-bold text-slate-900">{daysThisWeekCount}</p>
              <p className="text-[10px] font-medium text-slate-400">/ {WEEKLY_GOAL} days</p>
            </div>
          </RingProgress>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">Weekly goal</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Stretch {WEEKLY_GOAL} days a week to build the habit.
            </p>
            <div className="mt-3 flex gap-4">
              <div>
                <p className="text-lg font-bold text-slate-900">{streak.longest}</p>
                <p className="text-[11px] text-slate-400">Best streak</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{streak.totalSessions}</p>
                <p className="text-[11px] text-slate-400">Total sessions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Link
        to={`/routine/${suggested.id}`}
        className={`block rounded-3xl bg-gradient-to-br p-5 text-white shadow-lg ${suggestedStyle.gradient}`}
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
          {suggestedStyle.icon} Quick start
        </p>
        <p className="mt-1 text-lg font-bold">{suggested.name}</p>
        <p className="mt-1 text-sm text-white/85">
          {minutes(routineDurationSeconds(suggested))} min · {suggested.description}
        </p>
      </Link>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">All routines</h2>
        {ROUTINES.map((routine) => {
          const style = primaryGoalStyle(routine.goal);
          return (
            <Link
              key={routine.id}
              to={`/routine/${routine.id}`}
              className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-transform active:scale-[0.98]"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xl ${style.gradient}`}
              >
                {style.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold text-slate-900">{routine.name}</p>
                  <span className="shrink-0 text-xs font-medium text-slate-400">
                    {minutes(routineDurationSeconds(routine))} min
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-500">{routine.description}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {routine.goal.map((g) => (
                    <span
                      key={g}
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${GOAL_STYLES[g].chip}`}
                    >
                      {GOAL_STYLES[g].label}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
