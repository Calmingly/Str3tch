interface Pose {
  head: [number, number];
  shoulderL: [number, number];
  shoulderR: [number, number];
  hipL: [number, number];
  hipR: [number, number];
  handL: [number, number];
  handR: [number, number];
  footL: [number, number];
  footR: [number, number];
  motion?: 'sway' | 'rotate' | 'pulse' | 'bounce' | 'breathe';
  extra?: 'circle-arrow' | 'breath-lines';
}

const POSES: Record<string, Pose> = {
  'neck-tilt': {
    head: [58, 15],
    shoulderL: [38, 28],
    shoulderR: [60, 27],
    hipL: [44, 56],
    hipR: [56, 56],
    handL: [30, 52],
    handR: [70, 50],
    footL: [42, 92],
    footR: [58, 92],
    motion: 'sway',
  },
  'neck-rotation': {
    head: [54, 14],
    shoulderL: [38, 27],
    shoulderR: [62, 27],
    hipL: [44, 56],
    hipR: [56, 56],
    handL: [32, 51],
    handR: [68, 51],
    footL: [42, 92],
    footR: [58, 92],
    motion: 'rotate',
  },
  'shoulder-roll': {
    head: [50, 14],
    shoulderL: [36, 28],
    shoulderR: [64, 28],
    hipL: [44, 56],
    hipR: [56, 56],
    handL: [30, 22],
    handR: [70, 22],
    footL: [42, 92],
    footR: [58, 92],
    motion: 'rotate',
    extra: 'circle-arrow',
  },
  'cross-arm': {
    head: [50, 14],
    shoulderL: [36, 27],
    shoulderR: [64, 27],
    hipL: [44, 56],
    hipR: [56, 56],
    handL: [70, 32],
    handR: [30, 40],
    footL: [42, 92],
    footR: [58, 92],
    motion: 'pulse',
  },
  'chest-open': {
    head: [50, 14],
    shoulderL: [34, 28],
    shoulderR: [66, 28],
    hipL: [44, 56],
    hipR: [56, 56],
    handL: [16, 16],
    handR: [84, 16],
    footL: [42, 92],
    footR: [58, 92],
    motion: 'breathe',
  },
  'cat-cow': {
    head: [82, 40],
    shoulderL: [66, 42],
    shoulderR: [66, 34],
    hipL: [30, 42],
    hipR: [30, 34],
    handL: [70, 68],
    handR: [70, 62],
    footL: [26, 68],
    footR: [26, 62],
    motion: 'breathe',
  },
  'seated-twist': {
    head: [58, 20],
    shoulderL: [40, 34],
    shoulderR: [66, 30],
    hipL: [40, 62],
    hipR: [60, 62],
    handL: [66, 46],
    handR: [30, 44],
    footL: [30, 84],
    footR: [70, 84],
    motion: 'sway',
  },
  'childs-pose': {
    head: [78, 60],
    shoulderL: [64, 54],
    shoulderR: [64, 46],
    hipL: [30, 54],
    hipR: [30, 46],
    handL: [90, 40],
    handR: [90, 60],
    footL: [26, 78],
    footR: [34, 78],
    motion: 'breathe',
  },
  'knee-to-chest': {
    head: [26, 46],
    shoulderL: [42, 48],
    shoulderR: [42, 42],
    hipL: [58, 48],
    hipR: [58, 42],
    handL: [70, 30],
    handR: [70, 60],
    footL: [72, 32],
    footR: [72, 58],
    motion: 'pulse',
  },
  lunge: {
    head: [46, 16],
    shoulderL: [36, 30],
    shoulderR: [56, 30],
    hipL: [42, 56],
    hipR: [56, 58],
    handL: [30, 56],
    handR: [64, 56],
    footL: [26, 90],
    footR: [70, 74],
    motion: 'breathe',
  },
  'figure-four': {
    head: [22, 46],
    shoulderL: [38, 48],
    shoulderR: [38, 42],
    hipL: [54, 48],
    hipR: [54, 42],
    handL: [70, 32],
    handR: [70, 58],
    footL: [78, 34],
    footR: [58, 40],
    motion: 'pulse',
  },
  'forward-fold': {
    head: [78, 58],
    shoulderL: [64, 54],
    shoulderR: [64, 62],
    hipL: [40, 60],
    hipR: [40, 68],
    handL: [86, 74],
    handR: [86, 82],
    footL: [24, 84],
    footR: [24, 90],
    motion: 'breathe',
  },
  'standing-hamstring': {
    head: [42, 22],
    shoulderL: [30, 34],
    shoulderR: [50, 32],
    hipL: [38, 56],
    hipR: [50, 56],
    handL: [60, 44],
    handR: [66, 50],
    footL: [58, 46],
    footR: [40, 92],
    motion: 'breathe',
  },
  'quad-stretch': {
    head: [50, 14],
    shoulderL: [38, 28],
    shoulderR: [62, 28],
    hipL: [44, 56],
    hipR: [56, 56],
    handL: [30, 46],
    handR: [66, 60],
    footL: [42, 92],
    footR: [70, 64],
    motion: 'sway',
  },
  'calf-wall': {
    head: [30, 18],
    shoulderL: [26, 30],
    shoulderR: [40, 28],
    hipL: [46, 56],
    hipR: [56, 56],
    handL: [12, 30],
    handR: [16, 34],
    footL: [70, 92],
    footR: [44, 88],
    motion: 'breathe',
  },
  'ankle-circle': {
    head: [50, 14],
    shoulderL: [38, 28],
    shoulderR: [62, 28],
    hipL: [44, 56],
    hipR: [56, 56],
    handL: [34, 50],
    handR: [66, 50],
    footL: [42, 92],
    footR: [62, 84],
    motion: 'rotate',
    extra: 'circle-arrow',
  },
  'side-bend': {
    head: [64, 18],
    shoulderL: [42, 30],
    shoulderR: [60, 26],
    hipL: [44, 56],
    hipR: [56, 56],
    handL: [30, 46],
    handR: [78, 12],
    footL: [42, 92],
    footR: [58, 92],
    motion: 'sway',
  },
  breathing: {
    head: [50, 14],
    shoulderL: [36, 28],
    shoulderR: [64, 28],
    hipL: [44, 56],
    hipR: [56, 56],
    handL: [24, 20],
    handR: [76, 20],
    footL: [42, 92],
    footR: [58, 92],
    motion: 'breathe',
    extra: 'breath-lines',
  },
};

const STRETCH_POSE: Record<string, string> = {
  'neck-tilt': 'neck-tilt',
  'neck-rotation': 'neck-rotation',
  'shoulder-rolls': 'shoulder-roll',
  'cross-body-shoulder': 'cross-arm',
  'chest-opener': 'chest-open',
  'cat-cow': 'cat-cow',
  'seated-spinal-twist': 'seated-twist',
  'childs-pose': 'childs-pose',
  'knee-to-chest': 'knee-to-chest',
  'hip-flexor-lunge': 'lunge',
  'figure-four': 'figure-four',
  'seated-forward-fold': 'forward-fold',
  'standing-hamstring': 'standing-hamstring',
  'quad-stretch': 'quad-stretch',
  'calf-wall-stretch': 'calf-wall',
  'ankle-circles': 'ankle-circle',
  'standing-side-bend': 'side-bend',
  'deep-breathing': 'breathing',
};

const MOTION_CLASS: Record<NonNullable<Pose['motion']>, string> = {
  sway: 'animate-pose-sway',
  rotate: 'animate-pose-rotate',
  pulse: 'animate-pose-pulse',
  bounce: 'animate-pose-bounce',
  breathe: 'animate-pose-breathe',
};

interface StretchIllustrationProps {
  stretchId: string;
  color?: string;
  size?: number;
  className?: string;
}

export function StretchIllustration({
  stretchId,
  color = '#0ea5e9',
  size = 96,
  className = '',
}: StretchIllustrationProps) {
  const poseId = STRETCH_POSE[stretchId] ?? 'breathing';
  const pose = POSES[poseId];
  const motionClass = pose.motion ? MOTION_CLASS[pose.motion] : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${motionClass} ${className}`}
      style={{ color }}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1={pose.shoulderL[0]} y1={pose.shoulderL[1]} x2={pose.handL[0]} y2={pose.handL[1]} />
        <line x1={pose.shoulderR[0]} y1={pose.shoulderR[1]} x2={pose.handR[0]} y2={pose.handR[1]} />
        <line x1={pose.hipL[0]} y1={pose.hipL[1]} x2={pose.footL[0]} y2={pose.footL[1]} />
        <line x1={pose.hipR[0]} y1={pose.hipR[1]} x2={pose.footR[0]} y2={pose.footR[1]} />
        <path
          d={`M ${(pose.shoulderL[0] + pose.shoulderR[0]) / 2} ${(pose.shoulderL[1] + pose.shoulderR[1]) / 2}
              L ${(pose.hipL[0] + pose.hipR[0]) / 2} ${(pose.hipL[1] + pose.hipR[1]) / 2}`}
        />
        <line x1={pose.shoulderL[0]} y1={pose.shoulderL[1]} x2={pose.shoulderR[0]} y2={pose.shoulderR[1]} />
        <line x1={pose.hipL[0]} y1={pose.hipL[1]} x2={pose.hipR[0]} y2={pose.hipR[1]} />
      </g>
      <circle cx={pose.head[0]} cy={pose.head[1]} r={8} fill="currentColor" style={{ color }} />
      {pose.extra === 'circle-arrow' && (
        <path
          d="M 66 60 A 12 12 0 1 1 62 50"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.6}
        />
      )}
      {pose.extra === 'breath-lines' && (
        <g stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" opacity={0.45}>
          <path d="M 8 40 Q 16 40 20 46" fill="none" />
          <path d="M 92 40 Q 84 40 80 46" fill="none" />
        </g>
      )}
    </svg>
  );
}
