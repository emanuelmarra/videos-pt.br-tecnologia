/** Pizza dividida em N fatias — as fatias se afastam no hover do card (classe .group). */
export function SliceDiagram({ slices, className }: { slices: number; className?: string }) {
  const R = 44;
  const gap = 0.045; // radianos entre fatias
  const paths = Array.from({ length: slices }, (_, i) => {
    const a0 = (i / slices) * Math.PI * 2 - Math.PI / 2 + gap / 2;
    const a1 = ((i + 1) / slices) * Math.PI * 2 - Math.PI / 2 - gap / 2;
    const mid = (a0 + a1) / 2;
    const p = (a: number, r: number) => `${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return {
      d: `M${p(mid, 2.2)} L${p(a0, R)} A${R} ${R} 0 ${large} 1 ${p(a1, R)} Z`,
      dx: `${(Math.cos(mid) * 3.4).toFixed(2)}px`,
      dy: `${(Math.sin(mid) * 3.4).toFixed(2)}px`,
    };
  });
  return (
    <svg viewBox="0 0 100 100" className={`slice-diagram overflow-visible ${className ?? ""}`} aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="48.5" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="1.5 3" />
      {paths.map((s, i) => (
        <path
          key={i}
          d={s.d}
          style={{ ["--dx" as string]: s.dx, ["--dy" as string]: s.dy }}
          className="fill-gold/15 stroke-gold group-hover:fill-gold/30"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
