"use client";

import { m } from "framer-motion";
import { HeartHandshake } from "lucide-react";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Counter } from "@/components/ui/Counter";
import { site } from "@/config/site";
import { useParallax } from "@/lib/hooks";

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const slow = useParallax(ref, 30);
  const fast = useParallax(ref, -45);

  return (
    <section id="historia" aria-labelledby="historia-titulo" className="bg-paper section-pad relative overflow-hidden text-espresso">
      <div className="container-site grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
        {/* Composição de fotos */}
        <div ref={ref} className="relative mx-auto w-full max-w-[34rem] pb-16 pr-6 sm:pb-20 sm:pr-12 lg:col-span-6 lg:mx-0">
          <m.div style={{ y: slow }} className="relative">
            <span className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border border-wood/30 sm:-left-6 sm:-top-6" aria-hidden="true" />
            <Reveal y={40} className="relative overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgb(40_23_15/0.6)]">
              <Picture
                image="mesa-pizzas"
                alt="Mesa da Pizza House com pizzas salgadas e doces servidas em tábuas de madeira"
                sizes="(min-width: 1024px) 34rem, 90vw"
                className="aspect-[4/5]"
                imgClassName="transition-transform duration-[1.6s] ease-[var(--ease-premium)] hover:scale-105"
              />
            </Reveal>
          </m.div>

          <m.div style={{ y: fast }} className="absolute bottom-0 right-0 w-[58%]">
            <Reveal y={50} delay={0.15} className="overflow-hidden rounded-2xl border-[6px] border-cream shadow-[0_30px_60px_-25px_rgb(40_23_15/0.7)]">
              <Picture
                image="fachada"
                alt="Placa iluminada da Pizza House na fachada da pizzaria em Divinópolis"
                sizes="(min-width: 1024px) 20rem, 55vw"
                className="aspect-[3/2]"
              />
            </Reveal>
          </m.div>

          {/* Selo "desde 2020" */}
          <Reveal delay={0.3} className="absolute -left-2 bottom-24 sm:-left-8 sm:bottom-32">
            <div className="grid size-28 place-items-center rounded-full bg-espresso text-center text-cream shadow-2xl ring-1 ring-gold/40 sm:size-32">
              <div>
                <span className="block text-[0.6rem] font-bold uppercase tracking-[0.3em] text-gold">Desde</span>
                <span className="block font-serif text-4xl leading-none sm:text-[2.6rem]">{site.foundedYear}</span>
                <span className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-cream/60">Divinópolis</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Texto editorial */}
        <div className="lg:col-span-6 lg:pl-8">
          <Reveal>
            <Eyebrow tone="light">Nossa história</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="historia-titulo" className="mt-5 text-[2.6rem] leading-[1.02] text-espresso sm:text-5xl lg:text-[4.1rem]">
              Uma história feita <em className="text-wood">de sabor.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-8 space-y-5 text-[1.05rem] leading-relaxed text-[#5b4232]">
              <p>
                A Pizza House abriu as portas ao público em <strong className="font-semibold text-espresso">{site.foundedYear}</strong> com uma
                proposta clara: servir em Divinópolis uma pizza verdadeiramente artesanal — de massa leve, recheios generosos e aquele
                sabor que faz a gente querer voltar.
              </p>
              <p>
                Desde então, conquistamos nosso espaço na cidade sendo parte de encontros em família, reuniões entre amigos e
                comemorações especiais. Para nós, cada pizza que sai do forno acompanha um momento que merece ser lembrado.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <figure className="relative mt-9 rounded-2xl border border-wood/15 bg-warm/70 p-6 shadow-[0_20px_50px_-30px_rgb(117_68_38/0.5)] sm:p-7">
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-espresso text-gold">
                  <HeartHandshake size={22} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <div>
                  <figcaption className="font-serif text-2xl leading-tight text-espresso">Uma casa com gestão feminina</figcaption>
                  <p className="mt-2 leading-relaxed text-[#5b4232]">
                    À frente da Pizza House está uma gestão feminina, que conduz a casa com atenção aos detalhes, acolhimento em cada
                    atendimento e o cuidado de quem recebe os clientes como se fossem convidados.
                  </p>
                </div>
              </div>
            </figure>
          </Reveal>

          <RevealGroup className="mt-10 grid grid-cols-3 gap-4 border-t border-wood/15 pt-8" as="dl">
            <RevealItem>
              <dt className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-wood/80">Abertura</dt>
              <dd className="mt-2 font-serif text-4xl leading-none text-espresso sm:text-5xl">{site.foundedYear}</dd>
            </RevealItem>
            <RevealItem>
              <dt className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-wood/80">Nota Google</dt>
              <dd className="mt-2 font-serif text-4xl leading-none text-espresso sm:text-5xl">
                <Counter value={site.rating.value} decimals={1} />
              </dd>
            </RevealItem>
            <RevealItem>
              <dt className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-wood/80">Avaliações</dt>
              <dd className="mt-2 font-serif text-4xl leading-none text-espresso sm:text-5xl">
                <Counter value={site.rating.count} prefix="+" />
              </dd>
            </RevealItem>
          </RevealGroup>

          <Reveal delay={0.1} className="mt-10">
            <ButtonLink href="#cardapio" variant="dark" arrow>
              Ver o cardápio
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
