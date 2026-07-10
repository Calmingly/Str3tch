export type BodyArea =
  | 'neck'
  | 'shoulders'
  | 'back'
  | 'hips'
  | 'hamstrings'
  | 'quads'
  | 'calves'
  | 'wrists'
  | 'full-body';

export type Goal =
  | 'general-mobility'
  | 'targeted-relief'
  | 'activity-recovery'
  | 'habit-building';

export interface BreathingPace {
  inhaleSeconds: number;
  exhaleSeconds: number;
}

export interface Stretch {
  id: string;
  name: string;
  area: BodyArea[];
  instructions: string[];
  cue: string;
  defaultSeconds: number;
  bilateral: boolean;
  breathingPace?: BreathingPace;
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
}

export interface ExpandedStep {
  stretch: Stretch;
  side: 'left' | 'right' | null;
  seconds: number;
}
