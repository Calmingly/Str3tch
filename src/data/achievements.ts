import type { IconType } from 'react-icons';
import {
  PiPersonSimpleWalkFill,
  PiFireFill,
  PiCalendarCheckFill,
  PiTrophyFill,
  PiBarbellFill,
  PiStarFill,
  PiMedalFill,
  PiCompassFill,
  PiSunHorizonFill,
  PiMoonStarsFill,
  PiWrenchFill,
  PiSmileyStickerFill,
} from 'react-icons/pi';
import type { SessionRecord } from '../types';
import { ROUTINES } from './routines';
import { computeStreak } from '../lib/streak';

export interface AchievementContext {
  sessions: SessionRecord[];
  customRoutineCount: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: IconType;
  isUnlocked: (ctx: AchievementContext) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-stretch',
    name: 'First Stretch',
    description: 'Complete your first routine',
    icon: PiPersonSimpleWalkFill,
    isUnlocked: (ctx) => ctx.sessions.length >= 1,
  },
  {
    id: 'streak-3',
    name: '3-Day Streak',
    description: 'Stretch 3 days in a row',
    icon: PiFireFill,
    isUnlocked: (ctx) => computeStreak(ctx.sessions).longest >= 3,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Stretch 7 days in a row',
    icon: PiCalendarCheckFill,
    isUnlocked: (ctx) => computeStreak(ctx.sessions).longest >= 7,
  },
  {
    id: 'streak-30',
    name: 'Habit Master',
    description: 'Stretch 30 days in a row',
    icon: PiTrophyFill,
    isUnlocked: (ctx) => computeStreak(ctx.sessions).longest >= 30,
  },
  {
    id: 'sessions-10',
    name: 'Getting Consistent',
    description: 'Complete 10 total sessions',
    icon: PiBarbellFill,
    isUnlocked: (ctx) => ctx.sessions.length >= 10,
  },
  {
    id: 'sessions-50',
    name: '50 Club',
    description: 'Complete 50 total sessions',
    icon: PiStarFill,
    isUnlocked: (ctx) => ctx.sessions.length >= 50,
  },
  {
    id: 'sessions-100',
    name: 'Century Club',
    description: 'Complete 100 total sessions',
    icon: PiMedalFill,
    isUnlocked: (ctx) => ctx.sessions.length >= 100,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Try every built-in routine at least once',
    icon: PiCompassFill,
    isUnlocked: (ctx) => {
      const tried = new Set(ctx.sessions.map((s) => s.routineId));
      return ROUTINES.every((r) => tried.has(r.id));
    },
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Finish a routine before 7am',
    icon: PiSunHorizonFill,
    isUnlocked: (ctx) => ctx.sessions.some((s) => new Date(s.completedAt).getHours() < 7),
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Finish a routine after 9pm',
    icon: PiMoonStarsFill,
    isUnlocked: (ctx) => ctx.sessions.some((s) => new Date(s.completedAt).getHours() >= 21),
  },
  {
    id: 'builder',
    name: 'Routine Creator',
    description: 'Build your own custom routine',
    icon: PiWrenchFill,
    isUnlocked: (ctx) => ctx.customRoutineCount >= 1,
  },
  {
    id: 'feeling-great',
    name: 'Feeling Great',
    description: 'Rate a session "Great" 5 times',
    icon: PiSmileyStickerFill,
    isUnlocked: (ctx) => ctx.sessions.filter((s) => s.feeling === 5).length >= 5,
  },
];

export function unlockedAchievementIds(ctx: AchievementContext): Set<string> {
  return new Set(ACHIEVEMENTS.filter((a) => a.isUnlocked(ctx)).map((a) => a.id));
}
