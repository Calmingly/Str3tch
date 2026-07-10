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
    gradient: 'from-[#00C7BE] to-[#009E97]',
    chip: 'bg-[#00C7BE]/10 text-[#007a74] dark:bg-[#00C7BE]/25 dark:text-[#7fe8e2]',
    ring: '#00C7BE',
  },
  'targeted-relief': {
    label: 'Targeted relief',
    icon: RiFireFill,
    gradient: 'from-[#FF375F] to-[#E01B44]',
    chip: 'bg-[#FF375F]/10 text-[#c8123c] dark:bg-[#FF375F]/25 dark:text-[#ff9bb1]',
    ring: '#FF375F',
  },
  'activity-recovery': {
    label: 'Activity recovery',
    icon: RiFlashlightFill,
    gradient: 'from-[#FF9500] to-[#E07D00]',
    chip: 'bg-[#FF9500]/10 text-[#a35700] dark:bg-[#FF9500]/25 dark:text-[#ffc37e]',
    ring: '#FF9500',
  },
  'habit-building': {
    label: 'Daily habit',
    icon: RiSparklingFill,
    gradient: 'from-[#AF52DE] to-[#8E3FBB]',
    chip: 'bg-[#AF52DE]/10 text-[#7c2ea8] dark:bg-[#AF52DE]/25 dark:text-[#dcabf3]',
    ring: '#AF52DE',
  },
};

export function primaryGoalStyle(goals: Goal[]): GoalStyle {
  return GOAL_STYLES[goals[0]];
}

export function routineIcon(routine: Routine): Icon {
  return routine.icon ?? primaryGoalStyle(routine.goal).icon;
}
