import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { getRoutine } from '../data/routines';
import { expandRoutine, routineDurationSeconds } from '../data/expand';
import { playChime, vibrate } from '../lib/sound';
import { useSessions } from '../hooks/useSessions';
import type { FeelingRating } from '../types';

const TICK_MS = 100;

const FEELINGS: { value: FeelingRating['value']; label: string; emoji: string }[] = [
  { value: 1, label: 'Rough', emoji: '😣' },
  { value: 2, label: 'Meh', emoji: '😕' },
  { value: 3, label: 'Okay', emoji: '🙂' },
  { value: 4, label: 'Good', emoji: '😌' },
  { value: 5, label: 'Great', emoji: '🤩' },
];

export function Player() {
  const { routineId } = useParams();
  let routine;
  try {
    routine = getRoutine(routineId ?? '');
  } catch {
    return <Navigate to="/" replace />;
  }
  return <PlayerSession key={routine.id} routine={routine} />;
}

function PlayerSession({ routine }: { routine: ReturnType<typeof getRoutine> }) {
  const navigate = useNavigate();
  const { addSession } = useSessions();

  const steps = useMemo(() => expandRoutine(routine), [routine]);
  const totalSeconds = useMemo(() => routineDurationSeconds(routine), [routine]);

  const [index, setIndex] = useState(0);
  const [msLeft, setMsLeft] = useState(steps[0].seconds * 1000);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const [feeling, setFeeling] = useState<FeelingRating['value'] | null>(null);
  const [saved, setSaved] = useState(false);
  const startedAt = useRef(new Date().toISOString());

  const current = steps[index];
  const isLast = index === steps.length - 1;

  useEffect(() => {
    if (paused || done) return;
    const interval = window.setInterval(() => {
      setMsLeft((prev) => {
        if (prev > TICK_MS) return prev - TICK_MS;
        // step finished
        playChime();
        vibrate(120);
        if (isLast) {
          setDone(true);
          return 0;
        }
        setIndex((i) => i + 1);
        return steps[index + 1].seconds * 1000;
      });
    }, TICK_MS);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, done, index, isLast]);

  const goToStep = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, nextIndex));
    setIndex(clamped);
    setMsLeft(steps[clamped].seconds * 1000);
  };

  const handleFinish = () => {
    addSession({
      routineId: routine.id,
      routineName: routine.name,
      completedAt: new Date().toISOString(),
      durationSeconds: Math.round(
        (Date.now() - new Date(startedAt.current).getTime()) / 1000,
      ),
      feeling,
    });
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center text-slate-100">
        <p className="text-4xl">✅</p>
        <h1 className="text-xl font-semibold">Nice work</h1>
        <p className="text-sm text-slate-400">Logged in your progress.</p>
        <button
          type="button"
          onClick={() => navigate('/progress')}
          className="mt-2 w-full rounded-xl bg-sky-500 py-3 font-semibold text-slate-950"
        >
          View progress
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full rounded-xl border border-slate-800 py-3 font-semibold text-slate-300"
        >
          Back to routines
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-5 bg-slate-950 px-6 text-center text-slate-100">
        <p className="text-4xl">🎉</p>
        <h1 className="text-xl font-semibold">Routine complete</h1>
        <p className="text-sm text-slate-400">How did that feel?</p>
        <div className="flex gap-2">
          {FEELINGS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFeeling(f.value)}
              className={`flex flex-col items-center gap-1 rounded-lg px-2.5 py-2 text-xs ${
                feeling === f.value ? 'bg-sky-500 text-slate-950' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <span className="text-xl">{f.emoji}</span>
              {f.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleFinish}
          className="mt-2 w-full rounded-xl bg-sky-500 py-3 font-semibold text-slate-950"
        >
          Save & finish
        </button>
      </div>
    );
  }

  const elapsedInRoutine =
    steps.slice(0, index).reduce((sum, s) => sum + s.seconds, 0) +
    (current.seconds - msLeft / 1000);
  const overallProgress = elapsedInRoutine / totalSeconds;
  const stepProgress = 1 - msLeft / (current.seconds * 1000);
  const secondsLeftDisplay = Math.ceil(msLeft / 1000);

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-slate-950 px-6 pb-8 pt-6 text-slate-100">
      <div className="flex items-center justify-between">
        <Link to={`/routine/${routine.id}`} className="text-sm text-slate-400">
          ✕ Exit
        </Link>
        <span className="text-xs text-slate-500">
          {index + 1} / {steps.length}
        </span>
      </div>

      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-sky-500 transition-all duration-150"
          style={{ width: `${overallProgress * 100}%` }}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-400">
            {current.side ? `${current.side} side` : current.stretch.area.join(' · ')}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">{current.stretch.name}</h1>
        </div>

        <div className="relative flex h-48 w-48 items-center justify-center">
          <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#1e293b" strokeWidth="6" />
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 46}
              strokeDashoffset={2 * Math.PI * 46 * (1 - stepProgress)}
              className="transition-all duration-150"
            />
          </svg>
          <span className="text-5xl font-semibold tabular-nums">{secondsLeftDisplay}</span>
        </div>

        <ul className="max-w-xs space-y-1 text-sm text-slate-400">
          {current.stretch.instructions.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        <p className="text-xs text-slate-500">{current.stretch.cue}</p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goToStep(index - 1)}
          disabled={index === 0}
          className="rounded-full border border-slate-800 px-4 py-3 text-sm text-slate-300 disabled:opacity-30"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-slate-950"
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button
          type="button"
          onClick={() => {
            if (isLast) {
              setDone(true);
            } else {
              goToStep(index + 1);
            }
          }}
          className="rounded-full border border-slate-800 px-4 py-3 text-sm text-slate-300"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
