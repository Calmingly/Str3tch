import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  MdClose,
  MdCheckCircle,
  MdCelebration,
  MdSentimentVeryDissatisfied,
  MdSentimentDissatisfied,
  MdSentimentNeutral,
  MdSentimentSatisfied,
  MdSentimentVerySatisfied,
} from 'react-icons/md';
import { expandRoutine, routineDurationSeconds } from '../data/expand';
import { playChime, vibrate } from '../lib/sound';
import { useSessions } from '../hooks/useSessions';
import { useAllRoutines } from '../hooks/useAllRoutines';
import { primaryGoalStyle } from '../lib/theme';
import { RingProgress } from '../components/RingProgress';
import { StretchIllustration } from '../components/StretchIllustration';
import { AchievementToast } from '../components/AchievementToast';
import { useVoiceSettings, speak } from '../hooks/useVoiceSettings';
import { celebrateCompletion, celebrateAchievement } from '../lib/confetti';
import { ACHIEVEMENTS, unlockedAchievementIds } from '../data/achievements';
import type { Achievement } from '../data/achievements';
import type { FeelingRating, Routine } from '../types';

const TICK_MS = 100;

const FEELINGS: { value: FeelingRating['value']; label: string; Icon: typeof MdSentimentNeutral }[] = [
  { value: 1, label: 'Rough', Icon: MdSentimentVeryDissatisfied },
  { value: 2, label: 'Meh', Icon: MdSentimentDissatisfied },
  { value: 3, label: 'Okay', Icon: MdSentimentNeutral },
  { value: 4, label: 'Good', Icon: MdSentimentSatisfied },
  { value: 5, label: 'Great', Icon: MdSentimentVerySatisfied },
];

export function Player() {
  const { routineId } = useParams();
  const { getById } = useAllRoutines();
  const routine = getById(routineId ?? '');

  if (!routine) return <Navigate to="/" replace />;
  return <PlayerSession key={routine.id} routine={routine} />;
}

function PlayerSession({ routine }: { routine: Routine }) {
  const navigate = useNavigate();
  const { sessions, addSession } = useSessions();
  const { customRoutines } = useAllRoutines();
  const { settings: voice } = useVoiceSettings();

  const steps = useMemo(() => expandRoutine(routine), [routine]);
  const totalSeconds = useMemo(() => routineDurationSeconds(routine), [routine]);
  const style = primaryGoalStyle(routine.goal);

  const [index, setIndex] = useState(0);
  const [msLeft, setMsLeft] = useState(steps[0].seconds * 1000);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const [feeling, setFeeling] = useState<FeelingRating['value'] | null>(null);
  const [saved, setSaved] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const startedAt = useRef(new Date().toISOString());
  const spokenIndex = useRef(-1);
  const spokenCountdown = useRef<number | null>(null);

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

  useEffect(() => {
    if (!voice.enabled || paused || done) return;
    if (spokenIndex.current !== index) {
      spokenIndex.current = index;
      spokenCountdown.current = null;
      const label = current.side ? `${current.stretch.name}, ${current.side} side` : current.stretch.name;
      speak(label);
    }
  }, [index, current, voice.enabled, paused, done]);

  useEffect(() => {
    if (!voice.enabled || paused || done) return;
    const secondsLeft = Math.ceil(msLeft / 1000);
    if (secondsLeft <= 3 && secondsLeft >= 1 && spokenCountdown.current !== secondsLeft) {
      spokenCountdown.current = secondsLeft;
      speak(String(secondsLeft));
    }
  }, [msLeft, voice.enabled, paused, done]);

  const goToStep = (nextIndex: number) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, nextIndex));
    setIndex(clamped);
    setMsLeft(steps[clamped].seconds * 1000);
  };

  useEffect(() => {
    if (done) celebrateCompletion();
  }, [done]);

  const handleFinish = () => {
    const beforeUnlocked = unlockedAchievementIds({
      sessions,
      customRoutineCount: customRoutines.length,
    });
    const newRecord = {
      routineId: routine.id,
      routineName: routine.name,
      completedAt: new Date().toISOString(),
      durationSeconds: Math.round((Date.now() - new Date(startedAt.current).getTime()) / 1000),
      feeling,
    };
    addSession(newRecord);
    const afterUnlocked = unlockedAchievementIds({
      sessions: [{ ...newRecord, id: 'pending' }, ...sessions],
      customRoutineCount: customRoutines.length,
    });
    const unlocked = ACHIEVEMENTS.filter(
      (a) => afterUnlocked.has(a.id) && !beforeUnlocked.has(a.id),
    );
    if (unlocked.length > 0) {
      setNewlyUnlocked(unlocked);
      celebrateAchievement();
    }
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-3xl text-white ${style.gradient}`}
        >
          <MdCheckCircle />
        </div>
        <h1 className="text-xl font-bold">Nice work</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Logged in your progress.</p>

        {newlyUnlocked.length > 0 && (
          <div className="flex w-full flex-col gap-2">
            {newlyUnlocked.map((a) => (
              <AchievementToast key={a.id} achievement={a} />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate('/progress')}
          className={`mt-2 w-full rounded-2xl bg-gradient-to-br py-3 font-bold text-white shadow-lg ${style.gradient}`}
        >
          View progress
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full rounded-2xl bg-white py-3 font-semibold text-slate-600 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800"
        >
          Back to routines
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-5 bg-slate-50 px-6 text-center text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <MdCelebration className="text-4xl" style={{ color: 'var(--accent)' }} />
        <h1 className="text-xl font-bold">Routine complete</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">How did that feel?</p>
        <div className="flex gap-2">
          {FEELINGS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFeeling(f.value)}
              className={`flex flex-col items-center gap-1 rounded-2xl px-2.5 py-2 text-xs font-medium transition-colors ${
                feeling === f.value
                  ? `bg-gradient-to-br text-white ${style.gradient}`
                  : 'bg-white text-slate-500 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800'
              }`}
            >
              <f.Icon className="text-xl" />
              {f.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleFinish}
          className={`mt-2 w-full rounded-2xl bg-gradient-to-br py-3 font-bold text-white shadow-lg ${style.gradient}`}
        >
          Save & finish
        </button>
      </div>
    );
  }

  const elapsedInRoutine =
    steps.slice(0, index).reduce((sum, s) => sum + s.seconds, 0) + (current.seconds - msLeft / 1000);
  const overallProgress = elapsedInRoutine / totalSeconds;
  const stepProgress = 1 - msLeft / (current.seconds * 1000);
  const secondsLeftDisplay = Math.ceil(msLeft / 1000);

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-slate-50 px-6 pb-8 pt-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <Link
          to={`/routine/${routine.id}`}
          className="flex items-center gap-1 text-sm font-medium text-slate-400"
        >
          <MdClose /> Exit
        </Link>
        <span className="text-xs font-medium text-slate-400">
          {index + 1} / {steps.length}
        </span>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full bg-gradient-to-r transition-all duration-150 ${style.gradient}`}
          style={{ width: `${overallProgress * 100}%` }}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <StretchIllustration stretchId={current.stretch.id} size={160} rounded="lg" />

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            {current.side ? `${current.side} side` : current.stretch.area.join(' · ')}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
            {current.stretch.name}
          </h1>
        </div>

        <RingProgress
          progress={stepProgress}
          size={168}
          strokeWidth={9}
          color={style.ring}
          trackColor="#e2e8f0"
        >
          <span className="text-4xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
            {secondsLeftDisplay}
          </span>
        </RingProgress>

        <ul className="max-w-xs space-y-1 text-sm text-slate-500 dark:text-slate-400">
          {current.stretch.instructions.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        <p className="text-xs text-slate-400">{current.stretch.cue}</p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goToStep(index - 1)}
          disabled={index === 0}
          className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-500 shadow-sm ring-1 ring-slate-100 disabled:opacity-30 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className={`rounded-full bg-gradient-to-br px-8 py-3 text-sm font-bold text-white shadow-lg ${style.gradient}`}
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
          className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-500 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
