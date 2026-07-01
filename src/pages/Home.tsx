import { Link } from 'react-router-dom';
import { ROUTINES } from '../data/routines';
import { routineDurationSeconds } from '../data/expand';
import { useSessions } from '../hooks/useSessions';

const GOAL_LABELS: Record<string, string> = {
  'general-mobility': 'General mobility',
  'targeted-relief': 'Targeted relief',
  'activity-recovery': 'Activity recovery',
  'habit-building': 'Daily habit',
};

function minutes(seconds: number) {
  return Math.round(seconds / 60);
}

export function Home() {
  const { streak } = useSessions();
  const suggested = ROUTINES[0];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-sm text-slate-400">
          {streak.current > 0
            ? `${streak.current} day streak — keep it going`
            : 'Let’s get moving today'}
        </p>
        <h1 className="text-2xl font-semibold text-white">Str3tch</h1>
      </header>

      <Link
        to={`/routine/${suggested.id}`}
        className="block rounded-2xl bg-sky-500 p-5 text-slate-950 shadow-lg shadow-sky-500/20"
      >
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
          Quick start
        </p>
        <p className="mt-1 text-lg font-semibold">{suggested.name}</p>
        <p className="mt-1 text-sm opacity-80">
          {minutes(routineDurationSeconds(suggested))} min · {suggested.description}
        </p>
      </Link>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          All routines
        </h2>
        {ROUTINES.map((routine) => (
          <Link
            key={routine.id}
            to={`/routine/${routine.id}`}
            className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-white">{routine.name}</p>
              <span className="text-xs text-slate-400">
                {minutes(routineDurationSeconds(routine))} min
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">{routine.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {routine.goal.map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300"
                >
                  {GOAL_LABELS[g]}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
