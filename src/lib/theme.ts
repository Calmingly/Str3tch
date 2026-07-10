import { RiFlowerFill, RiFireFill, RiFlashlightFill, RiSparklingFill } from '@remixicon/react';
import type { Icon } from './iconType';
import type { Goal, Routine } from '../types';

export interface GoalStyle {
  label: string;
  icon: Icon;
  gradient: string;
  chip: string;
  ring: string;
}

export const GOAL_STYLES: Record<Goal, GoalStyle> = {
  'general-mobility': {
    label: 'General mobility',
    icon: RiFlowerFill,
    gradient: 'from-[#2563EB] to-[#1D4ED8]',
    chip: 'bg-[#2563EB]/10 text-[#1d4ed8] dark:bg-[#2563EB]/25 dark:text-[#93c5fd]',
    ring: '#2563EB',
  },
  'targeted-relief': {
    label: 'Targeted relief',
    icon: RiFireFill,
    gradient: 'from-[#DB2777] to-[#BE185D]',
    chip: 'bg-[#DB2777]/10 text-[#be185d] dark:bg-[#DB2777]/25 dark:text-[#f9a8d4]',
    ring: '#DB2777',
  },
  'activity-recovery': {
    label: 'Activity recovery',
    icon: RiFlashlightFill,
    gradient: 'from-[#EA580C] to-[#C2410C]',
    chip: 'bg-[#EA580C]/10 text-[#c2410c] dark:bg-[#EA580C]/25 dark:text-[#fdba74]',
    ring: '#EA580C',
  },
  'habit-building': {
    label: 'Daily habit',
    icon: RiSparklingFill,
    gradient: 'from-[#7C3AED] to-[#6D28D9]',
    chip: 'bg-[#7C3AED]/10 text-[#6d28d9] dark:bg-[#7C3AED]/25 dark:text-[#c4b5fd]',
    ring: '#7C3AED',
  },
};

export function primaryGoalStyle(goals: Goal[]): GoalStyle {
  return GOAL_STYLES[goals[0]];
}

export function routineIcon(routine: Routine): Icon {
  return routine.icon ?? primaryGoalStyle(routine.goal).icon;
}
