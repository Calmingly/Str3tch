import type { Goal } from '../types';

export const GOAL_LABELS: Record<Goal, string> = {
  'general-mobility': 'Mobility',
  'targeted-relief': 'Relief',
  'activity-recovery': 'Recovery',
  'habit-building': 'Habit',
};

export const GOAL_COLORS: Record<Goal, string> = {
  'general-mobility': '#6B7F62',
  'targeted-relief': '#BC5B39',
  'activity-recovery': '#3F6E82',
  'habit-building': '#A9812F',
};

export function primaryGoal(goals: Goal[]): Goal {
  return goals[0];
}
