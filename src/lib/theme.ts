import { RiFlowerFill, RiFireFill, RiFlashlightFill, RiSparklingFill } from '@remixicon/react';
import type { Icon } from './iconType';
import type { Goal, Routine } from '../types';

export interface GoalStyle {
  label: string;
  icon: Icon;
  gradient: string;
  solid: string;
  text: string;
  chip: string;
  ring: string;
  cardTint: string;
}

export const GOAL_STYLES: Record<Goal, GoalStyle> = {
  'general-mobility': {
    label: 'General mobility',
    icon: RiFlowerFill,
    gradient: 'from-emerald-300 to-teal-400',
    solid: 'bg-emerald-400',
    text: 'text-emerald-600',
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    ring: '#2dd4bf',
    cardTint: 'from-emerald-50 to-[var(--surface)] dark:from-emerald-500/10 dark:to-[var(--surface)]',
  },
  'targeted-relief': {
    label: 'Targeted relief',
    icon: RiFireFill,
    gradient: 'from-orange-300 to-rose-400',
    solid: 'bg-orange-400',
    text: 'text-orange-600',
    chip: 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
    ring: '#fb7185',
    cardTint: 'from-orange-50 to-[var(--surface)] dark:from-orange-500/10 dark:to-[var(--surface)]',
  },
  'activity-recovery': {
    label: 'Activity recovery',
    icon: RiFlashlightFill,
    gradient: 'from-sky-300 to-indigo-400',
    solid: 'bg-sky-400',
    text: 'text-sky-600',
    chip: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    ring: '#818cf8',
    cardTint: 'from-sky-50 to-[var(--surface)] dark:from-sky-500/10 dark:to-[var(--surface)]',
  },
  'habit-building': {
    label: 'Daily habit',
    icon: RiSparklingFill,
    gradient: 'from-violet-300 to-purple-400',
    solid: 'bg-violet-400',
    text: 'text-violet-600',
    chip: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
    ring: '#c084fc',
    cardTint: 'from-violet-50 to-[var(--surface)] dark:from-violet-500/10 dark:to-[var(--surface)]',
  },
};

export function primaryGoalStyle(goals: Goal[]): GoalStyle {
  return GOAL_STYLES[goals[0]];
}

export function routineIcon(routine: Routine): Icon {
  return routine.icon ?? primaryGoalStyle(routine.goal).icon;
}
