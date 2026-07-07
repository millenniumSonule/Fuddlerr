import { useEffect, useRef } from 'react';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import beerIcon from '../assets/beerIcon.png';

type CursorPoint = {
  x: number;
  y: number;
};

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLSpanElement[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    const glow = glowRef.current;
    const trails = trailRefs.current;
    if (!cursor || !glow || trails.length === 0) return;

    const target: CursorPoint = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current: CursorPoint = { ...target };
    const glowPosition: CursorPoint = { ...target };
    const trailPositions = trails.map(() => ({ ...target }));
    let raf = 0;

    const setInteractive = (element: Element | null, active: boolean) => {
      const label = element?.getAttribute('aria-label') || element?.textContent?.trim();
      document.documentElement.dataset.cursor = active ? 'active' : '';
      if (label) document.documentElement.dataset.cursorLabel = label.slice(0, 12);
    };

    const onPointerMove = (event: PointerEvent) => {
      const magnetic = (event.target as Element | null)?.closest<HTMLElement>('[data-magnetic]');
      if (magnetic) {
        const rect = magnetic.getBoundingClientRect();
        target.x = rect.left + rect.width / 2 + (event.clientX - rect.left - rect.width / 2) * 0.26;
        target.y = rect.top + rect.height / 2 + (event.clientY - rect.top - rect.height / 2) * 0.26;
      } else {
        target.x = event.clientX;
        target.y = event.clientY;
      }
    };

    const onPointerOver = (event: PointerEvent) => {
      const interactive = (event.target as Element | null)?.closest('a, button, [data-cursor], [data-magnetic]') ?? null;
      setInteractive(interactive, Boolean(interactive));
    };

    const onPointerOut = (event: PointerEvent) => {
      const related = event.relatedTarget as Element | null;
      if (!related?.closest?.('a, button, [data-cursor], [data-magnetic]')) {
        setInteractive(null, false);
      }
    };

    const render = () => {
      current.x += (target.x - current.x) * 0.2;
      current.y += (target.y - current.y) * 0.2;
      glowPosition.x += (target.x - glowPosition.x) * 0.08;
      glowPosition.y += (target.y - glowPosition.y) * 0.08;

      cursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      glow.style.transform = `translate3d(${glowPosition.x}px, ${glowPosition.y}px, 0) translate(-50%, -50%)`;

      trails.forEach((trail, index) => {
        const position = trailPositions[index];
        position.x += (target.x - position.x) * (0.11 - index * 0.012);
        position.y += (target.y - position.y) * (0.11 - index * 0.012);
        trail.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`;
        trail.style.opacity = `${0.18 - index * 0.025}`;
      });

      raf = requestAnimationFrame(render);
    };

    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      delete document.documentElement.dataset.cursor;
      delete document.documentElement.dataset.cursorLabel;
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div className="premium-cursor" aria-hidden="true">
      <div ref={glowRef} className="premium-cursor__glow" />
      {[0, 1, 2, 3, 4].map((item) => (
        <span
          key={item}
          ref={(node) => {
            if (node) trailRefs.current[item] = node;
          }}
          className="premium-cursor__trail"
        />
      ))}
      <img
        ref={cursorRef}
        src={beerIcon}
        alt="Beer Icon Cursor"
        className="premium-cursor__core premium-cursor__image"
      />
    </div>
  );
}
