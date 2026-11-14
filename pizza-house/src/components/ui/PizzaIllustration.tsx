import type { IllustrationKind } from "@/data/menu";

/**
 * Ilustração vetorial (vista de cima) para sabores que ainda não têm foto.
 * Desenho determinístico: o mesmo sabor gera sempre o mesmo resultado
 * (sem diferenças entre servidor e navegador).
 */

const C = 100; // centro do viewBox 200x200
const r1 = (n: number) => Math.round(n * 10) / 10;

function random(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Distribuição uniforme (girassol) com leve variação — parece feito à mão. */
function scatter(n: number, radius: number, rand: () => number, jitter = 4) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const r = Math.sqrt((i + 0.5) / n) * radius;
    const t = i * golden + rand() * 0.6;
    return [r1(C + r * Math.cos(t) + (rand() - 0.5) * jitter), r1(C + r * Math.sin(t) + (rand() - 0.5) * jitter)] as const;
  });
}

/** Contorno orgânico (queijo derretido / chocolate) em volta do centro. */
function blobPath(radius: number, wobble: number, rand: () => number, points = 40) {
  const pts = Array.from({ length: points }, (_, i) => {
    const t = (i / points) * Math.PI * 2;
    const r = radius + (rand() - 0.5) * wobble * 2;
    return [C + r * Math.cos(t), C + r * Math.sin(t)];
  });
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < points; i++) {
    const p = pts[(i + 1) % points];
    const q = pts[(i + 2) % points];
    d += ` Q${r1(p[0])} ${r1(p[1])} ${r1((p[0] + q[0]) / 2)} ${r1((p[1] + q[1]) / 2)}`;
  }
  return d + "Z";
}

const seeds: Record<IllustrationKind, number> = {
  calabresa: 11,
  "quatro-queijos": 29,
  "cinco-queijos": 47,
  costela: 73,
  pepperoni: 97,
  kitkat: 131,
};

export function PizzaIllustration({ kind, className }: { kind: IllustrationKind; className?: string }) {
  const rand = random(seeds[kind]);
  const id = `pz-${kind}`;
  const sweet = kind === "kitkat";

  const crustSpots = Array.from({ length: 16 }, (_, i) => {
    const t = (i / 16) * Math.PI * 2 + rand() * 0.3;
    const r = 77 + rand() * 4;
    return { x: r1(C + r * Math.cos(t)), y: r1(C + r * Math.sin(t)), rx: r1(2 + rand() * 3), ry: r1(1 + rand() * 1.6), a: r1((t * 180) / Math.PI + 90) };
  });

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-crust`} cx="45%" cy="40%" r="62%">
          <stop offset="0.72" stopColor="#e8b56d" />
          <stop offset="0.9" stopColor="#cf9049" />
          <stop offset="1" stopColor="#a8682f" />
        </radialGradient>
        <radialGradient id={`${id}-cheese`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor={sweet ? "#5a301b" : "#f7da95"} />
          <stop offset="1" stopColor={sweet ? "#3a1d10" : "#e9bd68"} />
        </radialGradient>
        <radialGradient id={`${id}-gloss`} cx="32%" cy="26%" r="55%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* sombra e massa */}
      <circle cx={C + 5} cy={C + 8} r="84" fill="#000" opacity="0.5" filter={`url(#${id}-shadow)`} />
      <circle cx={C} cy={C} r="84" fill={`url(#${id}-crust)`} />
      {crustSpots.map((s, i) => (
        <ellipse key={i} cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} transform={`rotate(${s.a} ${s.x} ${s.y})`} fill="#7c4519" opacity="0.32" />
      ))}
      <circle cx={C} cy={C} r="71.5" fill="#9c5c2a" opacity="0.55" />
      <circle cx={C} cy={C} r="70" fill={sweet ? "#2e170c" : "#b4412a"} />
      <path d={blobPath(sweet ? 67 : 65.5, sweet ? 1.2 : 2.6, rand)} fill={`url(#${id}-cheese)`} />

      {!sweet &&
        scatter(26, 60, rand, 6).map(([x, y], i) => (
          <ellipse
            key={`c${i}`}
            cx={x}
            cy={y}
            rx={r1(3 + rand() * 5)}
            ry={r1(2 + rand() * 3)}
            transform={`rotate(${r1(rand() * 180)} ${x} ${y})`}
            fill={i % 3 === 0 ? "#d6943f" : "#fbe7b4"}
            opacity={i % 3 === 0 ? 0.45 : 0.7}
          />
        ))}

      {toppings(kind, rand)}

      {/* cortes das fatias */}
      {Array.from({ length: 8 }, (_, i) => {
        const t = (i / 8) * Math.PI * 2 + 0.2;
        return (
          <line key={`l${i}`} x1={C} y1={C} x2={r1(C + 84 * Math.cos(t))} y2={r1(C + 84 * Math.sin(t))} stroke="#5a2f12" strokeOpacity="0.22" strokeWidth="0.9" />
        );
      })}
      <circle cx={C} cy={C} r="84" fill={`url(#${id}-gloss)`} />
    </svg>
  );
}

function toppings(kind: IllustrationKind, rand: () => number) {
  switch (kind) {
    case "calabresa":
      return (
        <g>
          {scatter(11, 50, rand).map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r="10.8" fill="#8d3127" />
              <circle r="9.2" fill="#bf503e" />
              {Array.from({ length: 5 }, (_, j) => (
                <circle key={j} cx={r1((rand() - 0.5) * 11)} cy={r1((rand() - 0.5) * 11)} r={r1(0.8 + rand() * 0.7)} fill="#f3cdb6" opacity="0.85" />
              ))}
            </g>
          ))}
          {scatter(8, 54, rand, 10).map(([x, y], i) => (
            <ellipse key={`o${i}`} cx={x} cy={y} rx={r1(6 + rand() * 3)} ry={r1(3.5 + rand() * 2)} transform={`rotate(${r1(rand() * 180)} ${x} ${y})`} fill="none" stroke="#f8eedd" strokeWidth="1.6" strokeDasharray="22 6" opacity="0.92" />
          ))}
        </g>
      );
    case "pepperoni":
      return (
        <g>
          {scatter(16, 54, rand, 3).map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <circle r="8.2" fill="#7f1d12" />
              <circle r="6.9" fill="#ad2f1d" />
              <ellipse cx="-2.2" cy="-2.4" rx="2.6" ry="1.5" fill="#e0643f" opacity="0.55" />
              <circle cx={r1((rand() - 0.5) * 7)} cy={r1((rand() - 0.5) * 7)} r="0.9" fill="#5e140b" />
              <circle cx={r1((rand() - 0.5) * 7)} cy={r1((rand() - 0.5) * 7)} r="0.7" fill="#5e140b" />
            </g>
          ))}
        </g>
      );
    case "costela": {
      const tones = ["#6b3519", "#7d4220", "#552a12", "#8f5129", "#a2643a"];
      return (
        <g strokeLinecap="round" fill="none">
          {scatter(54, 58, rand, 8).map(([x, y], i) => {
            const a = rand() * Math.PI * 2;
            const len = 7 + rand() * 8;
            const ex = r1(x + Math.cos(a) * len);
            const ey = r1(y + Math.sin(a) * len);
            const cx = r1(x + Math.cos(a + 0.6) * len * 0.6);
            const cy = r1(y + Math.sin(a + 0.6) * len * 0.6);
            return <path key={i} d={`M${x} ${y} Q${cx} ${cy} ${ex} ${ey}`} stroke={tones[i % tones.length]} strokeWidth={r1(2.4 + rand() * 1.4)} />;
          })}
        </g>
      );
    }
    case "quatro-queijos":
    case "cinco-queijos": {
      const tones =
        kind === "quatro-queijos"
          ? ["#fbf4e2", "#f3c35a", "#e9a447", "#ece7d6"]
          : ["#fbf4e2", "#f3c35a", "#e39a3b", "#ece7d6", "#f6e2a6"];
      const n = kind === "quatro-queijos" ? 22 : 28;
      return (
        <g>
          {scatter(16, 58, rand, 12).map(([x, y], i) => (
            <circle key={`t${i}`} cx={x} cy={y} r={r1(1.6 + rand() * 2.6)} fill="#b8722e" opacity="0.5" />
          ))}
          {scatter(n, 56, rand, 6).map(([x, y], i) => {
            const tone = tones[i % tones.length];
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx={r1(5.5 + rand() * 5)} ry={r1(4.5 + rand() * 3.5)} transform={`rotate(${r1(rand() * 180)} ${x} ${y})`} fill={tone} opacity="0.95" />
                {tone === "#ece7d6" &&
                  Array.from({ length: 4 }, (_, j) => (
                    <circle key={j} cx={r1(x + (rand() - 0.5) * 8)} cy={r1(y + (rand() - 0.5) * 6)} r="0.8" fill="#5f7186" opacity="0.8" />
                  ))}
              </g>
            );
          })}
          {kind === "cinco-queijos" &&
            scatter(18, 58, rand, 10).map(([x, y], i) => (
              <rect key={`f${i}`} x={x} y={y} width={r1(2 + rand() * 3)} height="1.3" rx="0.6" transform={`rotate(${r1(rand() * 180)} ${x} ${y})`} fill="#fff4d6" opacity="0.9" />
            ))}
        </g>
      );
    }
    case "kitkat":
      return (
        <g>
          {Array.from({ length: 6 }, (_, i) => (
            <path key={`s${i}`} d={blobPath(18 + i * 8, 1.6, rand, 18)} fill="none" stroke="#6d3c21" strokeOpacity="0.45" strokeWidth="1.1" />
          ))}
          {scatter(9, 46, rand, 6).map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r1(rand() * 180)})`}>
              <rect x="-10.5" y="-5" width="21" height="10" rx="1.6" fill="#5a3015" />
              <rect x="-10" y="-4.6" width="20" height="9" rx="1.4" fill="#93582a" />
              <rect x="-9" y="-3.8" width="18" height="2.2" rx="1" fill="#b77a44" opacity="0.7" />
              <line x1="0" y1="-4.6" x2="0" y2="4.4" stroke="#5a3015" strokeWidth="1.1" />
            </g>
          ))}
          {scatter(30, 60, rand, 10).map(([x, y], i) => (
            <circle key={`d${i}`} cx={x} cy={y} r={r1(0.8 + rand() * 1)} fill={i % 2 ? "#8a5228" : "#24110a"} />
          ))}
        </g>
      );
  }
}
