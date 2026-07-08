import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { PiArrowLeftBold, PiPencilSimpleBold, PiTrashBold } from 'react-icons/pi';
import { expandRoutine, routineDurationSeconds } from '../data/expand';
import { primaryGoalStyle } from '../lib/theme';
import { useAllRoutines } from '../hooks/useAllRoutines';
import { StretchIllustration } from '../components/StretchIllustration';

export function RoutineDetail() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const { getById, removeCustom } = useAllRoutines();
  const routine = getById(routineId ?? '');

  if (!routine) return <Navigate to="/" replace />;

  const steps = expandRoutine(routine);
  const totalMinutes = Math.round(routineDurationSeconds(routine) / 60);
  const style = primaryGoalStyle(routine.goal);

  return (
    <div className="flex flex-col gap-5 pb-2">
      <div
        className={`-mx-4 -mt-6 rounded-b-3xl bg-gradient-to-br px-4 pb-6 pt-6 text-white ${style.gradient}`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 text-sm text-white/80">
            <PiArrowLeftBold /> Back
          </Link>
          {routine.isCustom && (
            <div className="flex gap-3 text-sm text-white/85">
              <Link to={`/build/${routine.id}`} className="flex items-center gap-1">
                <PiPencilSimpleBold /> Edit
              </Link>
              <button
                type="button"
                className="flex items-center gap-1"
                onClick={() => {
                  removeCustom(routine.id);
                  navigate('/');
                }}
              >
                <PiTrashBold /> Delete
              </button>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">
            <style.icon />
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
            className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]"
          >
            <StretchIllustration stretchId={step.stretch.id} size={44} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {step.stretch.name}
                {step.side && (
                  <span className="ml-1.5 text-xs font-normal text-slate-400 dark:text-slate-500">
                    ({step.side})
                  </span>
                )}
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
              {step.seconds}s
            </span>
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
