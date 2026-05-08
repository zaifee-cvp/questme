'use client';

import { useEffect, useRef } from 'react';

export function HeroGlow({ color = 'rgba(170, 255, 0, 0.10)' }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const handler = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        el.style.background = `radial-gradient(600px circle at ${x}% ${y}%, ${color}, transparent 40%)`;
      });
    };

    window.addEventListener('mousemove', handler, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handler);
      cancelAnimationFrame(raf);
    };
  }, [color]);

  return <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 transition-opacity duration-500" />;
}
