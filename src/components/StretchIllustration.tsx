import { useState } from 'react';

interface StretchIllustrationProps {
  stretchId: string;
  name?: string;
  size?: number;
  className?: string;
  rounded?: 'full' | 'lg';
}

export function StretchIllustration({
  stretchId,
  name,
  size = 96,
  className = '',
  rounded = 'full',
}: StretchIllustrationProps) {
  const [errored, setErrored] = useState(false);
  const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded-2xl';

  if (errored) {
    return (
      <div
        style={{ width: size, height: size, backgroundColor: 'var(--accent-soft)' }}
        className={`flex shrink-0 items-center justify-center ${roundedClass} ${className}`}
      >
        <span style={{ color: 'var(--accent)', fontSize: size * 0.32 }} className="font-bold">
          {(name ?? stretchId).charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={`${import.meta.env.BASE_URL}stretches/${stretchId}.webp`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      style={{ width: size, height: size }}
      onError={() => setErrored(true)}
      className={`shrink-0 object-cover ${roundedClass} ${className}`}
    />
  );
}
