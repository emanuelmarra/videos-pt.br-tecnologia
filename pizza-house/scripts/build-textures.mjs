/**
 * Gera as texturas da pizza 3D (public/images/texturas/*.webp) a partir de
 * src/components/three/texture-art.ts, desenhando-as num navegador headless.
 * Uso: npm run textures   (requer Playwright com Chromium instalado)
 */
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "images", "texturas");

const bundle = await build({
  stdin: {
    contents: `import * as art from "./src/components/three/texture-art.ts";
      window.__art = Object.fromEntries(Object.entries(art).map(([k, fn]) => [k, () => fn().toDataURL("image/png")]));`,
    resolveDir: ROOT,
    loader: "ts",
  },
  bundle: true,
  format: "iife",
  write: false,
});

const { chromium } = require("playwright");
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent("<!doctype html><html><body></body></html>");
await page.addScriptTag({ content: bundle.outputFiles[0].text });
await mkdir(OUT, { recursive: true });

const files = { cheeseArt: "queijo", crustArt: "borda", doughArt: "massa", woodArt: "tabua", shadowArt: "sombra" };
for (const [fn, name] of Object.entries(files)) {
  const dataUrl = await page.evaluate((f) => window.__art[f](), fn);
  const png = Buffer.from(dataUrl.split(",")[1], "base64");
  const out = path.join(OUT, `${name}.webp`);
  await sharp(png).webp(name === "sombra" ? { lossless: true } : { quality: 86 }).toFile(out);
  const meta = await sharp(out).metadata();
  console.log(`✓ ${name}.webp ${meta.width}x${meta.height}`);
}
await browser.close();
