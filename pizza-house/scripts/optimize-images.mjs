/**
 * Otimiza as fotos de assets/photos/ para a web e gera os ícones da marca.
 *
 *  - AVIF + WebP em 1x e 2x (o 2x é ampliado com Lanczos3 + nitidez leve,
 *    para telas retina, preservando a aparência original da foto)
 *  - placeholder borrado (LQIP) embutido em base64 para o efeito "blur-up"
 *  - src/data/images.json  -> manifesto com dimensões e srcsets
 *  - public/og-image.jpg   -> imagem de compartilhamento (WhatsApp, Instagram, Facebook)
 *  - ícones: apple-icon, PWA (192/512/maskable) e favicon.ico
 *
 * Uso: npm run images
 * Para trocar uma foto, substitua o PNG/JPG em assets/photos/ (mesmo nome) e rode de novo.
 */
import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "assets", "photos");
const OUT = path.join(ROOT, "public", "images");
const MANIFEST = path.join(ROOT, "src", "data", "images.json");

/** Fotos usadas e em quais escalas. Miniaturas do cardápio já têm resolução sobrando (1x). */
const PHOTOS = {
  "hero-pizza": { scales: [1, 2], quality: "high" },
  "mesa-pizzas": { scales: [1, 2] },
  "queijo-derretido": { scales: [1, 2] },
  "nutella": { scales: [1, 2] },
  "salao": { scales: [1, 2] },
  "fachada": { scales: [1, 2] },
  "pizza-catupiry": { scales: [1, 2] },
  "fatia-presunto": { scales: [1, 2] },
  "doces-trio": { scales: [1, 2] },
  "pizza-entrega": { scales: [1, 2] },
  "pedido-telefone": { scales: [1, 2] },
  "marguerita": { scales: [1] },
  "nutella-thumb": { scales: [1] },
  "portuguesa": { scales: [1] },
  "carne-seca": { scales: [1] },
  "frango-catupiry": { scales: [1] },
  "brigadeiro": { scales: [1] },
  "mesclada": { scales: [1] },
  "oreo": { scales: [1] },
};

async function findSource(name) {
  const files = await readdir(SRC);
  const file = files.find((f) => f.replace(/\.(png|jpe?g|webp)$/i, "") === name);
  if (!file) throw new Error(`Foto não encontrada: assets/photos/${name}.(png|jpg)`);
  return path.join(SRC, file);
}

async function processPhoto(name, { scales, quality }) {
  const src = await findSource(name);
  const meta = await sharp(src).metadata();
  const w = meta.width;
  const h = meta.height;
  const avif = [];
  const webp = [];

  for (const s of scales) {
    const width = Math.round(w * s);
    const height = Math.round(h * s);
    let pipeline = sharp(src).resize(width, height, { kernel: "lanczos3" });
    if (s > 1) pipeline = pipeline.sharpen({ sigma: 0.55, m1: 0.6, m2: 1.2 });
    const base = `${name}-${width}`;
    await pipeline
      .clone()
      .avif({ quality: quality === "high" ? 62 : 56, effort: 6 })
      .toFile(path.join(OUT, `${base}.avif`));
    await pipeline
      .clone()
      .webp({ quality: quality === "high" ? 84 : 80, effort: 6 })
      .toFile(path.join(OUT, `${base}.webp`));
    avif.push(`/images/${base}.avif ${width}w`);
    webp.push(`/images/${base}.webp ${width}w`);
  }

  const blurBuf = await sharp(src).resize(16).blur(0.6).webp({ quality: 40 }).toBuffer();

  return {
    width: w,
    height: h,
    src: `/images/${name}-${w}.webp`,
    avif: avif.join(", "),
    webp: webp.join(", "),
    blur: `data:image/webp;base64,${blurBuf.toString("base64")}`,
  };
}

/** Favicon .ico com PNGs embutidos (16/32/48). */
async function writeIco(svg, file) {
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map((s) => sharp(svg, { density: 384 }).resize(s, s).png().toBuffer()),
  );
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);
  const dir = Buffer.alloc(16 * sizes.length);
  let offset = 6 + dir.length;
  sizes.forEach((s, i) => {
    const o = i * 16;
    dir.writeUInt8(s, o);
    dir.writeUInt8(s, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(pngs[i].length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += pngs[i].length;
  });
  await writeFile(file, Buffer.concat([header, dir, ...pngs]));
}

async function brandAssets() {
  // Imagem de compartilhamento 1200x630 a partir da peça de marca (logo + pizza)
  const brand = await findSource("brand-full");
  await sharp(brand)
    .resize(1200, null, { kernel: "lanczos3" })
    .extract({ left: 0, top: 129, width: 1200, height: 630 })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(ROOT, "public", "og-image.jpg"));

  const icon = await readFile(path.join(ROOT, "src", "app", "icon.svg"));
  await sharp(icon, { density: 600 }).resize(180, 180).png().toFile(path.join(ROOT, "src", "app", "apple-icon.png"));
  await sharp(icon, { density: 600 }).resize(192, 192).png().toFile(path.join(ROOT, "public", "brand", "icon-192.png"));
  await sharp(icon, { density: 600 }).resize(512, 512).png().toFile(path.join(ROOT, "public", "brand", "icon-512.png"));
  // versão "maskable" (Android): ícone com margem de segurança sobre fundo cheio
  const inner = await sharp(icon, { density: 600 }).resize(400, 400).png().toBuffer();
  await sharp({ create: { width: 512, height: 512, channels: 4, background: "#171412" } })
    .composite([{ input: inner, left: 56, top: 56 }])
    .png()
    .toFile(path.join(ROOT, "public", "brand", "icon-maskable-512.png"));
  await writeIco(icon, path.join(ROOT, "src", "app", "favicon.ico"));
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await mkdir(path.dirname(MANIFEST), { recursive: true });

const manifest = {};
for (const [name, opts] of Object.entries(PHOTOS)) {
  manifest[name] = await processPhoto(name, opts);
  console.log(`✓ ${name}`);
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
await brandAssets();
console.log("✓ og-image, ícones e favicon");
