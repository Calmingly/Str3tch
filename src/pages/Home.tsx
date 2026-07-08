import { useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TbFlame, TbAccessible, TbTool, TbX } from 'react-icons/tb';
import { routineDurationSeconds } from '../data/expand';
import { useSessions } from '../hooks/useSessions';
import { useAllRoutines } from '../hooks/useAllRoutines';
import { useCountUp } from '../hooks/useCountUp';
import { GOAL_STYLES, primaryGoalStyle } from '../lib/theme';
import { Logo } from '../components/Logo';
import { WeekBarChart } from '../components/WeekBarChart';
import { addDays, dayKey, todayKey } from '../lib/date';
import { computeMomentum } from '../lib/momentum';
import type { Goal } from '../types';

const WEEKLY_MINUTES_GOAL = 60;
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
  const last7 = useMemo(() => {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) days.push(addDays(today, -i));
    return days;
  }, [today]);
  const last7Set = useMemo(() => new Set(last7), [last7]);

  const minutesByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) {
      const key = dayKey(s.completedAt);
      map.set(key, (map.get(key) ?? 0) + s.durationSeconds / 60);
    }
    return map;
  }, [sessions]);

  const daysThisWeekCount = useMemo(
    () => new Set(sessions.map((s) => dayKey(s.completedAt)).filter((d) => last7Set.has(d))).size,
    [sessions, last7Set],
  );

  const weeklyMinutes = useMemo(
    () => last7.reduce((sum, d) => sum + (minutesByDay.get(d) ?? 0), 0),
    [last7, minutesByDay],
  );

  const chartDays = useMemo(
    () =>
      last7.map((d) => ({
        label: String(Number(d.slice(-2))),
        value: minutesByDay.get(d) ?? 0,
        isToday: d === today,
      })),
    [last7, minutesByDay, today],
  );

  const momentum = useMemo(
    () => computeMomentum(streak, daysThisWeekCount, sessions),
    [streak, daysThisWeekCount, sessions],
  );
  const animatedScore = useCountUp(momentum.score);
  const animatedWeeklyMinutes = useCountUp(Math.round(weeklyMinutes));

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

  const weeklyProgress = Math.min(1, weeklyMinutes / WEEKLY_MINUTES_GOAL);

  return (
    <div className="flex flex-col gap-4 pb-2">
      <header className="mb-1 flex flex-col gap-1">
        <Logo />
        {streak.current > 0 && (
          <p className="flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            <TbFlame style={{ color: 'var(--accent)' }} />
            {streak.current} day streak
          </p>
        )}
      </header>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Momentum
            </p>
            <p className="mt-2 text-5xl font-bold tabular-nums text-slate-900 dark:text-[var(--text-hero)]">
              {animatedScore}
            </p>
            <p className="mt-1 text-sm font-bold" style={{ color: 'var(--accent)' }}>
              {momentum.tier === 'high' ? 'Excellent' : momentum.tier === 'mid' ? 'Good' : momentum.message}
            </p>
          </div>
          <div className="w-[46%] shrink-0">
            <WeekBarChart days={chartDays} height={92} />
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">This week</p>
        <p className="mt-2 text-4xl font-bold tabular-nums text-slate-900 dark:text-[var(--text-hero)]">
          {animatedWeeklyMinutes}
          <span className="ml-1 text-lg font-semibold text-slate-400">min</span>
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Goal: {WEEKLY_MINUTES_GOAL} min · {streak.longest} day best streak
        </p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${weeklyProgress * 100}%`, backgroundColor: 'var(--accent)' }}
          />
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

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Browse by focus
        </h2>
        <div className="flex justify-between gap-2">
          {PILLAR_GOALS.map((g) => {
            const style = GOAL_STYLES[g];
            const active = activeGoal === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setActiveGoal(active ? null : g)}
                className="flex flex-col items-center gap-1.5"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-2xl text-white transition-transform ${style.gradient} ${
                    active ? 'scale-110 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[var(--surface)]' : ''
                  }`}
                  style={active ? ({ '--tw-ring-color': 'var(--accent)' } as CSSProperties) : undefined}
                >
                  <style.icon />
                </span>
                <span className="text-center text-[11px] font-semibold leading-tight text-slate-600 dark:text-slate-300">
                  {style.label.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-400">{pillarCounts[g]}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/body-map"
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]"
        >
          <TbAccessible className="text-2xl" style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Where's it tight?
          </span>
        </Link>
        <Link
          to="/build"
          className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]"
        >
          <TbTool className="text-2xl" style={{ color: 'var(--accent)' }} />
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
                <TbX /> Clear
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
                  className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-transform active:scale-[0.98] dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]"
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
