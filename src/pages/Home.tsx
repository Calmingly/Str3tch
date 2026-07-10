import { useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiToolsFill,
  RiCloseLine,
  RiHeartLine,
  RiFireFill,
  RiMapPinFill,
  RiPlayFill,
  RiHeartFill,
  RiInboxLine,
} from '@remixicon/react';
import { routineDurationSeconds } from '../data/expand';
import { useSessions } from '../hooks/useSessions';
import { useAllRoutines } from '../hooks/useAllRoutines';
import { useFavorites } from '../hooks/useFavorites';
import { useCountUp } from '../hooks/useCountUp';
import { GOAL_STYLES, primaryGoalStyle, routineIcon } from '../lib/theme';
import { Logo } from '../components/Logo';
import { WeekBarChart } from '../components/WeekBarChart';
import { EmptyState } from '../components/EmptyState';
import { addDays, dayKey, todayKey } from '../lib/date';
import { computeMomentum, type MomentumResult } from '../lib/momentum';
import { pickSuggestedRoutine } from '../lib/suggest';
import type { Goal } from '../types';

const WEEKLY_MINUTES_GOAL = 60;
const PILLAR_GOALS = Object.keys(GOAL_STYLES) as Goal[];

const MOMENTUM_TIER_STYLES: Record<MomentumResult['tier'], { badge: string }> = {
  high: { badge: 'bg-[#34C759] text-white' },
  mid: { badge: 'bg-[#FF9500] text-white' },
  low: { badge: 'bg-[var(--surface-2)] text-slate-600 dark:text-slate-300' },
};

function minutes(seconds: number) {
  return Math.round(seconds / 60);
}

export function Home() {
  const { streak, sessions } = useSessions();
  const { all: routines } = useAllRoutines();
  const { isFavorite, toggleFavorite } = useFavorites();
  const suggested = useMemo(() => pickSuggestedRoutine(routines, sessions), [routines, sessions]);
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

  const visibleRoutines = useMemo(() => {
    const filtered = activeGoal ? routines.filter((r) => r.goal.includes(activeGoal)) : routines;
    return [...filtered].sort((a, b) => Number(isFavorite(b.id)) - Number(isFavorite(a.id)));
  }, [routines, activeGoal, isFavorite]);

  const weeklyProgress = Math.min(1, weeklyMinutes / WEEKLY_MINUTES_GOAL);

  return (
    <div className="flex flex-col gap-4 pb-2">
      <header className="mb-1 flex flex-col gap-1">
        <Logo />
        {streak.current > 0 && (
          <p className="flex items-center gap-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            <RiFireFill size="1em" style={{ color: 'var(--accent)' }} />
            {streak.current} day streak
          </p>
        )}
      </header>

      <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Momentum
            </p>
            <p className="mt-2 text-5xl font-bold tabular-nums text-black dark:text-white">
              {animatedScore}
            </p>
            <span
              className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-bold ${MOMENTUM_TIER_STYLES[momentum.tier].badge}`}
            >
              {momentum.tier === 'high' ? 'Excellent' : momentum.tier === 'mid' ? 'Good' : momentum.message}
            </span>
          </div>
          <div className="w-[46%] shrink-0">
            <WeekBarChart days={chartDays} height={92} />
          </div>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4 dark:border-white/10">
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold tabular-nums text-black dark:text-white">
              {animatedWeeklyMinutes}
              <span className="ml-1 text-sm font-semibold text-slate-400">min this week</span>
            </p>
            <span className="text-xs text-slate-400">Goal {WEEKLY_MINUTES_GOAL} min</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {streak.longest} day best streak
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${weeklyProgress * 100}%`, backgroundColor: 'var(--accent)' }}
            />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br text-lg text-white ${suggestedStyle.gradient}`}
        >
          <suggestedStyle.icon size="1em" />
        </div>
        <Link to={`/routine/${suggested.id}`} className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Quick start</p>
          <p className="truncate text-[15px] font-semibold text-black dark:text-white">{suggested.name}</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {minutes(routineDurationSeconds(suggested))} min · {suggested.description}
          </p>
        </Link>
        <Link
          to={`/session/${suggested.id}`}
          aria-label={`Start ${suggested.name} now`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg text-white transition-transform active:scale-90"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <RiPlayFill size="1em" />
        </Link>
      </div>

      <section className="rounded-2xl bg-white p-5 ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
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
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl text-white transition-transform ${style.gradient} ${
                    active ? 'scale-110 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[var(--surface)]' : ''
                  }`}
                  style={active ? ({ '--tw-ring-color': 'var(--accent)' } as CSSProperties) : undefined}
                >
                  <style.icon size="1em" />
                </span>
                <span className="text-center text-[11px] font-semibold leading-tight text-slate-600 dark:text-slate-300">
                  {style.label.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-400">{pillarCounts[g]}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
          <Link
            to="/body-map"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300"
          >
            <RiMapPinFill size="1.1em" style={{ color: 'var(--accent)' }} />
            Where's it tight?
          </Link>
          <Link
            to="/build"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-50 py-2.5 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300"
          >
            <RiToolsFill size="1.1em" style={{ color: 'var(--accent)' }} />
            Build a routine
          </Link>
        </div>
      </section>

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
                <RiCloseLine size="1em" /> Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        {visibleRoutines.length > 0 && (
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
            <AnimatePresence mode="popLayout">
              {visibleRoutines.map((routine, i) => {
                const style = primaryGoalStyle(routine.goal);
                const Icon = routineIcon(routine);
                return (
                  <motion.div
                    key={routine.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, delay: Math.min(i, 6) * 0.04 }}
                    className="relative border-b border-slate-100 last:border-0 dark:border-white/5"
                  >
                    <Link
                      to={`/routine/${routine.id}`}
                      className="flex items-center gap-3 py-3 pl-3 pr-11 transition-colors active:bg-slate-50 dark:active:bg-white/5"
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br text-lg text-white ${style.gradient}`}
                      >
                        <Icon size="1em" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-black dark:text-white">
                          {routine.name}
                          {routine.isCustom && (
                            <span className="ml-1.5 text-[10px] font-semibold text-slate-400">
                              CUSTOM
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                          {routine.description}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-slate-400">
                        {minutes(routineDurationSeconds(routine))} min
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(routine.id)}
                      aria-label={isFavorite(routine.id) ? 'Remove from favorites' : 'Add to favorites'}
                      aria-pressed={isFavorite(routine.id)}
                      className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-slate-300 transition-colors dark:text-slate-600"
                      style={isFavorite(routine.id) ? { color: 'var(--accent)' } : undefined}
                    >
                      {isFavorite(routine.id) ? (
                        <RiHeartFill size="1.05em" />
                      ) : (
                        <RiHeartLine size="1.05em" />
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
        {visibleRoutines.length === 0 && (
          <EmptyState
            icon={RiInboxLine}
            title="No routines in this category yet"
            description="Try a different focus, or build your own."
          />
        )}
      </section>
    </div>
  );
}
