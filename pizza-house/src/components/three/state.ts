/**
 * Estado compartilhado entre a rolagem da página (DOM) e a cena 3D.
 * Valores mutáveis lidos a cada quadro — sem re-render do React.
 */
export const experience = {
  /** 0 → 1 enquanto o hero sai da tela */
  enter: 0,
  /** 0 → 1 ao longo da seção "experiência" (fixa na tela) */
  story: 0,
  /** ponteiro normalizado (-1 a 1) */
  pointerX: 0,
  pointerY: 0,
  reduceMotion: false,
  /** rolagem atual (px) e altura da janela — usados no layout empilhado (celular/tablet) */
  scrollPx: 0,
  vh: 1,
  /** até quando (performance.now) a cena continua desenhando após rolagem/mouse */
  until: 0,
};

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Progresso suave (0 → 1) de `v` entre `a` e `b`. */
export function range(v: number, a: number, b: number) {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
}
