interface StretchIllustrationProps {
  stretchId: string;
  size?: number;
  className?: string;
  rounded?: 'full' | 'lg';
}

export function StretchIllustration({
  stretchId,
  size = 96,
  className = '',
  rounded = 'full',
}: StretchIllustrationProps) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}stretches/${stretchId}.webp`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      style={{ width: size, height: size }}
      className={`shrink-0 object-cover ${rounded === 'full' ? 'rounded-full' : 'rounded-2xl'} ${className}`}
    />
  );
}
