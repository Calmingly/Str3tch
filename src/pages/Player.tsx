import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { ROUTINES } from '../data/routines';
import { expandRoutine, routineDurationSeconds } from '../data/expand';
import { playChime, vibrate } from '../lib/sound';
import { useWakeLock } from '../hooks/useWakeLock';
import { RingProgress } from '../components/RingProgress';
import { StretchIllustration } from '../components/StretchIllustration';
import { BreathingPacer } from '../components/BreathingPacer';
import { ArrowLeftIcon, CloseIcon, PauseIcon, PlayIcon, SkipBackIcon, SkipForwardIcon } from '../components/icons';
import type { Routine } from '../types';

const TICK_MS = 100;

export function Player() {
  const { routineId } = useParams();
  const routine = ROUTINES.find((r) => r.id === routineId);

  if (!routine) return <Navigate to="/" replace />;
  return <PlayerSession key={routine.id} routine={routine} />;
}

function PlayerSession({ routine }: { routine: Routine }) {
  const steps = useMemo(() => expandRoutine(routine), [routine]);
  const totalSeconds = useMemo(() => routineDurationSeconds(routine), [routine]);

  useWakeLock(true);

  const [index, setIndex] = useState(0);
  const [msLeft, setMsLeft] = useState(steps[0].seconds * 1000);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);

  const current = steps[index];
  const isLast = index === steps.length - 1;

  useEffect(() => {
    if (paused || done) return;
    const interval = window.setInterval(() => {
      setMsLeft((prev) => {
        if (prev > TICK_MS) return prev - TICK_MS;
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

  const handleSwipe = (_: unknown, info: PanInfo) => {
    const SWIPE_THRESHOLD = 60;
    if (info.offset.x <= -SWIPE_THRESHOLD) {
      if (isLast) setDone(true);
      else goToStep(index + 1);
    } else if (info.offset.x >= SWIPE_THRESHOLD) {
      goToStep(index - 1);
    }
  };

  if (done) {
    return (
      <div
        className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-5 px-6 text-center"
        style={{ background: 'var(--paper)', color: 'var(--ink)' }}
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
        >
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
            <circle cx="28" cy="28" r="27" stroke="var(--accent)" strokeWidth="1.4" />
            <path
              d="M17 29l7 7 15-16"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <p className="font-serif text-3xl font-medium">Nice work.</p>
          <p className="mt-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
            {routine.name} · {Math.round(totalSeconds / 60)} min
          </p>
        </motion.div>
        <Link
          to="/"
          className="mt-2 flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--paper)]"
          style={{ backgroundColor: 'var(--ink)' }}
        >
          <ArrowLeftIcon size={16} /> Back to routines
        </Link>
      </div>
    );
  }

  const elapsedInRoutine =
    steps.slice(0, index).reduce((sum, s) => sum + s.seconds, 0) + (current.seconds - msLeft / 1000);
  const overallProgress = elapsedInRoutine / totalSeconds;
  const stepProgress = 1 - msLeft / (current.seconds * 1000);
  const secondsLeftDisplay = Math.ceil(msLeft / 1000);

  return (
    <div
      className="relative mx-auto flex min-h-full max-w-md flex-col overflow-hidden px-6 pb-8 pt-6"
      style={{ background: 'var(--paper)', color: 'var(--ink)' }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <AnimatePresence>
          <motion.img
            key={current.stretch.id}
            src={`${import.meta.env.BASE_URL}stretches/${current.stretch.id}.webp`}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.16 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: 'grayscale(1) blur(30px) saturate(0)' }}
          />
        </AnimatePresence>
        <div className="duotone-overlay absolute inset-0" style={{ opacity: 0.5 }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, var(--paper) 0%, transparent 18%, transparent 78%, var(--paper) 100%)',
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <Link to={`/routine/${routine.id}`} className="flex items-center gap-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
          <CloseIcon size={16} /> Exit
        </Link>
        <span className="text-xs tabular-nums" style={{ color: 'var(--ink-soft)' }}>
          {index + 1} / {steps.length}
        </span>
      </div>

      <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full" style={{ backgroundColor: 'var(--rule)' }}>
        <div
          className="h-full transition-all duration-150"
          style={{ width: `${overallProgress * 100}%`, backgroundColor: 'var(--accent)' }}
        />
      </div>

      <motion.div
        key={index}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleSwipe}
        className="flex flex-1 touch-pan-y flex-col items-center justify-center gap-4 text-center"
      >
        {current.stretch.breathingPace ? (
          <BreathingPacer
            key={current.stretch.id}
            inhaleSeconds={current.stretch.breathingPace.inhaleSeconds}
            exhaleSeconds={current.stretch.breathingPace.exhaleSeconds}
            size={160}
          />
        ) : (
          <StretchIllustration
            stretchId={current.stretch.id}
            name={current.stretch.name}
            size={160}
            rounded="lg"
            tone="duotone"
            className="shadow-[0_8px_28px_-12px_rgba(31,42,36,0.35)]"
          />
        )}

        <div>
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
            {current.side ? `${current.side} side` : current.stretch.area.join(' · ')}
          </p>
          <h1 className="font-serif mt-1 text-2xl font-medium">{current.stretch.name}</h1>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <RingProgress
              progress={overallProgress}
              size={190}
              strokeWidth={2}
              color="var(--accent)"
              trackColor="var(--accent-soft)"
            />
          </div>
          <RingProgress progress={stepProgress} size={168} strokeWidth={5} color="var(--ink)" trackColor="var(--rule)">
            <span className="font-serif text-4xl font-medium tabular-nums">{secondsLeftDisplay}</span>
          </RingProgress>
        </div>

        <ul className="max-w-xs space-y-1 text-sm" style={{ color: 'var(--ink-soft)' }}>
          {current.stretch.instructions.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        <p className="text-xs" style={{ color: 'var(--ink-soft)' }}>
          {current.stretch.cue}
        </p>
      </motion.div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goToStep(index - 1)}
          disabled={index === 0}
          className="flex h-11 w-11 items-center justify-center rounded-full transition-transform active:scale-90 disabled:opacity-30"
          style={{ color: 'var(--ink-soft)' }}
          aria-label="Previous stretch"
        >
          <SkipBackIcon size={20} />
        </button>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="flex h-14 w-14 items-center justify-center rounded-full text-[var(--paper)] transition-transform active:scale-90"
          style={{ backgroundColor: 'var(--ink)' }}
          aria-label={paused ? 'Resume' : 'Pause'}
        >
          {paused ? <PlayIcon size={20} /> : <PauseIcon size={20} />}
        </button>
        <button
          type="button"
          onClick={() => (isLast ? setDone(true) : goToStep(index + 1))}
          className="flex h-11 w-11 items-center justify-center rounded-full transition-transform active:scale-90"
          style={{ color: 'var(--ink-soft)' }}
          aria-label="Next stretch"
        >
          <SkipForwardIcon size={20} />
        </button>
      </div>
    </div>
  );
}
