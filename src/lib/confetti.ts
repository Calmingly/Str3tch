function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export async function celebrateCompletion() {
  if (prefersReducedMotion()) return;
  const { default: confetti } = await import('canvas-confetti');
  confetti({
    particleCount: 60,
    spread: 70,
    startVelocity: 35,
    origin: { y: 0.6 },
    colors: ['#0ea5e9', '#38bdf8', '#8b5cf6', '#f97316', '#10b981'],
  });
}

export async function celebrateAchievement() {
  if (prefersReducedMotion()) return;
  const { default: confetti } = await import('canvas-confetti');
  const end = Date.now() + 600;
  const colors = ['#facc15', '#f97316', '#0ea5e9'];
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
