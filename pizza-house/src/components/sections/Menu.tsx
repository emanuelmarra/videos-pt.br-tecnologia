"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowDown, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Picture } from "@/components/ui/Picture";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { SliceDiagram } from "@/components/ui/SliceDiagram";
import { ButtonLink } from "@/components/ui/Button";
import { categories, flavors, menuNotes, sizes, type Category, type Flavor } from "@/data/menu";
import { formatPrice } from "@/lib/format";
import { external, whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

type Filter = Category | "todas";
const ease = [0.22, 1, 0.36, 1] as const;

const groupTitles: Record<Category, string> = { salgadas: "Pizzas salgadas", doces: "Pizzas doces" };

export function Menu() {
  const [filter, setFilter] = useState<Filter>("todas");

  const groups = useMemo(() => {
    const cats: Category[] = filter === "todas" ? ["salgadas", "doces"] : [filter];
    return cats.map((c) => ({ category: c, items: flavors.filter((f) => f.category === c) }));
  }, [filter]);

  const count = (c: Filter) => (c === "todas" ? flavors.length : flavors.filter((f) => f.category === c).length);

  return (
    <section id="cardapio" aria-labelledby="cardapio-titulo" className="section-pad relative bg-ink">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_85%_10%,rgb(193_139_74/0.08),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="container-site relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Coluna de apresentação (fixa ao rolar em telas grandes) */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                id="cardapio-titulo"
                eyebrow="Cardápio"
                title={
                  <>
                    Sabores que <em className="text-gradient-gold">pedem bis.</em>
                  </>
                }
                intro="Pizzas salgadas e doces com massa leve e recheios generosos. Escolha o seu sabor e finalize o pedido direto pelo WhatsApp."
              />

              <Reveal delay={0.2} className="mt-10 hidden lg:block">
                <div className="relative overflow-hidden rounded-[1.75rem] border border-gold/15 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)]">
                  <div className="relative aspect-[4/5]">
                    <AnimatePresence initial={false}>
                      <m.div
                        key={filter === "doces" ? "doces" : "salgadas"}
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.9, ease }}
                      >
                        <Picture
                          image={filter === "doces" ? "doces-trio" : "fatia-presunto"}
                          alt={filter === "doces" ? "Pizzas doces da Pizza House" : "Fatia de pizza salgada com queijo derretido"}
                          sizes="(min-width: 1024px) 26rem, 0px"
                        />
                      </m.div>
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" aria-hidden="true" />
                    <p className="absolute bottom-5 left-6 right-6 font-serif text-2xl italic leading-tight text-cream">
                      {filter === "doces" ? "Para fechar a noite com chave de ouro." : "Recheio generoso de ponta a ponta."}
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Filtros + sabores */}
          <div className="lg:col-span-8">
            <div className="sticky top-[63px] z-20 -mx-5 mb-8 border-b border-cream/5 bg-ink/90 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:mb-10 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
              <div role="group" aria-label="Filtrar sabores do cardápio" className="flex gap-2 overflow-x-auto scrollbar-none">
                {categories.map((c) => {
                  const active = filter === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(c.id)}
                      className={cn(
                        "relative inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300",
                        active ? "text-ink" : "text-cream/70 hover:text-cream",
                      )}
                    >
                      {active && (
                        <m.span
                          layoutId="menu-filter"
                          className="absolute inset-0 -z-0 rounded-full bg-gold"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      {!active && <span className="absolute inset-0 rounded-full border border-cream/15" aria-hidden="true" />}
                      <span className="relative">{c.label}</span>
                      <span className={cn("relative text-xs tabular-nums", active ? "text-ink/80" : "text-cream/55")}>{count(c.id)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={filter}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease }}
                aria-live="polite"
              >
                {groups.map((g) => (
                  <div key={g.category} className="mb-12 last:mb-0">
                    <div className="mb-5 flex items-center gap-4">
                      <h3 className="font-serif text-3xl text-cream">{groupTitles[g.category]}</h3>
                      <span className="h-px flex-1 bg-linear-to-r from-gold/40 to-transparent" aria-hidden="true" />
                    </div>
                    <RevealGroup className="grid gap-4 sm:grid-cols-2" stagger={0.06} amount={0.05}>
                      {g.items.map((f) => (
                        <RevealItem key={f.id} as="article">
                          <FlavorCard flavor={f} />
                        </RevealItem>
                      ))}
                    </RevealGroup>
                  </div>
                ))}
              </m.div>
            </AnimatePresence>

            <p className="mt-8 flex items-start gap-2 text-xs leading-relaxed text-cream/60">
              <Info size={14} className="mt-0.5 shrink-0 text-gold/70" aria-hidden="true" />
              {menuNotes}
            </p>
          </div>
        </div>

        <Sizes />
      </div>
    </section>
  );
}

function FlavorCard({ flavor }: { flavor: Flavor }) {
  const sweet = flavor.category === "doces";
  return (
    <div className="group relative flex h-full gap-4 rounded-2xl border border-cream/10 bg-cream/[0.03] p-3 pr-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-gold/40 hover:bg-cream/[0.055] hover:shadow-[0_24px_50px_-30px_rgb(193_139_74/0.45)] sm:gap-5">
      <div className="relative size-[6.5rem] shrink-0 overflow-hidden rounded-xl bg-[radial-gradient(circle_at_35%_30%,#3d2617,#1b120c)] sm:size-[7.5rem]">
        {flavor.image ? (
          <Picture
            image={flavor.image}
            alt={`Pizza de ${flavor.name}`}
            sizes="120px"
            className="h-full w-full"
            imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-premium)] group-hover:scale-110"
          />
        ) : flavor.illustration ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/images/ilustracoes/${flavor.illustration}.svg`}
            alt={`Ilustração de pizza de ${flavor.name}`}
            width={200}
            height={200}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="h-full w-full scale-[1.08] transition-transform duration-[1.4s] ease-[var(--ease-premium)] group-hover:rotate-[24deg] group-hover:scale-[1.16]"
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col py-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-serif text-[1.55rem] leading-[1.1] text-cream">{flavor.name}</h4>
          {flavor.tag && (
            <span className="mt-1 shrink-0 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-gold-light">
              {flavor.tag}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-[0.88rem] leading-relaxed text-cream/60">{flavor.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          {typeof flavor.price === "number" ? (
            <span className="font-serif text-xl text-gold-light">{formatPrice(flavor.price)}</span>
          ) : (
            <a href="#tamanhos" className="text-xs font-medium text-cream/65 underline decoration-cream/20 underline-offset-4 transition-colors hover:text-cream hover:decoration-gold">
              Ver preços
            </a>
          )}
          <a
            href={whatsappLink(whatsappMessages.flavor(flavor.name, sweet))}
            {...external}
            aria-label={`Pedir pizza de ${flavor.name} pelo WhatsApp (abre em nova aba)`}
            data-cta="flavor-whatsapp"
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-gold/40 px-4 text-sm font-semibold text-gold-light transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ink active:scale-95"
          >
            <WhatsAppIcon size={15} />
            Pedir
          </a>
        </div>
      </div>
    </div>
  );
}

function Sizes() {
  return (
    <div id="tamanhos" className="mt-24 scroll-mt-28 border-t border-cream/10 pt-20 lg:mt-32">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <Reveal>
            <Eyebrow>Tamanhos e preços</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="mt-5 text-4xl leading-tight text-cream sm:text-5xl">
              Do jantar a dois <em className="text-gradient-gold">à mesa cheia.</em>
            </h3>
          </Reveal>
        </div>
        <Reveal delay={0.12}>
          <p className="max-w-md text-cream/65">Escolha o tamanho ideal para o seu momento e combine com os sabores que preferir.</p>
        </Reveal>
      </div>

      <RevealGroup className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4" stagger={0.1}>
        {sizes.map((s) => (
          <RevealItem key={s.id} as="article">
            <div className="group relative flex h-full flex-col items-center rounded-[1.75rem] border border-cream/10 bg-linear-to-b from-cream/[0.05] to-transparent px-4 pb-6 pt-8 text-center transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 sm:px-6">
              <SliceDiagram slices={s.slices} className="size-24 text-gold transition-transform duration-700 ease-[var(--ease-premium)] group-hover:rotate-12 sm:size-28" />
              <h4 className="mt-6 font-serif text-3xl text-cream">{s.name}</h4>
              <p className="mt-1 text-sm text-cream/55">
                {s.slices} fatias{s.note ? ` · ${s.note}` : ""}
              </p>
              <div className="mt-5 min-h-[3.6rem]">
                {s.price !== null ? (
                  <>
                    <span className="block text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold/80">{s.priceLabel}</span>
                    <span className="mt-1 block font-serif text-[2.1rem] leading-none text-cream">{formatPrice(s.price)}</span>
                  </>
                ) : (
                  <span className="block pt-3 font-serif text-2xl italic leading-tight text-cream/80">{s.priceLabel}</span>
                )}
              </div>
              <a
                href={whatsappLink(whatsappMessages.size(s.name.toLowerCase(), s.slices))}
                {...external}
                aria-label={`${s.price !== null ? "Pedir" : "Consultar"} pizza ${s.name} pelo WhatsApp (abre em nova aba)`}
                data-cta="size-whatsapp"
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-gold/40 px-4 text-sm font-semibold text-gold-light transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ink active:scale-95"
              >
                <WhatsAppIcon size={15} />
                {s.price !== null ? "Pedir" : "Consultar"}
              </a>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
        <ButtonLink href={whatsappLink(whatsappMessages.menu)} icon="whatsapp" variant="outline" data-cta="menu-full">
          Pedir o cardápio completo
        </ButtonLink>
        <a href="#combo" className="inline-flex items-center gap-2 text-sm font-semibold text-gold-light transition-colors hover:text-cream">
          Conheça o Combo Casal
          <ArrowDown size={16} aria-hidden="true" />
        </a>
      </Reveal>
    </div>
  );
}
