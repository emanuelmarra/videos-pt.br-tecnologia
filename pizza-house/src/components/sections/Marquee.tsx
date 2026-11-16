import { SliceIcon } from "@/components/ui/icons";

const words = ["Pizza artesanal", "Massa leve", "Recheios generosos", "Divinópolis — MG", "Desde 2020", "Salão · Retirada · Delivery"];

/** Faixa de texto em movimento contínuo (decorativa). */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {words.map((w, i) => (
        <li key={w} className="flex items-center gap-10">
          <span className={i % 2 ? "text-outline-gold" : "text-cream"}>{w}</span>
          <SliceIcon size={26} className="text-gold" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Destaques da Pizza House" className="relative z-10 overflow-hidden border-y border-gold/15 bg-ink py-7 sm:py-9">
      <div className="flex w-max animate-marquee font-serif text-4xl italic leading-none sm:text-6xl">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
