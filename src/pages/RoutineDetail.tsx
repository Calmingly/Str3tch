import { Link, Navigate, useParams } from 'react-router-dom';
import { getRoutine } from '../data/routines';
import { expandRoutine, routineDurationSeconds } from '../data/expand';

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/" className="text-sm text-slate-400">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">{routine.name}</h1>
        <p className="mt-1 text-sm text-slate-400">{routine.description}</p>
        <p className="mt-2 text-sm text-slate-500">
          {steps.length} stretches · about {totalMinutes} min
        </p>
      </div>

      <ol className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <li
            key={`${step.stretch.id}-${step.side}-${i}`}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-white">
                {step.stretch.name}
                {step.side && (
                  <span className="ml-1.5 text-xs font-normal text-slate-400">
                    ({step.side})
                  </span>
                )}
              </p>
            </div>
            <span className="text-xs text-slate-400">{step.seconds}s</span>
          </li>
        ))}
      </ol>

      <Link
        to={`/session/${routine.id}`}
        className="rounded-xl bg-sky-500 py-3.5 text-center font-semibold text-slate-950"
      >
        Start routine
      </Link>
    </div>
  );
}
