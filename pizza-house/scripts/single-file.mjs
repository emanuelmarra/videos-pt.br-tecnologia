/**
 * Gera o site inteiro em UM único arquivo HTML (dist/pizza-house.html):
 * fotos, ilustrações, texturas 3D, fontes, estilos e JavaScript embutidos.
 * Abre com duplo clique, no navegador do celular ou dentro de apps de chat — sem servidor e sem .zip.
 *
 * Uso: npm run arquivo-unico
 */
import { execSync } from "node:child_process";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const PUBLIC = path.join(ROOT, "public");
const INLINE = path.join(ROOT, "src", "data", "inline-assets.json");
const TARGET = path.join(ROOT, "dist", "pizza-house.html");
const STUB = JSON.stringify({ images: {}, files: {} }, null, 2) + "\n";

const mime = { ".webp": "image/webp", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const dataUri = async (file) => `data:${mime[path.extname(file)]};base64,${(await readFile(file)).toString("base64")}`;

// 1) mapa de arquivos embutidos (fotos em WebP 1x, ilustrações e texturas)
const manifest = JSON.parse(await readFile(path.join(ROOT, "src", "data", "images.json"), "utf8"));
const inline = { images: {}, files: {} };
for (const [key, img] of Object.entries(manifest)) inline.images[key] = await dataUri(path.join(PUBLIC, img.src));
for (const dir of ["images/ilustracoes", "images/texturas"]) {
  for (const f of await readdir(path.join(PUBLIC, dir))) inline.files[`/${dir}/${f}`] = await dataUri(path.join(PUBLIC, dir, f));
}

// 2) build com os arquivos embutidos (o mapa volta a ficar vazio no final)
await writeFile(INLINE, JSON.stringify(inline));
try {
  // Webpack: o carregador identifica as partes pelo conteúdo (não pelo endereço), o que permite embuti-las
  execSync("npx next build --webpack", { cwd: ROOT, stdio: "inherit", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } });
} finally {
  await writeFile(INLINE, STUB);
}

let html = await readFile(path.join(OUT, "index.html"), "utf8");
const escape = (code) => code.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");

// 3) fontes embutidas no CSS
for (const font of new Set(html.match(/\/_next\/static\/media\/[^)"'\s]+\.woff2/g) ?? [])) {
  const uri = await dataUri(path.join(OUT, font));
  html = html.replace(/<style[\s\S]*?<\/style>/g, (block) => block.split(`url(${font})`).join(`url(${uri})`));
}

// 3b) dicas de pré-carregamento de fontes no payload do React (as fontes já estão embutidas)
html = html.replace(/:HL\[\\"\/_next\/static\/media\/[^"\\]+\.woff2\\",\\"font\\",\{[^}]*\}\]\\n/g, "");

// 4) remove pré-carregamentos e o manifest; ícones viram data URI
html = html.replace(/<link[^>]+rel="(?:preload|modulepreload|manifest)"[^>]*>/g, "");
for (const icon of ["favicon.ico", "icon.svg", "apple-icon.png"]) {
  const file = path.join(OUT, icon);
  const uri = await dataUri(file);
  html = html.replace(new RegExp(`href="/${icon.replace(".", "\\.")}[^"]*"`, "g"), () => `href="${uri}"`);
}

// 5) scripts: os iniciais vão para o fim do <body>, na mesma ordem; todos os demais
//    ficam guardados e são entregues ao carregador do Next quando ele os pedir
const initial = [];
html = html.replace(/<script\b([^>]*)\ssrc="([^"]+)"([^>]*)><\/script>/g, (_, pre, src, post) => {
  if (!/\snomodule/.test(pre + post)) initial.push(src); // polyfills de navegadores antigos ficam de fora
  return "";
});
const staticDir = path.join(OUT, "_next", "static");
const allChunks = (await readdir(staticDir, { recursive: true })).filter((f) => f.endsWith(".js") && !/polyfills/.test(f));
const store = [];
for (const f of allChunks) {
  const key = `static/${f.split(path.sep).join("/")}`;
  store.push(`<script type="text/x-chunk" data-src="${key}">${escape(await readFile(path.join(staticDir, f), "utf8"))}</script>`);
}
const initialKeys = initial.map((src) => src.replace(/^.*\/_next\//, "").split("?")[0]);

// O CSS já está embutido na página: pedidos de folhas de estilo do Next são dados como carregados.
// Executa um script guardado como se tivesse sido baixado de /_next/<key>: o carregador do Next
// identifica cada parte pelo endereço (document.currentScript.src), então ele é simulado.
const shim = `<script>(function(){
var A=Node.prototype.appendChild;
function run(key,url){var h=document.querySelector('script[type="text/x-chunk"][data-src="'+key+'"]');if(!h)return false;
var fake=document.createElement("script");fake.setAttribute("src",url);
Object.defineProperty(document,"currentScript",{configurable:true,get:function(){return fake}});
try{var s=document.createElement("script");s.textContent=h.textContent;A.call(document.head,s)}finally{delete document.currentScript}return true}
window.__phRun=function(keys){keys.forEach(function(k){run(k,new URL("/_next/"+k,document.baseURI).href)})};
Node.prototype.appendChild=function(el){
if(el&&el.tagName==="SCRIPT"&&el.src&&el.src.indexOf("/_next/static/")>-1){var k="static/"+el.src.split("/_next/static/")[1].split("?")[0];if(run(k,el.src)){setTimeout(function(){if(el.onload)el.onload(new Event("load"))},0);return el}}
if(el&&el.tagName==="LINK"&&el.rel==="stylesheet"&&el.href&&el.href.indexOf("/_next/static/")>-1){setTimeout(function(){if(el.onload)el.onload(new Event("load"))},0);return el}
return A.call(this,el)};
})();</script>`;

// replacer em função: o código contém "$&", "$'"... que seriam interpretados numa string de substituição
html = html.replace(/<head>/, () => `<head>${shim}`);
html = html.replace(/<\/body>/, () => `${store.join("")}<script>__phRun(${JSON.stringify(initialKeys)})</script></body>`);

const leftovers = html.match(/(?:src|href)="\/(?:_next|images|brand)\/[^"]*"/g) ?? [];
await mkdir(path.dirname(TARGET), { recursive: true });
await writeFile(TARGET, html);
console.log(`✓ dist/pizza-house.html  ${(html.length / 1024 / 1024).toFixed(1)} MB  (${initial.length} scripts iniciais de ${store.length}, ${leftovers.length} referências externas restantes)`);
if (leftovers.length) console.log("  ", leftovers.slice(0, 5));

// 6) refaz o build normal para a pasta out/ voltar ao estado de publicação
execSync("npx next build", { cwd: ROOT, stdio: "ignore", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" } });
