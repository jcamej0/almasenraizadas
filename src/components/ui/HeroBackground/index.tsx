/**
 * HeroBackground — Ambient scene with:
 *   1. Flowing gradient
 *   2. Breathing concentric rings
 *   3. Lottie illustration (lazy-loaded, client-side)
 *   4. Floating leaf outlines
 *   5. Ascending light particles
 *
 * CSS animations are server-rendered. Lottie loads client-side.
 */
import { Suspense, lazy } from 'react';
import styles from './HeroBackground.module.scss';

const PARTICLE_COUNT = 24;

/** Lazy-load the Lottie player (client component) */
const LottieScene = lazy(() =>
  import('./LottieScene').then((mod) => ({ default: mod.LottieScene }))
);

/** Deterministic pseudo-random (stable across SSR/hydration) */
const seededValue = (seed: number, index: number): number => {
  const x = Math.sin(seed * 9301 + index * 49297) * 49297;
  return x - Math.floor(x);
};

/** CSS custom properties for a single particle */
const buildParticleVars = (index: number): React.CSSProperties => {
  const left = seededValue(index, 1) * 100;
  const delay = seededValue(index, 2) * -20;
  const duration = 14 + seededValue(index, 3) * 18;
  const size = 2 + seededValue(index, 4) * 4;
  const opacity = 0.15 + seededValue(index, 5) * 0.35;
  const drift = -20 + seededValue(index, 6) * 40;

  return {
    '--p-left': `${left}%`,
    '--p-delay': `${delay.toFixed(1)}s`,
    '--p-duration': `${duration.toFixed(1)}s`,
    '--p-size': `${size.toFixed(1)}px`,
    '--p-opacity': opacity.toFixed(2),
    '--p-drift': `${drift.toFixed(0)}px`,
  } as React.CSSProperties;
};

/** Floating leaf outline SVG */
const FloatingLeaf = ({ className }: { className: string }) => (
  <svg
    className={className}
    viewBox="0 0 32 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M16 2C26 10 30 24 16 46C2 24 6 10 16 2Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
    />
    <path d="M16 8V40" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
    <path d="M16 16C12 18 9 22 8 26" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
    <path d="M16 22C20 24 23 28 24 32" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
  </svg>
);

export function HeroBackground() {
  return (
    <div className={styles.scene} aria-hidden="true">
      {/* Flowing gradient layer */}
      <div className={styles.gradient} />

      {/* Breathing concentric rings */}
      <div className={styles.rings}>
        <div className={`${styles.ring} ${styles.ring1}`} />
        <div className={`${styles.ring} ${styles.ring2}`} />
        <div className={`${styles.ring} ${styles.ring3}`} />
      </div>

      {/* Lottie illustration — lazy-loaded, gracefully hidden if missing */}
      <Suspense fallback={null}>
        <LottieScene />
      </Suspense>

      {/* Floating leaf outlines */}
      <FloatingLeaf className={`${styles.leaf} ${styles.leafA}`} />
      <FloatingLeaf className={`${styles.leaf} ${styles.leafB}`} />
      <FloatingLeaf className={`${styles.leaf} ${styles.leafC}`} />
      <FloatingLeaf className={`${styles.leaf} ${styles.leafD}`} />
      <FloatingLeaf className={`${styles.leaf} ${styles.leafE}`} />

      {/* Light particles ascending */}
      <div className={styles.particles}>
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <span
            key={i}
            className={styles.particle}
            style={buildParticleVars(i)}
          />
        ))}
      </div>
    </div>
  );
}
