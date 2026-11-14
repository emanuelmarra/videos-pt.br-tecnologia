/**
 * Gera um pacote .zip do site pronto, com caminhos relativos.
 *
 * O mesmo pacote serve para:
 *  - abrir no computador com duplo clique em index.html (sem servidor)
 *  - enviar para qualquer hospedagem (public_html, Netlify Drop etc.)
 *
 * Uso: npm run pacote
 *  (faz o build com NEXT_PUBLIC_RELATIVE_ASSETS=1, gera o .zip e refaz o build normal)
 * Resultado: dist/pizza-house-site.zip
 */
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const DIST = path.join(ROOT, "dist");
const NAME = "pizza-house-site";
const STAGE = path.join(DIST, NAME);

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });
await cp(OUT, STAGE, { recursive: true });

// Fontes embutidas no CSS da página: o Chrome bloqueia fontes abertas direto do disco (file://)
const html = path.join(STAGE, "index.html");
let page = await readFile(html, "utf8");
const fontFiles = [...new Set(page.match(/_next\/static\/media\/[^)"'\s]+\.woff2/g) ?? [])];
for (const file of fontFiles) {
  const data = await readFile(path.join(STAGE, file));
  const uri = `data:font/woff2;base64,${data.toString("base64")}`;
  page = page.replace(/<style[\s\S]*?<\/style>/g, (block) =>
    block.replace(new RegExp(`url\\((?:\\.?/)?${file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\)`, "g"), `url(${uri})`),
  );
}
await writeFile(html, page);

await writeFile(
  path.join(STAGE, "LEIA-ME.txt"),
  [
    "PIZZA HOUSE — SITE PRONTO",
    "",
    "Visualizar no computador: dê dois cliques em index.html.",
    "",
    "Publicar na internet: envie TODO o conteúdo desta pasta para a pasta pública",
    "da hospedagem (ex.: public_html) ou arraste a pasta em app.netlify.com/drop.",
    "",
    "Para gerar uma versão com o domínio definitivo (SEO completo, sitemap e imagem",
    "de compartilhamento), rode no código-fonte:",
    "  NEXT_PUBLIC_SITE_URL=https://www.seudominio.com.br npm run pacote",
    "",
  ].join("\n"),
);

execFileSync("zip", ["-qr", `${NAME}.zip`, NAME], { cwd: DIST });
console.log(`✓ dist/${NAME}.zip (${fontFiles.length} fontes embutidas)`);
