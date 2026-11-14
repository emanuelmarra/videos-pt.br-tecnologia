import { ArrowUpRight, Quote } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stars } from "@/components/ui/Stars";
import { mapsLinks, site } from "@/config/site";
import { testimonials } from "@/data/testimonials";

export function Reviews() {
  return (
    <section aria-labelledby="avaliacoes-titulo" className="section-pad relative overflow-hidden bg-espresso">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_40%,rgb(193_139_74/0.14),transparent_70%)]" aria-hidden="true" />
      <div className="container-site relative">
        <SectionHeading
          id="avaliacoes-titulo"
          eyebrow="Avaliações"
          align="center"
          title={
            <>
              Aprovada por <em className="text-gradient-gold">quem prova.</em>
            </>
          }
          intro="A opinião de quem já sentou à nossa mesa — ou recebeu a Pizza House em casa — é o nosso melhor cartão de visitas."
        />

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-3xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-gold/25 bg-ink/60 px-6 py-10 text-center shadow-[0_50px_100px_-50px_rgb(0_0_0/0.9)] sm:px-12 sm:py-14">
            <span className="pointer-events-none absolute -left-10 -top-10 size-40 rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
            <div className="grid items-center gap-10 sm:grid-cols-[1fr_auto_1fr] sm:gap-8">
              <div>
                <p className="font-serif text-[5.5rem] leading-none text-cream sm:text-[6.5rem]" aria-label={`Nota ${site.rating.value.toLocaleString("pt-BR")} de ${site.rating.best}`}>
                  <Counter value={site.rating.value} decimals={1} />
                  <span className="text-3xl text-cream/50 sm:text-4xl">/{site.rating.best}</span>
                </p>
                <Stars rating={site.rating.value} size={24} idPrefix="nota" className="mt-3" />
                <p className="mt-3 text-sm text-cream/60">Nota média no {site.rating.source}</p>
              </div>
              <span className="mx-auto h-px w-24 bg-linear-to-r from-transparent via-gold/50 to-transparent sm:h-28 sm:w-px sm:bg-linear-to-b" aria-hidden="true" />
              <div>
                <p className="font-serif text-[4.2rem] leading-none text-cream sm:text-[5rem]">
                  <Counter value={site.rating.count} prefix="+" />
                </p>
                <p className="mt-4 text-[0.7rem] font-bold uppercase tracking-[0.26em] text-gold">{site.rating.countLabel}</p>
                <p className="mt-2 text-sm text-cream/60">de clientes no {site.rating.source}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {testimonials.length > 0 ? (
          <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
            {testimonials.map((t) => (
              <RevealItem key={t.name + t.text.slice(0, 12)} as="article">
                <figure className="flex h-full flex-col rounded-[1.5rem] border border-cream/10 bg-cream/[0.03] p-7">
                  <Quote size={28} className="text-gold/60" aria-hidden="true" />
                  <blockquote className="mt-4 flex-1 font-serif text-xl leading-snug text-cream/90">“{t.text}”</blockquote>
                  <figcaption className="mt-6 flex items-center justify-between gap-3 border-t border-cream/10 pt-5">
                    <span>
                      <span className="block font-semibold text-cream">{t.name}</span>
                      {t.source && <span className="text-xs text-cream/50">via {t.source}</span>}
                    </span>
                    <Stars rating={t.rating} size={14} idPrefix={`dep-${t.name}`} />
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : null}

        <Reveal delay={0.15} className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="max-w-md text-cream/65">Já provou a Pizza House? Sua avaliação ajuda outras pessoas a nos conhecerem.</p>
          <ButtonLink href={mapsLinks.reviews} variant="outline" icon={<ArrowUpRight size={18} aria-hidden="true" />}>
            Ver avaliações no Google
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
