import { ArrowsPointingOutIcon, FireIcon, BoltIcon, SparklesIcon } from '@heroicons/react/24/solid';
import type { Icon } from './iconType';
import type { Goal } from '../types';

export interface GoalStyle {
  label: string;
  icon: Icon;
  gradient: string;
  solid: string;
  text: string;
  chip: string;
  ring: string;
}

export const GOAL_STYLES: Record<Goal, GoalStyle> = {
  'general-mobility': {
    label: 'General mobility',
    icon: ArrowsPointingOutIcon,
    gradient: 'from-emerald-400 to-teal-500',
    solid: 'bg-emerald-500',
    text: 'text-emerald-600',
    chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    ring: '#10b981',
  },
  'targeted-relief': {
    label: 'Targeted relief',
    icon: FireIcon,
    gradient: 'from-amber-400 to-orange-500',
    solid: 'bg-orange-500',
    text: 'text-orange-600',
    chip: 'bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
    ring: '#f97316',
  },
  'activity-recovery': {
    label: 'Activity recovery',
    icon: BoltIcon,
    gradient: 'from-sky-400 to-blue-500',
    solid: 'bg-sky-500',
    text: 'text-sky-600',
    chip: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    ring: '#0ea5e9',
  },
  'habit-building': {
    label: 'Daily habit',
    icon: SparklesIcon,
    gradient: 'from-violet-400 to-purple-500',
    solid: 'bg-violet-500',
    text: 'text-violet-600',
    chip: 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
    ring: '#8b5cf6',
  },
};

export function primaryGoalStyle(goals: Goal[]): GoalStyle {
  return GOAL_STYLES[goals[0]];
}
