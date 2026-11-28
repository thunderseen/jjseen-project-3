import React, { useEffect, useRef } from 'react';

// Ultra-lightweight, subtle normal cursor ring (pure GPU transform, zero canvas overhead)
export const CursorCompanion: React.FC = () => {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCoarse || isReduced) return;

    const ring = ringRef.current;
    if (!ring) return;

    let rafId = 0;
    let running = false;
    let visible = false;
    let interactive = false;
    let tx = -100;
    let ty = -100;
    let x = -100;
    let y = -100;

    const tick = () => {
      x += (tx - x) * 0.24;
      y += (ty - y) * 0.24;
      const scale = interactive ? 1.55 : 1;
      ring.style.transform = `translate3d(${x - 9}px, ${y - 9}px, 0) scale(${scale})`;

      if (Math.abs(tx - x) > 0.15 || Math.abs(ty - y) > 0.15) {
        rafId = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const startLoop = () => {
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        x = tx;
        y = ty;
        visible = true;
        ring.style.opacity = '1';
      }
      const el = e.target as HTMLElement | null;
      const nextInteractive = Boolean(
        el?.closest('a, button, input, textarea, select, [role="button"], .contact-btn')
      );
      if (nextInteractive !== interactive) {
        interactive = nextInteractive;
        ring.style.borderColor = interactive
          ? 'rgba(139, 124, 255, 0.85)'
          : 'rgba(215, 226, 234, 0.45)';
        ring.style.backgroundColor = interactive
          ? 'rgba(139, 124, 255, 0.12)'
          : 'transparent';
      }
      startLoop();
    };

    const onLeave = () => {
      visible = false;
      ring.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="no-print pointer-events-none fixed left-0 top-0 z-40 h-[18px] w-[18px] rounded-full border border-[#D7E2EA]/45 opacity-0 transition-[opacity,border-color,background-color] duration-150"
      style={{ willChange: 'transform' }}
    />
  );
};
