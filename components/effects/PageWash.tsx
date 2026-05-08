type Accent = 'lime' | 'blue' | 'indigo' | 'cyan' | 'teal' | 'violet' | 'emerald';

const PALETTE: Record<Accent, { top: string; bottom: string }> = {
  lime:    { top: 'rgba(170, 255, 0, 0.05)',  bottom: 'rgba(132, 204, 22, 0.04)' },
  blue:    { top: 'rgba(59, 130, 246, 0.07)', bottom: 'rgba(99, 102, 241, 0.05)' },
  indigo:  { top: 'rgba(99, 102, 241, 0.07)', bottom: 'rgba(139, 92, 246, 0.05)' },
  cyan:    { top: 'rgba(6, 182, 212, 0.07)',  bottom: 'rgba(59, 130, 246, 0.05)' },
  teal:    { top: 'rgba(20, 184, 166, 0.07)', bottom: 'rgba(6, 182, 212, 0.05)' },
  violet:  { top: 'rgba(139, 92, 246, 0.07)', bottom: 'rgba(99, 102, 241, 0.05)' },
  emerald: { top: 'rgba(16, 185, 129, 0.07)', bottom: 'rgba(5, 150, 105, 0.05)' },
};

export function PageWash({ accent = 'lime' }: { accent?: Accent }) {
  const c = PALETTE[accent];
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 120% 80% at 50% 0%, ${c.top}, transparent 70%),
          radial-gradient(ellipse 100% 60% at 50% 100%, ${c.bottom}, transparent 70%)
        `,
      }}
    />
  );
}
