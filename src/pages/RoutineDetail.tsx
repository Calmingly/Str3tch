import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTINES } from '../data/routines';
import { expandRoutine, routineDurationSeconds } from '../data/expand';
import { GOAL_COLORS, GOAL_LABELS, primaryGoal } from '../lib/goals';
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
  const goal = primaryGoal(routine.goal);

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

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative mt-4"
        >
          <StretchIllustration
            stretchId={routine.steps[0].stretchId}
            tone="duotone"
            rounded="lg"
            width="100%"
            height={176}
            className="w-full"
          />
          <div
            className="absolute -bottom-4 -right-3 flex h-16 w-16 rotate-[-9deg] flex-col items-center justify-center rounded-full text-center shadow-[0_6px_16px_-6px_rgba(31,42,36,0.4)]"
            style={{ backgroundColor: 'var(--paper)', border: '1.4px solid var(--accent)' }}
          >
            <span className="font-serif text-lg font-medium leading-none" style={{ color: 'var(--accent)' }}>
              {totalMinutes}
            </span>
            <span
              className="mt-0.5 text-[8px] font-semibold uppercase tracking-wide"
              style={{ color: 'var(--accent)' }}
            >
              min
            </span>
          </div>
        </motion.div>

        <h1 className="font-serif mt-5 text-3xl font-medium leading-tight">{routine.name}</h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
          {routine.description}
        </p>
        <p
          className="mt-3 flex items-center gap-1.5 text-xs uppercase tracking-wide"
          style={{ color: 'var(--ink-soft)' }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: GOAL_COLORS[goal] }}
          />
          {GOAL_LABELS[goal]} · {steps.length} stretches · about {totalMinutes} min
        </p>
      </div>

      <ol className="flex flex-col">
        {steps.map((step, i) => (
          <li
            key={`${step.stretch.id}-${step.side}-${i}`}
            className="flex items-center gap-3 py-3"
            style={{ borderTop: '1px solid var(--rule)' }}
          >
            <span
              className="font-serif flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] tabular-nums"
              style={{ color: 'var(--ink-soft)', border: '1px solid var(--rule)' }}
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
            <span className="shrink-0 text-xs tabular-nums" style={{ color: 'var(--ink-soft)' }}>
              {step.seconds}s
            </span>
          </li>
        ))}
      </ol>

      <Link
        to={`/session/${routine.id}`}
        className="rounded-full py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-[var(--paper)] transition-transform active:scale-[0.98]"
        style={{ backgroundColor: 'var(--ink)' }}
      >
        Begin
      </Link>
    </div>
  );
}
