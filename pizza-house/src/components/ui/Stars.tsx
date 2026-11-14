import { StarIcon } from "./icons";
import { cn } from "@/lib/cn";

/** Estrelas douradas com preenchimento proporcional à nota (ex.: 4,9 ⇒ 4 cheias + 90%). */
export function Stars({ rating, size = 18, className, idPrefix }: { rating: number; size?: number; className?: string; idPrefix: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-gold", className)} role="img" aria-label={`Nota ${rating.toLocaleString("pt-BR")} de 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon key={i} id={`${idPrefix}-${i}`} size={size} amount={Math.max(0, Math.min(1, rating - i))} />
      ))}
    </span>
  );
}
