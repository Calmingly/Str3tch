import type { Stretch } from '../types';

export const STRETCHES: Stretch[] = [
  {
    id: 'neck-tilt',
    name: 'Neck Side Tilt',
    area: ['neck'],
    instructions: [
      'Sit or stand tall, shoulders relaxed.',
      'Tilt your ear toward one shoulder until you feel a gentle stretch.',
      'Keep the opposite shoulder pressed down.',
    ],
    cue: 'Gentle pull along the side of your neck, not sharp pain.',
    defaultSeconds: 25,
    bilateral: true,
  },
  {
    id: 'neck-rotation',
    name: 'Neck Rotation',
    area: ['neck'],
    instructions: [
      'Slowly turn your head to look over one shoulder.',
      'Hold, then return to center.',
    ],
    cue: 'Mild stretch at the base of the skull and neck.',
    defaultSeconds: 20,
    bilateral: true,
  },
  {
    id: 'shoulder-rolls',
    name: 'Shoulder Rolls',
    area: ['shoulders'],
    instructions: ['Roll both shoulders up, back, and down in a slow circle.'],
    cue: 'Looseness across the top of the shoulders.',
    defaultSeconds: 30,
    bilateral: false,
  },
  {
    id: 'cross-body-shoulder',
    name: 'Cross-Body Shoulder Stretch',
    area: ['shoulders'],
    instructions: [
      'Bring one arm straight across your chest.',
      'Use the other arm to gently pull it closer.',
    ],
    cue: 'Stretch along the back of the shoulder.',
    defaultSeconds: 25,
    bilateral: true,
  },
  {
    id: 'chest-opener',
    name: 'Doorway Chest Opener',
    area: ['shoulders', 'back'],
    instructions: [
      'Place forearms on a doorframe or wall, elbows at shoulder height.',
      'Lean gently forward through the doorway.',
    ],
    cue: 'Opening across the chest and front shoulders.',
    defaultSeconds: 30,
    bilateral: false,
  },
  {
    id: 'cat-cow',
    name: 'Cat-Cow',
    area: ['back'],
    instructions: [
      'On hands and knees, arch your back and look up (cow).',
      'Round your spine and tuck your chin (cat).',
      'Flow slowly between the two.',
    ],
    cue: 'Gentle wave of motion along the whole spine.',
    defaultSeconds: 40,
    bilateral: false,
  },
  {
    id: 'seated-spinal-twist',
    name: 'Seated Spinal Twist',
    area: ['back', 'hips'],
    instructions: [
      'Sit tall, cross one leg over the other if comfortable.',
      'Rotate your torso toward the bent knee, using your arm for leverage.',
    ],
    cue: 'Twist through the mid and lower back.',
    defaultSeconds: 30,
    bilateral: true,
  },
  {
    id: 'childs-pose',
    name: "Child's Pose",
    area: ['back', 'hips'],
    instructions: [
      'Kneel and sit back onto your heels.',
      'Reach your arms forward and lower your chest toward the floor.',
    ],
    cue: 'Long, relaxed stretch through the low back and hips.',
    defaultSeconds: 40,
    bilateral: false,
  },
  {
    id: 'knee-to-chest',
    name: 'Knee-to-Chest',
    area: ['back', 'hips'],
    instructions: [
      'Lying on your back, pull one knee toward your chest.',
      'Keep the other leg relaxed on the floor or bent.',
    ],
    cue: 'Release through the lower back and glute.',
    defaultSeconds: 25,
    bilateral: true,
  },
  {
    id: 'hip-flexor-lunge',
    name: 'Kneeling Hip Flexor Stretch',
    area: ['hips'],
    instructions: [
      'Kneel on one knee in a half-lunge position.',
      'Shift your weight forward, keeping your torso upright.',
    ],
    cue: 'Stretch along the front of the hip and thigh.',
    defaultSeconds: 30,
    bilateral: true,
  },
  {
    id: 'figure-four',
    name: 'Figure-Four Stretch',
    area: ['hips'],
    instructions: [
      'Lying on your back, cross one ankle over the opposite knee.',
      'Pull the uncrossed leg toward your chest.',
    ],
    cue: 'Deep stretch through the outer hip and glute.',
    defaultSeconds: 30,
    bilateral: true,
  },
  {
    id: 'seated-forward-fold',
    name: 'Seated Forward Fold',
    area: ['hamstrings', 'back'],
    instructions: [
      'Sit with legs extended, back straight.',
      'Hinge forward from the hips, reaching toward your feet.',
    ],
    cue: 'Stretch along the back of both legs.',
    defaultSeconds: 30,
    bilateral: false,
  },
  {
    id: 'standing-hamstring',
    name: 'Standing Hamstring Stretch',
    area: ['hamstrings'],
    instructions: [
      'Place one heel on a low surface, leg straight.',
      'Hinge forward slightly from the hips.',
    ],
    cue: 'Stretch through the back of the raised leg.',
    defaultSeconds: 25,
    bilateral: true,
  },
  {
    id: 'quad-stretch',
    name: 'Standing Quad Stretch',
    area: ['quads'],
    instructions: [
      'Stand tall, hold onto something for balance.',
      'Pull one heel toward your glutes, knee pointing down.',
    ],
    cue: 'Stretch along the front of the thigh.',
    defaultSeconds: 25,
    bilateral: true,
  },
  {
    id: 'calf-wall-stretch',
    name: 'Wall Calf Stretch',
    area: ['calves'],
    instructions: [
      'Place hands on a wall, one leg back with heel on the ground.',
      'Lean forward, keeping the back leg straight.',
    ],
    cue: 'Stretch through the calf of the back leg.',
    defaultSeconds: 25,
    bilateral: true,
  },
  {
    id: 'ankle-circles',
    name: 'Ankle Circles',
    area: ['calves', 'full-body'],
    instructions: ['Lift one foot and slowly circle the ankle both directions.'],
    cue: 'Loosen up the ankle joint.',
    defaultSeconds: 20,
    bilateral: true,
  },
  {
    id: 'standing-side-bend',
    name: 'Standing Side Bend',
    area: ['back', 'full-body'],
    instructions: [
      'Stand tall, reach one arm overhead.',
      'Lean your torso to the opposite side.',
    ],
    cue: 'Stretch along the side of your torso.',
    defaultSeconds: 20,
    bilateral: true,
  },
  {
    id: 'deep-breathing',
    name: 'Standing Deep Breaths',
    area: ['full-body'],
    instructions: [
      'Stand tall, relax your shoulders.',
      'Inhale slowly through the nose, exhale fully through the mouth.',
    ],
    cue: 'A calm reset before or after your routine.',
    defaultSeconds: 30,
    bilateral: false,
    breathingPace: { inhaleSeconds: 4, exhaleSeconds: 6 },
  },
];

export function getStretch(id: string): Stretch {
  const stretch = STRETCHES.find((s) => s.id === id);
  if (!stretch) throw new Error(`Unknown stretch: ${id}`);
  return stretch;
}
