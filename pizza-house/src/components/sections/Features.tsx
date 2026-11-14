import { Bike, Heart, Pizza, ShoppingBag, Store, Wheat, type LucideIcon } from "lucide-react";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TiltCard } from "@/components/ui/TiltCard";

const features: { icon: LucideIcon; title: string; text: string; extra?: { icon: LucideIcon; label: string }[] }[] = [
  { icon: Wheat, title: "Massa artesanal", text: "Leveza e sabor em cada pedaço." },
  { icon: Pizza, title: "Recheios generosos", text: "Ingredientes que fazem a diferença." },
  { icon: Heart, title: "Momentos especiais", text: "Perfeita para compartilhar com quem você gosta." },
  {
    icon: Store,
    title: "Atendimento completo",
    text: "Salão, retirada e delivery.",
    extra: [
      { icon: Store, label: "Salão" },
      { icon: ShoppingBag, label: "Retirada" },
      { icon: Bike, label: "Delivery" },
    ],
  },
];

export function Features() {
  return (
    <section aria-labelledby="diferenciais-titulo" className="bg-wood section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" aria-hidden="true" />
      <div className="container-site">
        <SectionHeading
          id="diferenciais-titulo"
          eyebrow="Por que a Pizza House"
          title={
            <>
              Os detalhes que <em className="text-gradient-gold">fazem a diferença.</em>
            </>
          }
          align="center"
        />

        <RevealGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4" stagger={0.12}>
          {features.map((f, i) => (
            <RevealItem key={f.title} className="[perspective:1000px]">
              <TiltCard className="rounded-[1.75rem]">
                <article className="relative grid h-full grid-cols-[auto_1fr] gap-x-5 overflow-hidden rounded-[1.75rem] border border-gold/15 bg-linear-to-b from-cream/[0.07] to-cream/[0.015] p-6 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.7)] transition-colors duration-500 group-hover:border-gold/45 sm:flex sm:flex-col sm:p-8">
                  <span className="absolute right-5 top-4 font-serif text-4xl italic text-gold/25 sm:right-6 sm:top-5 sm:text-5xl transition-colors duration-500 group-hover:text-gold/40" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span className="relative row-span-3 grid size-14 place-items-center rounded-2xl sm:size-16 border border-gold/30 bg-ink/50 text-gold shadow-inner transition-all duration-700 ease-[var(--ease-premium)] group-hover:-rotate-6 group-hover:scale-110 group-hover:border-gold/70 group-hover:bg-gold group-hover:text-ink [transform:translateZ(30px)]">
                    <f.icon size={26} strokeWidth={1.4} aria-hidden="true" />
                  </span>
                  <h3 className="pr-10 text-[1.75rem] leading-tight text-cream sm:mt-8 sm:pr-0 sm:text-[1.9rem]">{f.title}</h3>
                  <p className="mt-2 leading-relaxed text-cream/70 sm:mt-3">{f.text}</p>
                  {f.extra && (
                    <ul className="mt-4 flex flex-wrap gap-2 sm:mt-5" aria-label="Formas de atendimento">
                      {f.extra.map((e) => (
                        <li key={e.label} className="inline-flex items-center gap-1.5 rounded-full border border-cream/15 px-3 py-1 text-xs font-medium text-cream/80">
                          <e.icon size={13} className="text-gold" aria-hidden="true" />
                          {e.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="mt-auto hidden pt-8 sm:block" aria-hidden="true">
                    <span className="block h-px w-12 bg-gold/50 transition-all duration-700 ease-[var(--ease-premium)] group-hover:w-full" />
                  </span>
                </article>
              </TiltCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
