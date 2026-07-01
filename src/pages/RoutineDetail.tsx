import { Link, Navigate, useParams } from 'react-router-dom';
import { getRoutine } from '../data/routines';
import { expandRoutine, routineDurationSeconds } from '../data/expand';
import { primaryGoalStyle } from '../lib/theme';

export function RoutineDetail() {
  const { routineId } = useParams();
  let routine;
  try {
    routine = getRoutine(routineId ?? '');
  } catch {
    return <Navigate to="/" replace />;
  }

  const steps = expandRoutine(routine);
  const totalMinutes = Math.round(routineDurationSeconds(routine) / 60);
  const style = primaryGoalStyle(routine.goal);

  return (
    <div className="flex flex-col gap-5 pb-2">
      <div className={`-mx-4 -mt-6 rounded-b-3xl bg-gradient-to-br px-4 pb-6 pt-6 text-white ${style.gradient}`}>
        <Link to="/" className="text-sm text-white/80">
          ← Back
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">
            {style.icon}
          </div>
          <div>
            <h1 className="text-xl font-bold">{routine.name}</h1>
            <p className="text-sm text-white/85">
              {steps.length} stretches · about {totalMinutes} min
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-white/90">{routine.description}</p>
      </div>

      <ol className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <li
            key={`${step.stretch.id}-${step.side}-${i}`}
            className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                {i + 1}
              </span>
              <p className="text-sm font-medium text-slate-900">
                {step.stretch.name}
                {step.side && (
                  <span className="ml-1.5 text-xs font-normal text-slate-400">
                    ({step.side})
                  </span>
                )}
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400">{step.seconds}s</span>
          </li>
        ))}
      </ol>

      <Link
        to={`/session/${routine.id}`}
        className={`rounded-2xl bg-gradient-to-br py-3.5 text-center font-bold text-white shadow-lg ${style.gradient}`}
      >
        Start routine
      </Link>
    </div>
  );
}
