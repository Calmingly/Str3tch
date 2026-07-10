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
    gradient: 'from-[#749c7d] to-[#5F8267]',
    chip: 'bg-[#5F8267]/10 text-[#3f5943] dark:bg-[#5F8267]/25 dark:text-[#a8c2ac]',
    ring: '#5F8267',
  },
  'targeted-relief': {
    label: 'Targeted relief',
    icon: RiFireFill,
    gradient: 'from-[#eb7f5b] to-[#E2643B]',
    chip: 'bg-[#E2643B]/10 text-[#9c3f24] dark:bg-[#E2643B]/25 dark:text-[#f4b39e]',
    ring: '#E2643B',
  },
  'activity-recovery': {
    label: 'Activity recovery',
    icon: RiFlashlightFill,
    gradient: 'from-[#6d97bc] to-[#4C7EA8]',
    chip: 'bg-[#4C7EA8]/10 text-[#2f4f68] dark:bg-[#4C7EA8]/25 dark:text-[#a9c5db]',
    ring: '#4C7EA8',
  },
  'habit-building': {
    label: 'Daily habit',
    icon: RiSparklingFill,
    gradient: 'from-[#d6a552] to-[#C98A2C]',
    chip: 'bg-[#C98A2C]/10 text-[#7a521a] dark:bg-[#C98A2C]/25 dark:text-[#e8c48a]',
    ring: '#C98A2C',
  },
};

export function primaryGoalStyle(goals: Goal[]): GoalStyle {
  return GOAL_STYLES[goals[0]];
}

export function routineIcon(routine: Routine): Icon {
  return routine.icon ?? primaryGoalStyle(routine.goal).icon;
}
