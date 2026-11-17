/**
 * Arte das texturas da pizza 3D, desenhada em <canvas>.
 * NÃO roda no site: `npm run textures` executa estas funções uma vez e salva
 * os resultados em public/images/texturas/*.webp (o site só baixa as imagens,
 * sem gastar processamento do aparelho para desenhá-las).
 */
/** Gerador pseudoaleatório determinístico (as texturas saem sempre iguais). */
function random(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function canvas(w: number, h = w) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function blob(g: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, rot: number) {
  g.beginPath();
  g.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  g.fill();
}

/**
 * Molho + queijo gratinado, vista de cima. A textura cobre o quadrado [-R, R]
 * do plano da pizza; o queijo ocupa até `cheeseRatio` do raio.
 */
export function cheeseArt(size = 1024, cheeseRatio = 0.88) {
  const [c, g] = canvas(size);
  const rand = random(17);
  const cx = size / 2;
  const rMax = (size / 2) * cheeseRatio;

  // molho de tomate
  g.fillStyle = "#a3341d";
  g.fillRect(0, 0, size, size);
  for (let i = 0; i < 260; i++) {
    g.fillStyle = `rgba(${140 + rand() * 50}, ${35 + rand() * 25}, ${18 + rand() * 10}, 0.35)`;
    blob(g, rand() * size, rand() * size, 6 + rand() * 30, 6 + rand() * 30, rand() * 3);
  }

  // camada de queijo com borda irregular
  g.save();
  g.beginPath();
  const pts = 160;
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const r = rMax * (0.9 + 0.035 * Math.sin(a * 7 + 1.3) + 0.025 * Math.sin(a * 17) + rand() * 0.03);
    const x = cx + Math.cos(a) * r;
    const y = cx + Math.sin(a) * r;
    if (i === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  }
  g.closePath();
  const grad = g.createRadialGradient(cx * 0.9, cx * 0.85, 10, cx, cx, rMax);
  grad.addColorStop(0, "#f1cf7f");
  grad.addColorStop(0.7, "#e8b862");
  grad.addColorStop(1, "#d79a45");
  g.fillStyle = grad;
  g.fill();
  g.clip();

  // queijo derretendo (brilhos), bolhas tostadas e manchas de forno
  for (let i = 0; i < 300; i++) {
    g.fillStyle = `rgba(255, ${232 + rand() * 14}, ${170 + rand() * 30}, ${0.18 + rand() * 0.25})`;
    blob(g, rand() * size, rand() * size, 5 + rand() * 22, 4 + rand() * 14, rand() * 3);
  }
  for (let i = 0; i < 300; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 5 + rand() * 24;
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, "rgba(128, 64, 20, 0.85)");
    rg.addColorStop(0.5, "rgba(182, 112, 42, 0.55)");
    rg.addColorStop(1, "rgba(220, 160, 80, 0)");
    g.fillStyle = rg;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  for (let i = 0; i < 70; i++) {
    g.fillStyle = `rgba(85, 42, 14, ${0.35 + rand() * 0.4})`;
    blob(g, rand() * size, rand() * size, 1.5 + rand() * 4, 1 + rand() * 3, rand() * 3);
  }
  // muçarela fresca (manchas brancas e cremosas)
  for (let i = 0; i < 14; i++) {
    const x = cx + (rand() - 0.5) * rMax * 1.6;
    const y = cx + (rand() - 0.5) * rMax * 1.6;
    const r = 16 + rand() * 22;
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, "rgba(255, 246, 225, 0.8)");
    rg.addColorStop(0.7, "rgba(248, 230, 190, 0.55)");
    rg.addColorStop(1, "rgba(245, 215, 150, 0)");
    g.fillStyle = rg;
    blob(g, x, y, r, r * (0.6 + rand() * 0.4), rand() * 3);
  }
  // orégano
  for (let i = 0; i < 520; i++) {
    g.fillStyle = `rgba(${55 + rand() * 30}, ${70 + rand() * 30}, ${30 + rand() * 15}, ${0.5 + rand() * 0.4})`;
    g.fillRect(rand() * size, rand() * size, 1 + rand() * 2.2, 1 + rand() * 1.6);
  }
  g.restore();
  return c;
}

/** Sombra suave (gradiente radial) para o chão sob a tábua — bem mais leve que sombras em tempo real. */
export function shadowArt() {
  const [c, g] = canvas(256);
  const rg = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  rg.addColorStop(0, "rgba(0,0,0,0.75)");
  rg.addColorStop(0.55, "rgba(0,0,0,0.45)");
  rg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = rg;
  g.fillRect(0, 0, 256, 256);
  return c;
}

/** Borda da massa (UV do toro): topo mais tostado, parte de baixo mais clara. */
export function crustArt() {
  const [c, g] = canvas(1024, 256);
  const rand = random(29);
  for (let y = 0; y < 256; y++) {
    const v = 1 - y / 256; // UV v (de baixo para cima)
    const top = Math.max(0, Math.sin(v * Math.PI * 2)) ** 1.4;
    const r = Math.round(226 - 78 * top);
    const gg = Math.round(176 - 86 * top);
    const b = Math.round(104 - 66 * top);
    g.fillStyle = `rgb(${r}, ${gg}, ${b})`;
    g.fillRect(0, y, 1024, 1);
  }
  // pontos queimadinhos do forno (concentrados no topo)
  for (let i = 0; i < 900; i++) {
    const x = rand() * 1024;
    const y = 256 * (1 - (0.25 + (rand() - 0.5) * 0.4));
    const r = 2 + rand() * 9;
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, `rgba(70, 34, 12, ${0.45 + rand() * 0.4})`);
    rg.addColorStop(1, "rgba(120, 60, 20, 0)");
    g.fillStyle = rg;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  // farinha
  for (let i = 0; i < 700; i++) {
    g.fillStyle = `rgba(255, 245, 225, ${0.15 + rand() * 0.3})`;
    g.fillRect(rand() * 1024, rand() * 256, 1.5, 1.5);
  }
  return c;
}

/** Massa (base e laterais). */
export function doughArt() {
  const [c, g] = canvas(512);
  const rand = random(41);
  g.fillStyle = "#dcae6c";
  g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 900; i++) {
    g.fillStyle = rand() > 0.5 ? `rgba(255, 240, 210, ${rand() * 0.35})` : `rgba(150, 95, 40, ${rand() * 0.25})`;
    blob(g, rand() * 512, rand() * 512, 1 + rand() * 4, 1 + rand() * 3, rand() * 3);
  }
  return c;
}

/** Tábua de madeira redonda (veios lineares, como nas fotos da casa). */
export function woodArt() {
  const [c, g] = canvas(1024);
  const rand = random(53);
  g.fillStyle = "#7a4a28";
  g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 260; i++) {
    const y = rand() * 1024;
    const amp = 4 + rand() * 18;
    const freq = 0.002 + rand() * 0.006;
    const ph = rand() * 10;
    g.strokeStyle = rand() > 0.45 ? `rgba(60, 32, 14, ${0.08 + rand() * 0.22})` : `rgba(176, 118, 70, ${0.06 + rand() * 0.16})`;
    g.lineWidth = 0.6 + rand() * 3.2;
    g.beginPath();
    for (let x = 0; x <= 1024; x += 16) {
      const yy = y + Math.sin(x * freq + ph) * amp + Math.sin(x * freq * 3.1 + ph) * amp * 0.25;
      if (x === 0) g.moveTo(x, yy);
      else g.lineTo(x, yy);
    }
    g.stroke();
  }
  // nós da madeira
  for (let i = 0; i < 3; i++) {
    const x = rand() * 1024;
    const y = rand() * 1024;
    for (let k = 0; k < 6; k++) {
      g.strokeStyle = `rgba(55, 28, 12, ${0.18 - k * 0.02})`;
      g.lineWidth = 2;
      g.beginPath();
      g.ellipse(x, y, 10 + k * 9, 5 + k * 5, 0, 0, Math.PI * 2);
      g.stroke();
    }
  }
  return c;
}
