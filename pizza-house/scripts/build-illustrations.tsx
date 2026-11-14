/**
 * Gera os arquivos SVG das ilustrações de pizza (sabores ainda sem foto)
 * a partir de src/components/ui/PizzaIllustration.tsx.
 * Uso: npm run illustrations
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PizzaIllustration } from "../src/components/ui/PizzaIllustration";
import type { IllustrationKind } from "../src/data/menu";

const kinds: IllustrationKind[] = ["calabresa", "quatro-queijos", "cinco-queijos", "costela", "pepperoni", "kitkat"];
const out = path.resolve(__dirname, "..", "public", "images", "ilustracoes");
mkdirSync(out, { recursive: true });

for (const kind of kinds) {
  const svg = renderToStaticMarkup(createElement(PizzaIllustration, { kind }))
    .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
    .replace(/ aria-hidden="true"| focusable="false"/g, "");
  writeFileSync(path.join(out, `${kind}.svg`), svg);
  console.log(`✓ ${kind}.svg  ${(svg.length / 1024).toFixed(1)} KB`);
}
