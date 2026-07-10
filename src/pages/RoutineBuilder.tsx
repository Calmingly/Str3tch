import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  RiArrowUpSLine,
  RiArrowDownSLine,
  RiCloseLine,
  RiSearchLine,
  RiAddFill,
} from '@remixicon/react';
import { STRETCHES, getStretch } from '../data/stretches';
import { useAllRoutines } from '../hooks/useAllRoutines';
import { GOAL_STYLES } from '../lib/theme';
import type { BodyArea, Goal, Routine, RoutineStep } from '../types';

const ALL_GOALS = Object.keys(GOAL_STYLES) as Goal[];

const AREA_LABELS: Record<BodyArea, string> = {
  neck: 'Neck',
  shoulders: 'Shoulders',
  back: 'Back',
  hips: 'Hips',
  hamstrings: 'Hamstrings',
  quads: 'Quads',
  calves: 'Calves',
  wrists: 'Wrists',
  'full-body': 'Full body',
};

const ALL_AREAS = Array.from(new Set(STRETCHES.flatMap((s) => s.area))) as BodyArea[];

export function RoutineBuilder() {
  const { customRoutineId } = useParams();
  const navigate = useNavigate();
  const { getById, saveCustom } = useAllRoutines();
  const existing = customRoutineId ? getById(customRoutineId) : undefined;

  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [goals, setGoals] = useState<Goal[]>(existing?.goal ?? []);
  const [steps, setSteps] = useState<RoutineStep[]>(existing?.steps ?? []);
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState<BodyArea | null>(null);

  const toggleGoal = (g: Goal) => {
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const addStretch = (stretchId: string) => {
    setSteps((prev) => [...prev, { stretchId }]);
  };

  const removeStep = (index: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    setSteps((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const updateSeconds = (index: number, seconds: number) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, seconds } : s)));
  };

  const canSave = name.trim().length > 0 && goals.length > 0 && steps.length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const areaSet = new Set<BodyArea>();
    for (const step of steps) {
      for (const a of getStretch(step.stretchId).area) areaSet.add(a);
    }
    const routine: Routine = {
      id: existing?.id ?? `custom-${crypto.randomUUID()}`,
      name: name.trim(),
      description: description.trim(),
      goal: goals,
      area: Array.from(areaSet),
      steps,
      isCustom: true,
    };
    saveCustom(routine);
    navigate(`/routine/${routine.id}`);
  };

  const usedStretchIds = useMemo(() => new Set(steps.map((s) => s.stretchId)), [steps]);

  const filteredStretches = useMemo(() => {
    const q = search.trim().toLowerCase();
    return STRETCHES.filter((stretch) => {
      if (areaFilter && !stretch.area.includes(areaFilter)) return false;
      if (q && !stretch.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, areaFilter]);

  return (
    <div className="flex flex-col gap-5 pb-2">
      <header>
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-slate-900 dark:text-slate-100">
          {existing ? 'Edit routine' : 'Build a routine'}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Mix and match stretches into your own sequence.
        </p>
      </header>

      <section className="flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Routine name"
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <div className="flex flex-wrap gap-2">
          {ALL_GOALS.map((g) => {
            const style = GOAL_STYLES[g];
            const active = goals.includes(g);
            return (
              <button
                key={g}
                type="button"
                onClick={() => toggleGoal(g)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active ? `bg-gradient-to-br text-white ${style.gradient}` : style.chip
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  <style.icon size="1em" /> {style.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
          Your sequence ({steps.length})
        </h2>
        {steps.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Add stretches from the library below.
          </p>
        )}
        {steps.map((step, i) => {
          const stretch = getStretch(step.stretchId);
          return (
            <div
              key={`${step.stretchId}-${i}`}
              className="flex items-center gap-2 rounded-2xl bg-white p-3 ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]"
            >
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => moveStep(i, -1)}
                  disabled={i === 0}
                  className="text-slate-400 disabled:opacity-20"
                  aria-label="Move up"
                >
                  <RiArrowUpSLine size="1em" />
                </button>
                <button
                  type="button"
                  onClick={() => moveStep(i, 1)}
                  disabled={i === steps.length - 1}
                  className="text-slate-400 disabled:opacity-20"
                  aria-label="Move down"
                >
                  <RiArrowDownSLine size="1em" />
                </button>
              </div>
              <p className="flex-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                {stretch.name}
              </p>
              <input
                type="number"
                min={5}
                max={180}
                value={step.seconds ?? stretch.defaultSeconds}
                onChange={(e) => updateSeconds(i, Number(e.target.value))}
                className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-center text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => removeStep(i)}
                className="text-lg text-slate-400 hover:text-red-500"
                aria-label="Remove"
              >
                <RiCloseLine size="1em" />
              </button>
            </div>
          );
        })}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
          Stretch library
        </h2>
        <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]">
          <RiSearchLine size="1em" className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stretches"
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_AREAS.map((area) => {
            const active = areaFilter === area;
            return (
              <button
                key={area}
                type="button"
                onClick={() => setAreaFilter(active ? null : area)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? 'text-white'
                    : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
                style={active ? { backgroundColor: 'var(--accent)' } : undefined}
              >
                {AREA_LABELS[area]}
              </button>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          {filteredStretches.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No stretches match your search.
            </p>
          )}
          {filteredStretches.map((stretch) => (
            <button
              key={stretch.id}
              type="button"
              onClick={() => addStretch(stretch.id)}
              className="flex items-center justify-between rounded-2xl bg-white p-3 text-left ring-1 ring-slate-100 dark:bg-[var(--surface)] dark:ring-[var(--surface-border)]"
            >
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {stretch.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stretch.area.join(', ')} · {stretch.defaultSeconds}s
                  {usedStretchIds.has(stretch.id) ? ' · added' : ''}
                </p>
              </div>
              <RiAddFill size="1.1em" style={{ color: 'var(--accent)' }} />
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        disabled={!canSave}
        onClick={handleSave}
        className="rounded-2xl py-3.5 text-center text-sm font-bold uppercase tracking-wide disabled:opacity-40"
        style={{ backgroundColor: 'var(--ink)', color: 'var(--ink-contrast)' }}
      >
        Save routine
      </button>
    </div>
  );
}
