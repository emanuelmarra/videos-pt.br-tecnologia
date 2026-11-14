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

export const images = manifest as Record<ImageKey, ImageData>;

export function getImage(key: ImageKey): ImageData {
  return images[key];
}
