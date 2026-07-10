interface LogoMarkProps {
  size?: number;
  className?: string;
}

export function LogoMark({ size = 36, className = '' }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 34c0-7 5-9 12-9s12-3 12-10c0-4-2-7-5-9"
        stroke="var(--accent)"
        strokeOpacity={0.45}
        strokeWidth={7}
        strokeLinecap="round"
      />
      <path
        d="M39 14c0 7-5 9-12 9s-12 3-12 10c0 4 2 7 5 9"
        stroke="var(--accent)"
        strokeWidth={7}
        strokeLinecap="round"
      />
    </svg>
  );
}

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      <span className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Str<span style={{ color: 'var(--accent)' }}>3</span>tch
      </span>
    </div>
  );
}
