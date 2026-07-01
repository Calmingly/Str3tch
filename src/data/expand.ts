import type { ExpandedStep, Routine } from '../types';
import { getStretch } from './stretches';

export function expandRoutine(routine: Routine): ExpandedStep[] {
  const steps: ExpandedStep[] = [];
  for (const step of routine.steps) {
    const stretch = getStretch(step.stretchId);
    const seconds = step.seconds ?? stretch.defaultSeconds;
    if (stretch.bilateral) {
      steps.push({ stretch, side: 'left', seconds });
      steps.push({ stretch, side: 'right', seconds });
    } else {
      steps.push({ stretch, side: null, seconds });
    }
  }
  return steps;
}

export function routineDurationSeconds(routine: Routine): number {
  return expandRoutine(routine).reduce((sum, s) => sum + s.seconds, 0);
}
