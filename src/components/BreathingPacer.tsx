import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BreathingPacerProps {
  inhaleSeconds: number;
  exhaleSeconds: number;
  size?: number;
}

export function BreathingPacer({ inhaleSeconds, exhaleSeconds, size = 160 }: BreathingPacerProps) {
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');

  useEffect(() => {
    const duration = phase === 'inhale' ? inhaleSeconds : exhaleSeconds;
    const timer = window.setTimeout(() => {
      setPhase((p) => (p === 'inhale' ? 'exhale' : 'inhale'));
    }, duration * 1000);
    return () => window.clearTimeout(timer);
  }, [phase, inhaleSeconds, exhaleSeconds]);

  const duration = phase === 'inhale' ? inhaleSeconds : exhaleSeconds;
  const scale = phase === 'inhale' ? 1 : 0.55;

  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      <motion.div
        className="absolute rounded-full"
        style={{ width: '100%', height: '100%', background: 'var(--accent)', opacity: 0.15 }}
        animate={{ scale }}
        transition={{ duration, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: '68%', height: '68%', background: 'var(--accent)', opacity: 0.3 }}
        animate={{ scale }}
        transition={{ duration, ease: 'easeInOut' }}
      />
      <span
        className="relative z-10 text-sm font-bold uppercase tracking-wide"
        style={{ color: 'var(--accent)' }}
      >
        {phase === 'inhale' ? 'Inhale' : 'Exhale'}
      </span>
    </div>
  );
}
