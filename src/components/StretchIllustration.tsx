import { useState } from 'react';

interface StretchIllustrationProps {
  stretchId: string;
  name?: string;
  size?: number;
  width?: number | string;
  height?: number | string;
  className?: string;
  rounded?: 'full' | 'lg';
  tone?: 'plain' | 'duotone';
}

export function StretchIllustration({
  stretchId,
  name,
  size = 96,
  width,
  height,
  className = '',
  rounded = 'full',
  tone = 'plain',
}: StretchIllustrationProps) {
  const [errored, setErrored] = useState(false);
  const roundedClass = rounded === 'full' ? 'rounded-full' : 'rounded-2xl';
  const w = width ?? size;
  const h = height ?? size;

  if (errored) {
    return (
      <div
        style={{ width: w, height: h, backgroundColor: 'var(--accent-soft)' }}
        className={`flex shrink-0 items-center justify-center ${roundedClass} ${className}`}
      >
        <span style={{ color: 'var(--accent)', fontSize: size * 0.32 }} className="font-serif font-medium">
          {(name ?? stretchId).charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 overflow-hidden ${roundedClass} ${className}`}
      style={{ width: w, height: h }}
    >
      <img
        src={`${import.meta.env.BASE_URL}stretches/${stretchId}.webp`}
        alt=""
        loading="lazy"
        style={{
          width: '100%',
          height: '100%',
          filter: tone === 'duotone' ? 'grayscale(1) contrast(1.15) brightness(1.05)' : undefined,
        }}
        onError={() => setErrored(true)}
        className="object-cover"
      />
      {tone === 'duotone' && <div className="duotone-overlay absolute inset-0" />}
    </div>
  );
}
