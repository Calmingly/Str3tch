import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiArrowLeftLine,
  RiPencilLine,
  RiDeleteBinLine,
  RiFileCopyLine,
  RiHeartLine,
  RiHeartFill,
  RiVolumeUpLine,
  RiVolumeMuteLine,
  RiMore2Fill,
} from '@remixicon/react';
import { expandRoutine, routineDurationSeconds } from '../data/expand';
import { primaryGoalStyle, routineIcon } from '../lib/theme';
import { useAllRoutines } from '../hooks/useAllRoutines';
import { useFavorites } from '../hooks/useFavorites';
import { useVoiceSettings } from '../hooks/useVoiceSettings';
import {
  useRoutineVoiceOverrides,
  resolveVoiceEnabled,
  type VoiceOverride,
} from '../hooks/useRoutineVoiceOverrides';
import { StretchIllustration } from '../components/StretchIllustration';
import type { Routine } from '../types';

const UNDO_WINDOW_MS = 4000;

const VOICE_OVERRIDE_OPTIONS: { label: string; value: VoiceOverride }[] = [
  { label: 'Default', value: null },
  { label: 'On', value: 'on' },
  { label: 'Off', value: 'off' },
];

export function RoutineDetail() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const { getById, removeCustom, saveCustom } = useAllRoutines();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { settings: voice } = useVoiceSettings();
  const { getOverride, setOverride } = useRoutineVoiceOverrides();
  const [pendingDelete, setPendingDelete] = useState<Routine | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const deleteTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) window.clearTimeout(deleteTimerRef.current);
    };
  }, []);

  const routine = pendingDelete ?? getById(routineId ?? '');

  if (!routine) return <Navigate to="/" replace />;

  const handleDuplicate = () => {
    const copy: Routine = {
      ...routine,
      id: `custom-${crypto.randomUUID()}`,
      name: `${routine.name} (copy)`,
      isCustom: true,
    };
    saveCustom(copy);
    navigate(`/build/${copy.id}`);
  };

  const handleDelete = () => {
    removeCustom(routine.id);
    setPendingDelete(routine);
    deleteTimerRef.current = window.setTimeout(() => navigate('/'), UNDO_WINDOW_MS);
  };

  const handleUndo = () => {
    if (deleteTimerRef.current) window.clearTimeout(deleteTimerRef.current);
    saveCustom(routine);
    setPendingDelete(null);
  };

  if (pendingDelete) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          "{pendingDelete.name}" deleted.
        </p>
        <button
          type="button"
          onClick={handleUndo}
          className="rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-lg"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          Undo
        </button>
      </div>
    );
  }

  const steps = expandRoutine(routine);
  const totalMinutes = Math.round(routineDurationSeconds(routine) / 60);
  const style = primaryGoalStyle(routine.goal);
  const Icon = routineIcon(routine);
  const voiceOverride = getOverride(routine.id);

  return (
    <div className="flex flex-col gap-5 pb-2">
      <div
        className={`-mx-4 -mt-6 rounded-b-3xl bg-gradient-to-br px-4 pb-6 pt-6 text-white ${style.gradient}`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 text-sm text-white/80">
            <RiArrowLeftLine size="1em" /> Back
          </Link>
          <div className="flex items-center gap-3 text-sm text-white/85">
            <button
              type="button"
              onClick={() => toggleFavorite(routine.id)}
              aria-label={isFavorite(routine.id) ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorite(routine.id)}
              className="text-lg"
            >
              {isFavorite(routine.id) ? (
                <RiHeartFill size="1em" />
              ) : (
                <RiHeartLine size="1em" />
              )}
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="More actions"
                aria-expanded={menuOpen}
                className="text-lg"
              >
                <RiMore2Fill size="1em" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-xl bg-white py-1 text-left text-slate-700 shadow-lg ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:text-slate-200 dark:ring-[var(--surface-border)]"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          handleDuplicate();
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        <RiFileCopyLine size="1em" /> Duplicate
                      </button>
                      {routine.isCustom && (
                        <>
                          <Link
                            to={`/build/${routine.id}`}
                            onClick={() => setMenuOpen(false)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-white/5"
                          >
                            <RiPencilLine size="1em" /> Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpen(false);
                              handleDelete();
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                          >
                            <RiDeleteBinLine size="1em" /> Delete
                          </button>
                        </>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl">
            <Icon size="1em" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">{routine.name}</h1>
            <p className="text-sm text-white/85">
              {steps.length} stretches · about {totalMinutes} min
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-white/90">{routine.description}</p>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <div className="flex items-center gap-2">
          {resolveVoiceEnabled(voice.enabled, voiceOverride) ? (
            <RiVolumeUpLine size="1.1em" className="text-slate-400" />
          ) : (
            <RiVolumeMuteLine size="1.1em" className="text-slate-400" />
          )}
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Voice guidance
          </span>
        </div>
        <div className="flex gap-1 rounded-full bg-slate-100 p-1 dark:bg-slate-800">
          {VOICE_OVERRIDE_OPTIONS.map((opt) => {
            const active = voiceOverride === opt.value;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setOverride(routine.id, opt.value)}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                  active ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                }`}
                style={active ? { backgroundColor: 'var(--accent)' } : undefined}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <ol className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <li
            key={`${step.stretch.id}-${step.side}-${i}`}
            className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]"
          >
            <StretchIllustration stretchId={step.stretch.id} name={step.stretch.name} size={44} />
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
