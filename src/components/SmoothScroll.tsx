import gsap from 'gsap';
import Lenis from 'lenis';
import { ReactNode, useEffect } from 'react';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

type SmoothScrollProps = {
  children: ReactNode;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.35,
    });

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
