type Accent = 'lime' | 'blue' | 'indigo' | 'cyan' | 'teal' | 'violet' | 'emerald';

const PALETTE: Record<Accent, { a: string; b: string; c: string }> = {
  lime:    { a: 'rgba(170, 255, 0, 0.10)',  b: 'rgba(132, 204, 22, 0.08)', c: 'rgba(217, 249, 157, 0.06)' },
  blue:    { a: 'rgba(59, 130, 246, 0.22)', b: 'rgba(99, 102, 241, 0.16)', c: 'rgba(56, 189, 248, 0.12)' },
  indigo:  { a: 'rgba(99, 102, 241, 0.22)', b: 'rgba(139, 92, 246, 0.16)', c: 'rgba(67, 56, 202, 0.12)' },
  cyan:    { a: 'rgba(6, 182, 212, 0.22)',  b: 'rgba(59, 130, 246, 0.16)', c: 'rgba(34, 211, 238, 0.12)' },
  teal:    { a: 'rgba(20, 184, 166, 0.22)', b: 'rgba(6, 182, 212, 0.16)',  c: 'rgba(45, 212, 191, 0.12)' },
  violet:  { a: 'rgba(139, 92, 246, 0.22)', b: 'rgba(99, 102, 241, 0.16)', c: 'rgba(167, 139, 250, 0.12)' },
  emerald: { a: 'rgba(16, 185, 129, 0.22)', b: 'rgba(5, 150, 105, 0.16)',  c: 'rgba(52, 211, 153, 0.12)' },
};

export function GradientMesh({ accent = 'lime' }: { accent?: Accent }) {
  const c = PALETTE[accent];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 animate-mesh-drift"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, ${c.a}, transparent 70%),
            radial-gradient(ellipse 60% 50% at 80% 20%, ${c.b}, transparent 70%),
            radial-gradient(ellipse 70% 60% at 50% 80%, ${c.c}, transparent 70%)
          `,
        }}
      />
    </div>
  );
}
