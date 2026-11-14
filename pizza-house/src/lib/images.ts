import manifest from "@/data/images.json";

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

/** Caminho de um arquivo da pasta public/ (relativo no pacote `npm run pacote`). */
export function asset(path: string) {
  return relative ? path.replace(/(^|, )\//g, "$1") : path;
}

const toRelative = (img: ImageData): ImageData =>
  relative ? { ...img, src: asset(img.src), avif: asset(img.avif), webp: asset(img.webp) } : img;

export const images = manifest as Record<ImageKey, ImageData>;

export function getImage(key: ImageKey): ImageData {
  return toRelative(images[key]);
}
