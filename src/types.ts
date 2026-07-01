export type BodyArea =
  | 'neck'
  | 'shoulders'
  | 'back'
  | 'hips'
  | 'hamstrings'
  | 'quads'
  | 'calves'
  | 'full-body';

export type Goal =
  | 'general-mobility'
  | 'targeted-relief'
  | 'activity-recovery'
  | 'habit-building';

export interface Stretch {
  id: string;
  name: string;
  area: BodyArea[];
  instructions: string[];
  cue: string;
  defaultSeconds: number;
  bilateral: boolean;
}

export interface RoutineStep {
  stretchId: string;
  seconds?: number;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  goal: Goal[];
  area: BodyArea[];
  steps: RoutineStep[];
  isCustom?: boolean;
}

export interface ExpandedStep {
  stretch: Stretch;
  side: 'left' | 'right' | null;
  seconds: number;
}

export interface FeelingRating {
  value: 1 | 2 | 3 | 4 | 5;
  label: string;
}

export interface SessionRecord {
  id: string;
  routineId: string;
  routineName: string;
  completedAt: string;
  durationSeconds: number;
  feeling: FeelingRating['value'] | null;
}

export interface ReminderSettings {
  enabled: boolean;
  time: string;
}
