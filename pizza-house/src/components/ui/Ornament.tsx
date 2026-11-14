import { cn } from "@/lib/cn";
import { SliceIcon } from "./icons";

/** Separador elegante: linha — fatia — linha (inspirado nas artes da Pizza House). */
export function Ornament({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const line = tone === "dark" ? "via-gold/55" : "via-wood/45";
  return (
    <div className={cn("flex items-center justify-center gap-4", tone === "dark" ? "text-gold" : "text-wood", className)} aria-hidden="true">
      <span className={cn("h-px w-20 bg-linear-to-r from-transparent to-transparent sm:w-28", line)} />
      <SliceIcon size={18} />
      <span className={cn("h-px w-20 bg-linear-to-r from-transparent to-transparent sm:w-28", line)} />
    </div>
  );
}
