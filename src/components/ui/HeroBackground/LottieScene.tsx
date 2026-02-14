'use client';

/**
 * LottieScene — Client-side Lottie player for the hero illustration.
 * Lazy-loaded to avoid blocking the initial render.
 * Falls back to nothing if the animation file isn't found.
 */
import { useEffect, useState, useRef } from 'react';
import Lottie from 'lottie-react';
import type { LottieRefCurrentProps } from 'lottie-react';
import styles from './HeroBackground.module.scss';

const ANIMATION_PATH = '/animations/meditation.json';

export function LottieScene() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [animationData, setAnimationData] = useState<unknown>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(ANIMATION_PATH, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(setAnimationData)
      .catch(() => setHasError(true));

    return () => controller.abort();
  }, []);

  /** Slow down the playback for a calmer, more meditative feel */
  useEffect(() => {
    if (lottieRef.current && animationData) {
      lottieRef.current.setSpeed(0.6);
    }
  }, [animationData]);

  if (hasError || !animationData) return null;

  return (
    <div className={styles.lottieWrap}>
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop
        autoplay
        className={styles.lottie}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMax meet',
        }}
      />
    </div>
  );
}
