import manifest from "@/data/images.json";
// Vazio no site normal. Só é preenchido ao gerar o arquivo único (npm run arquivo-unico).
import inline from "@/data/inline-assets.json";

export type ImageKey = keyof typeof manifest;

export interface ImageData {
  width: number;
  height: number;
  src: string;
  avif: string;
  webp: string;
  blur: string;
}

const relative = process.env.NEXT_PUBLIC_RELATIVE_ASSETS === "1";
const inlineImages = inline.images as Record<string, string>;
const inlineFiles = inline.files as Record<string, string>;

/** Caminho de um arquivo da pasta public/ (relativo no pacote; embutido no arquivo único). */
export function asset(path: string) {
  if (inlineFiles[path]) return inlineFiles[path];
  return relative ? path.replace(/(^|, )\//g, "$1") : path;
}

export const images = manifest as Record<ImageKey, ImageData>;

export function getImage(key: ImageKey): ImageData {
  const img = images[key];
  if (inlineImages[key]) return { ...img, src: inlineImages[key], avif: "", webp: "" };
  return relative ? { ...img, src: asset(img.src), avif: asset(img.avif), webp: asset(img.webp) } : img;
}
