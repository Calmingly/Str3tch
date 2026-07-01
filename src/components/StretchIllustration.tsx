interface Arrow {
  from: [number, number];
  to: [number, number];
  bend?: number;
}

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
  extra?: 'breath-lines';
  arrow?: Arrow;
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
    arrow: { from: [72, 8], to: [80, 20], bend: 1 },
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
    arrow: { from: [66, 6], to: [72, 16], bend: 1 },
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
    arrow: { from: [78, 16], to: [76, 30], bend: 1 },
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
    arrow: { from: [80, 22], to: [58, 34], bend: -1 },
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
    arrow: { from: [40, 6], to: [24, 12], bend: -1 },
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
    arrow: { from: [46, 18], to: [46, 30], bend: 1 },
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
    arrow: { from: [80, 20], to: [78, 34], bend: 1 },
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
    arrow: { from: [96, 30], to: [94, 42], bend: 1 },
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
    arrow: { from: [88, 18], to: [76, 28], bend: -1 },
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
    arrow: { from: [40, 42], to: [36, 52], bend: 1 },
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
    arrow: { from: [90, 16], to: [80, 26], bend: -1 },
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
    arrow: { from: [96, 62], to: [94, 74], bend: 1 },
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
    arrow: { from: [18, 30], to: [22, 42], bend: -1 },
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
    arrow: { from: [90, 46], to: [80, 56], bend: 1 },
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
    arrow: { from: [8, 44], to: [10, 56], bend: -1 },
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
    arrow: { from: [80, 74], to: [78, 88], bend: 1 },
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
    arrow: { from: [92, 6], to: [88, 18], bend: 1 },
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

const SKIN = '#f2c29e';
const HAIR = '#2b2018';
const SHORTS = '#27272a';
const SHOE = '#f8fafc';
const SHOE_SOLE = '#1e293b';
const OUTLINE = '#1f2937';

function lerp(a: [number, number], b: [number, number], t: number): [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function normalizeTransform(pose: Pose): string {
  const points: [number, number][] = [
    pose.head,
    pose.shoulderL,
    pose.shoulderR,
    pose.hipL,
    pose.hipR,
    pose.handL,
    pose.handR,
    pose.footL,
    pose.footR,
  ];
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX;
  const height = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const target = 66;
  const scale = Math.min(target / Math.max(width, 1), target / Math.max(height, 1), 1.5);

  return `translate(50 50) scale(${scale}) translate(${-centerX} ${-centerY})`;
}

function angleDeg(a: [number, number], b: [number, number]): number {
  return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
}

function Limb({
  from,
  to,
  clothFraction,
  clothColor,
  clothWidth,
  skinWidth,
  isArm,
}: {
  from: [number, number];
  to: [number, number];
  clothFraction: number;
  clothColor: string;
  clothWidth: number;
  skinWidth: number;
  isArm: boolean;
}) {
  const split = lerp(from, to, clothFraction);
  const shadeStart = lerp(from, split, 0.45);
  const angle = angleDeg(from, to);

  return (
    <g>
      {/* outline pass */}
      <line
        x1={from[0]}
        y1={from[1]}
        x2={to[0]}
        y2={to[1]}
        stroke={OUTLINE}
        strokeWidth={clothWidth + 3.2}
        strokeLinecap="round"
      />
      {/* clothed segment */}
      <line
        x1={from[0]}
        y1={from[1]}
        x2={split[0]}
        y2={split[1]}
        stroke={clothColor}
        strokeWidth={clothWidth}
        strokeLinecap="round"
      />
      {/* shading block on clothed segment */}
      <line
        x1={shadeStart[0]}
        y1={shadeStart[1]}
        x2={split[0]}
        y2={split[1]}
        stroke="black"
        strokeOpacity={0.18}
        strokeWidth={clothWidth * 0.75}
        strokeLinecap="round"
      />
      {/* skin segment */}
      <line
        x1={split[0]}
        y1={split[1]}
        x2={to[0]}
        y2={to[1]}
        stroke={SKIN}
        strokeWidth={skinWidth}
        strokeLinecap="round"
      />
      {isArm ? (
        <circle cx={to[0]} cy={to[1]} r={skinWidth * 0.62} fill={SKIN} stroke={OUTLINE} strokeWidth={1.4} />
      ) : (
        <g transform={`rotate(${angle} ${to[0]} ${to[1]})`}>
          <ellipse
            cx={to[0]}
            cy={to[1]}
            rx={skinWidth * 0.95}
            ry={skinWidth * 0.62}
            fill={SHOE}
            stroke={OUTLINE}
            strokeWidth={1.4}
          />
          <line
            x1={to[0] - skinWidth * 0.6}
            y1={to[1] + skinWidth * 0.3}
            x2={to[0] + skinWidth * 0.6}
            y2={to[1] + skinWidth * 0.3}
            stroke={SHOE_SOLE}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
}

function ArrowGlyph({ arrow }: { arrow: Arrow }) {
  const { from, to, bend = 1 } = arrow;
  const mid: [number, number] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const perpX = (-dy / len) * 8 * bend;
  const perpY = (dx / len) * 8 * bend;
  const control: [number, number] = [mid[0] + perpX, mid[1] + perpY];
  const tipAngle = angleDeg(control, to);
  const a1 = ((tipAngle + 145) * Math.PI) / 180;
  const a2 = ((tipAngle - 145) * Math.PI) / 180;
  const headLen = 4.5;

  return (
    <g>
      <path
        d={`M ${from[0]} ${from[1]} Q ${control[0]} ${control[1]} ${to[0]} ${to[1]}`}
        fill="none"
        stroke={OUTLINE}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <polygon
        points={`
          ${to[0]},${to[1]}
          ${to[0] + headLen * Math.cos(a1)},${to[1] + headLen * Math.sin(a1)}
          ${to[0] + headLen * Math.cos(a2)},${to[1] + headLen * Math.sin(a2)}
        `}
        fill={OUTLINE}
      />
    </g>
  );
}

interface StretchIllustrationProps {
  stretchId: string;
  color?: string;
  size?: number;
  className?: string;
  badge?: boolean;
}

export function StretchIllustration({
  stretchId,
  color = 'var(--accent)',
  size = 96,
  className = '',
  badge = true,
}: StretchIllustrationProps) {
  const poseId = STRETCH_POSE[stretchId] ?? 'breathing';
  const pose = POSES[poseId];
  const motionClass = pose.motion ? MOTION_CLASS[pose.motion] : '';
  const gradientId = `bodyGrad-${stretchId}`;

  const shoulderMid = lerp(pose.shoulderL, pose.shoulderR, 0.5);
  const hipMid = lerp(pose.hipL, pose.hipR, 0.5);
  const feetMid = lerp(pose.footL, pose.footR, 0.5);
  const headR = 8.5;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${motionClass} ${className}`}
    >
      {badge && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.95} />
            <stop offset="100%" stopColor={color} stopOpacity={0.65} />
          </linearGradient>
        </defs>
      )}
      {badge && <circle cx={50} cy={50} r={49} fill={`url(#${gradientId})`} />}

      <g transform={normalizeTransform(pose)}>
      <ellipse cx={feetMid[0]} cy={feetMid[1] + 4} rx={20} ry={4} fill="black" opacity={0.12} />

      {/* legs */}
      <Limb
        from={pose.hipL}
        to={pose.footL}
        clothFraction={0.55}
        clothColor={SHORTS}
        clothWidth={9}
        skinWidth={7}
        isArm={false}
      />
      <Limb
        from={pose.hipR}
        to={pose.footR}
        clothFraction={0.55}
        clothColor={SHORTS}
        clothWidth={9}
        skinWidth={7}
        isArm={false}
      />

      {/* torso */}
      <polygon
        points={`${pose.shoulderL[0]},${pose.shoulderL[1]} ${pose.shoulderR[0]},${pose.shoulderR[1]} ${pose.hipR[0]},${pose.hipR[1]} ${pose.hipL[0]},${pose.hipL[1]}`}
        fill={color}
        stroke={OUTLINE}
        strokeWidth={3.2}
        strokeLinejoin="round"
      />
      <polygon
        points={`${pose.shoulderL[0]},${pose.shoulderL[1]} ${shoulderMid[0]},${shoulderMid[1]} ${hipMid[0]},${hipMid[1]} ${pose.hipL[0]},${pose.hipL[1]}`}
        fill="black"
        opacity={0.15}
      />

      {/* arms */}
      <Limb
        from={pose.shoulderL}
        to={pose.handL}
        clothFraction={0.5}
        clothColor={color}
        clothWidth={7.5}
        skinWidth={6}
        isArm
      />
      <Limb
        from={pose.shoulderR}
        to={pose.handR}
        clothFraction={0.5}
        clothColor={color}
        clothWidth={7.5}
        skinWidth={6}
        isArm
      />

      {/* neck */}
      <line
        x1={shoulderMid[0]}
        y1={shoulderMid[1]}
        x2={pose.head[0]}
        y2={pose.head[1] + headR * 0.8}
        stroke={SKIN}
        strokeWidth={6}
        strokeLinecap="round"
      />

      {/* head */}
      <circle cx={pose.head[0]} cy={pose.head[1]} r={headR} fill={SKIN} stroke={OUTLINE} strokeWidth={1.6} />
      <path
        d={`M ${pose.head[0] - headR} ${pose.head[1] - headR * 0.15}
            A ${headR} ${headR} 0 0 1 ${pose.head[0] + headR} ${pose.head[1] - headR * 0.15}
            A ${headR * 1.2} ${headR * 1.2} 0 0 0 ${pose.head[0] - headR} ${pose.head[1] - headR * 0.15} Z`}
        fill={HAIR}
        stroke={OUTLINE}
        strokeWidth={1}
      />
      <circle cx={pose.head[0] - headR * 0.35} cy={pose.head[1] + headR * 0.05} r={1} fill={OUTLINE} />
      <circle cx={pose.head[0] + headR * 0.35} cy={pose.head[1] + headR * 0.05} r={1} fill={OUTLINE} />
      <path
        d={`M ${pose.head[0] - headR * 0.3} ${pose.head[1] + headR * 0.4} Q ${pose.head[0]} ${pose.head[1] + headR * 0.62} ${pose.head[0] + headR * 0.3} ${pose.head[1] + headR * 0.4}`}
        fill="none"
        stroke={OUTLINE}
        strokeWidth={1}
        strokeLinecap="round"
      />

      {pose.arrow && <ArrowGlyph arrow={pose.arrow} />}
      {pose.extra === 'breath-lines' && (
        <g stroke={OUTLINE} strokeWidth={2} strokeLinecap="round" opacity={0.4}>
          <path d="M 8 40 Q 16 40 20 46" fill="none" />
          <path d="M 92 40 Q 84 40 80 46" fill="none" />
        </g>
      )}
      </g>
    </svg>
  );
}
