import { getImage, type ImageKey } from "@/lib/images";
import { cn } from "@/lib/cn";

interface PictureProps {
  image: ImageKey;
  alt: string;
  /** Atributo `sizes` responsivo — ajuda o navegador a baixar só o necessário. */
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Placeholder borrado enquanto a foto carrega. */
  placeholder?: boolean;
}

/** Foto otimizada com AVIF/WebP, srcset 1x/2x, lazy loading e placeholder borrado. */
export function Picture({ image, alt, sizes, className, imgClassName, priority, placeholder = true }: PictureProps) {
  const img = getImage(image);
  return (
    <picture className={cn("block", className)}>
      <source type="image/avif" srcSet={img.avif} sizes={sizes} />
      <source type="image/webp" srcSet={img.webp} sizes={sizes} />
      <img
        src={img.src}
        alt={alt}
        width={img.width}
        height={img.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        draggable={false}
        className={cn("h-full w-full object-cover", imgClassName)}
        style={placeholder ? { backgroundImage: `url(${img.blur})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      />
    </picture>
  );
}
