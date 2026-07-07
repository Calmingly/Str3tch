import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdLocalFireDepartment, MdAccessibilityNew, MdBuild, MdClose } from 'react-icons/md';
import { routineDurationSeconds } from '../data/expand';
import { useSessions } from '../hooks/useSessions';
import { useAllRoutines } from '../hooks/useAllRoutines';
import { useCountUp } from '../hooks/useCountUp';
import { GOAL_STYLES, primaryGoalStyle } from '../lib/theme';
import { RingProgress } from '../components/RingProgress';
import { Logo } from '../components/Logo';
import { addDays, dayKey, todayKey } from '../lib/date';
import { computeMomentum } from '../lib/momentum';
import type { Goal } from '../types';

const WEEKLY_GOAL = 5;
const PILLAR_GOALS = Object.keys(GOAL_STYLES) as Goal[];

function minutes(seconds: number) {
  return Math.round(seconds / 60);
}

export function Home() {
  const { streak, sessions } = useSessions();
  const { all: routines } = useAllRoutines();
  const suggested = routines[0];
  const suggestedStyle = primaryGoalStyle(suggested.goal);
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);

  const today = todayKey();
  const last7 = new Set<string>();
  for (let i = 0; i < 7; i++) last7.add(addDays(today, -i));
  const daysThisWeekCount = new Set(
    sessions.map((s) => dayKey(s.completedAt)).filter((d) => last7.has(d)),
  ).size;

  const momentum = useMemo(
    () => computeMomentum(streak, daysThisWeekCount, sessions),
    [streak, daysThisWeekCount, sessions],
  );
  const animatedScore = useCountUp(momentum.score);

  const pillarCounts = useMemo(() => {
    const counts: Record<Goal, number> = {
      'general-mobility': 0,
      'targeted-relief': 0,
      'activity-recovery': 0,
      'habit-building': 0,
    };
    for (const routine of routines) {
      for (const g of routine.goal) counts[g] += 1;
    }
    return counts;
  }, [routines]);

  const visibleRoutines = activeGoal
    ? routines.filter((r) => r.goal.includes(activeGoal))
    : routines;

  return (
    <div className="flex flex-col gap-5 pb-2">
      <header className="flex flex-col gap-1">
        <Logo />
        {streak.current > 0 && (
          <p className="flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            <MdLocalFireDepartment style={{ color: 'var(--accent)' }} />
            {streak.current} day streak
          </p>
        )}
      </header>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
        <div className="flex items-center gap-5">
          <RingProgress
            progress={momentum.score / 100}
            size={92}
            strokeWidth={9}
            color="var(--accent)"
            trackColor="var(--accent-soft)"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {animatedScore}
              </p>
              <p className="text-[10px] font-medium text-slate-400">MOMENTUM</p>
            </div>
          </RingProgress>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {momentum.message}
            </p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Based on your streak, this week's sessions, and how they've felt.
            </p>
            <div className="mt-3 flex gap-4">
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {daysThisWeekCount}/{WEEKLY_GOAL}
                </p>
                <p className="text-[11px] text-slate-400">Days this week</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {streak.longest}
                </p>
                <p className="text-[11px] text-slate-400">Best streak</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Link
        to={`/routine/${suggested.id}`}
        className={`block rounded-3xl bg-gradient-to-br p-5 text-white shadow-lg ${suggestedStyle.gradient}`}
      >
        <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-white/80">
          <suggestedStyle.icon /> Quick start
        </p>
        <p className="mt-1 text-lg font-bold">{suggested.name}</p>
        <p className="mt-1 text-sm text-white/85">
          {minutes(routineDurationSeconds(suggested))} min · {suggested.description}
        </p>
      </Link>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-400">
          Browse by focus
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {PILLAR_GOALS.map((g) => {
            const style = GOAL_STYLES[g];
            const active = activeGoal === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setActiveGoal(active ? null : g)}
                className={`flex flex-col items-start gap-2 rounded-2xl p-4 text-left shadow-sm ring-2 transition-all ${
                  active
                    ? `bg-gradient-to-br text-white ${style.gradient} ring-transparent`
                    : 'bg-white text-slate-900 ring-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-800'
                }`}
              >
                <style.icon
                  className="text-2xl"
                  style={active ? undefined : { color: 'var(--accent)' }}
                />
                <div>
                  <p className="text-sm font-semibold">{style.label}</p>
                  <p className={`text-xs ${active ? 'text-white/80' : 'text-slate-400'}`}>
                    {pillarCounts[g]} routine{pillarCounts[g] === 1 ? '' : 's'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/body-map"
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800"
        >
          <MdAccessibilityNew className="text-2xl" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Where's it tight?
          </span>
        </Link>
        <Link
          to="/build"
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800"
        >
          <MdBuild className="text-2xl" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Build a routine
          </span>
        </Link>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
            {activeGoal ? GOAL_STYLES[activeGoal].label : 'All routines'}
          </h2>
          <AnimatePresence>
            {activeGoal && (
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveGoal(null)}
                className="flex items-center gap-0.5 text-xs font-semibold text-slate-400"
              >
                <MdClose /> Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence mode="popLayout">
          {visibleRoutines.map((routine, i) => {
            const style = primaryGoalStyle(routine.goal);
            return (
              <motion.div
                key={routine.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, delay: Math.min(i, 6) * 0.04 }}
              >
                <Link
                  to={`/routine/${routine.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-transform active:scale-[0.98] dark:bg-slate-900 dark:ring-slate-800"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xl ${style.gradient}`}
                  >
                    <style.icon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                        {routine.name}
                        {routine.isCustom && (
                          <span className="ml-1.5 text-[10px] font-semibold text-violet-500">
                            CUSTOM
                          </span>
                        )}
                      </p>
                      <span className="shrink-0 text-xs font-medium text-slate-400">
                        {minutes(routineDurationSeconds(routine))} min
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                      {routine.description}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {routine.goal.map((g) => (
                        <span
                          key={g}
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${GOAL_STYLES[g].chip}`}
                        >
                          {GOAL_STYLES[g].label}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {visibleRoutines.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No routines in this category yet.
          </p>
        )}
      </section>
    </div>
  );
}
