"use client";

import { m } from "framer-motion";
import { CupSoda, Gift, Pizza, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { comboCasal } from "@/data/menu";
import { formatPrice } from "@/lib/format";
import { useParallax } from "@/lib/hooks";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

const icons: Record<(typeof comboCasal.items)[number]["icon"], LucideIcon> = { pizza: Pizza, soda: CupSoda, gift: Gift };

export function Combo() {
  const ref = useRef<HTMLDivElement>(null);
  const y = useParallax(ref, 40);
  const price = formatPrice(comboCasal.price);
  const [reais, cents] = price.replace("R$ ", "").split(",");

  return (
    <section id="combo" aria-labelledby="combo-titulo" className="bg-wood section-pad relative overflow-hidden">
      <div className="container-site">
        <Reveal y={50}>
          <div className="relative overflow-hidden rounded-[2rem] border border-gold/30 bg-ink/95 shadow-[0_60px_120px_-50px_rgb(0_0_0/0.9)] lg:rounded-[2.5rem]">
            {/* cantoneiras douradas */}
            {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((pos) => (
              <span key={pos} className={`pointer-events-none absolute z-10 size-8 border-gold/60 ${pos}`} aria-hidden="true" />
            ))}

            <div className="grid lg:grid-cols-2">
              <div ref={ref} className="relative min-h-[20rem] overflow-hidden sm:min-h-[26rem] lg:min-h-[36rem]">
                <m.div style={{ y }} className="absolute -inset-y-12 inset-x-0">
                  <Picture
                    image={comboCasal.image}
                    alt="Fatia de pizza sendo servida com queijo derretido"
                    sizes="(min-width: 1024px) 40rem, 100vw"
                    className="h-full w-full"
                  />
                </m.div>
                <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/20 to-transparent lg:bg-linear-to-r lg:from-transparent lg:via-transparent lg:to-ink/90" aria-hidden="true" />
                <div className="absolute left-6 top-6 rounded-full border border-gold/50 bg-ink/70 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-gold-light backdrop-blur sm:left-8 sm:top-8">
                  Combo especial
                </div>
              </div>

              <div className="relative flex flex-col justify-center px-6 pb-10 pt-4 sm:px-10 sm:pb-14 lg:px-14 lg:py-16">
                <Eyebrow>Para dois</Eyebrow>
                <h2 id="combo-titulo" className="mt-4 text-5xl leading-none text-cream sm:text-6xl lg:text-7xl">
                  {comboCasal.name.split(" ")[0]} <em className="text-gradient-gold">{comboCasal.name.split(" ").slice(1).join(" ")}</em>
                </h2>
                <p className="mt-4 max-w-md font-serif text-xl italic leading-snug text-cream/75 sm:text-2xl">{comboCasal.tagline}</p>

                <RevealGroup as="ul" className="mt-8 space-y-3" stagger={0.1}>
                  {comboCasal.items.map((item) => {
                    const Icon = icons[item.icon];
                    return (
                      <RevealItem as="li" key={item.label} className="flex items-center gap-4 rounded-2xl border border-cream/10 bg-cream/[0.03] px-4 py-3">
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                          <Icon size={19} strokeWidth={1.6} aria-hidden="true" />
                        </span>
                        <span className="text-[0.98rem] text-cream/90">{item.label}</span>
                      </RevealItem>
                    );
                  })}
                </RevealGroup>

                <div className="mt-9 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <p className="leading-none text-cream">
                    <span className="sr-only">Preço do combo: {price}</span>
                    <span className="block text-[0.68rem] font-bold uppercase tracking-[0.24em] text-gold/80" aria-hidden="true">
                      Tudo por
                    </span>
                    <span className="mt-2 flex items-start font-serif" aria-hidden="true">
                      <span className="mt-2 text-2xl text-gold-light">R$</span>
                      <span className="ml-1 text-7xl leading-[0.85] sm:text-8xl">{reais}</span>
                      <span className="mt-1 text-3xl text-gold-light">,{cents}</span>
                    </span>
                  </p>
                  <ButtonLink
                    href={whatsappLink(whatsappMessages.combo(comboCasal.name, comboCasal.items.map((i) => i.label), price))}
                    icon="whatsapp"
                    arrow
                    data-cta="combo-whatsapp"
                  >
                    Quero esse combo
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
