import { Link, Navigate, useParams } from 'react-router-dom';
import { ROUTINES } from '../data/routines';
import { expandRoutine, routineDurationSeconds } from '../data/expand';
import { ArrowLeftIcon } from '../components/icons';
import { StretchIllustration } from '../components/StretchIllustration';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function RoutineDetail() {
  const { routineId } = useParams();
  const routine = ROUTINES.find((r) => r.id === routineId);

  if (!routine) return <Navigate to="/" replace />;

  const steps = expandRoutine(routine);
  const totalMinutes = Math.round(routineDurationSeconds(routine) / 60);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm"
          style={{ color: 'var(--ink-soft)' }}
        >
          <ArrowLeftIcon size={16} /> Routines
        </Link>
        <h1 className="font-serif mt-4 text-3xl font-medium leading-tight">{routine.name}</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
          {routine.description}
        </p>
        <p className="mt-2 text-xs uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
          {steps.length} stretches · about {totalMinutes} min
        </p>
      </div>

      <ol className="flex flex-col">
        {steps.map((step, i) => (
          <li
            key={`${step.stretch.id}-${step.side}-${i}`}
            className="flex items-center gap-4 py-3"
            style={{ borderTop: '1px solid var(--rule)' }}
          >
            <span
              className="font-serif w-6 shrink-0 text-sm tabular-nums"
              style={{ color: 'var(--ink-soft)' }}
            >
              {pad(i + 1)}
            </span>
            <StretchIllustration stretchId={step.stretch.id} name={step.stretch.name} size={40} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {step.stretch.name}
                {step.side && (
                  <span className="ml-1.5 text-xs font-normal" style={{ color: 'var(--ink-soft)' }}>
                    ({step.side})
                  </span>
                )}
              </p>
            </div>
            <span className="text-xs tabular-nums" style={{ color: 'var(--ink-soft)' }}>
              {step.seconds}s
            </span>
          </li>
        ))}
      </ol>

      <Link
        to={`/session/${routine.id}`}
        className="rounded-full py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-[var(--paper)]"
        style={{ backgroundColor: 'var(--ink)' }}
      >
        Begin
      </Link>
    </div>
  );
}
