"use client";

import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Clock, Star } from "lucide-react";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { SliceIcon } from "@/components/ui/icons";
import { Picture } from "@/components/ui/Picture";
import { site } from "@/config/site";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

/** Ordem da animação de entrada (CSS puro: aparece sem esperar o JavaScript). */
const order = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** Partículas de calor que sobem lentamente (posições fixas = sem diferença SSR/cliente). */
const embers = [
  { left: "52%", size: 3, dur: 11, delay: 0, drift: 30, alpha: 0.7 },
  { left: "58%", size: 2, dur: 9, delay: 2.5, drift: -20, alpha: 0.6 },
  { left: "64%", size: 4, dur: 13, delay: 1.2, drift: 40, alpha: 0.5 },
  { left: "70%", size: 2, dur: 10, delay: 4, drift: 15, alpha: 0.8 },
  { left: "76%", size: 3, dur: 12, delay: 6, drift: -35, alpha: 0.55 },
  { left: "82%", size: 2, dur: 9.5, delay: 3.2, drift: 25, alpha: 0.7 },
  { left: "88%", size: 3, dur: 14, delay: 7.5, drift: -15, alpha: 0.5 },
  { left: "94%", size: 2, dur: 10.5, delay: 5.4, drift: 20, alpha: 0.65 },
  { left: "36%", size: 2, dur: 12.5, delay: 8.2, drift: 30, alpha: 0.4 },
  { left: "44%", size: 3, dur: 15, delay: 9.6, drift: -25, alpha: 0.45 },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);


  return (
    <section
      id="inicio"
      ref={ref}
      aria-labelledby="hero-titulo"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-[#050404] lg:items-center"
    >
      {/* Fotografia principal */}
      <m.div style={{ y: imageY }} className="absolute inset-0 -z-10 lg:left-auto lg:aspect-[623/873] lg:h-full lg:min-w-[46%]">
        <div className="h-full w-full overflow-hidden">
          <Picture
            image="hero-pizza"
            alt="Pizza artesanal marguerita da Pizza House, com tomates assados, manjericão e mussarela gratinada"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            placeholder={false}
            className="h-full w-full animate-kenburns"
            imgClassName="object-[28%_50%] lg:object-left"
          />
        </div>
        {/* camadas de leitura */}
        <div className="absolute inset-0 bg-[#050404]/30 lg:bg-transparent" aria-hidden="true" />
        <div className="absolute inset-y-0 left-0 hidden w-2/5 bg-linear-to-r from-[#050404] via-[#050404]/70 to-transparent lg:block" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-linear-to-t from-[#050404] via-[#050404]/85 to-transparent lg:h-1/3 lg:via-[#050404]/30" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[#050404]/80 to-transparent" aria-hidden="true" />
      </m.div>

      {/* brilho quente do forno */}
      <div
        className="pointer-events-none absolute -z-10 right-[5%] top-1/2 hidden size-[46rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(193_139_74/0.16),transparent_62%)] blur-2xl lg:block"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        {embers.map((e, i) => (
          <span
            key={i}
            className="ember"
            style={
              {
                left: e.left,
                "--size": `${e.size}px`,
                "--dur": `${e.dur}s`,
                "--delay": `${e.delay}s`,
                "--drift": `${e.drift}px`,
                "--alpha": e.alpha,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Conteúdo */}
      <m.div style={{ y: contentY, opacity: fade }} className="container-site relative w-full pb-24 pt-36 sm:pb-28 lg:py-32">
        <div className="max-w-[44rem] lg:max-w-[min(56rem,60vw)]">
          <p style={order(-2)} className="hero-rise flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-gold sm:text-xs sm:tracking-[0.32em]">
            <SliceIcon size={16} className="shrink-0" />
            <span>
              Pizzaria artesanal · Divinópolis<span className="hidden sm:inline"> — MG</span>
            </span>
          </p>

          <h1 id="hero-titulo" className="mt-6 font-serif text-[3.15rem] font-medium leading-[0.98] tracking-[-0.015em] text-cream sm:text-7xl lg:text-[clamp(3.9rem,min(6.2vw,10.2vh),6.6rem)]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="hero-line block" style={order(0)}>
                Muito mais que pizza.
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="hero-line block italic text-gradient-gold" style={order(1)}>
                Uma experiência artesanal.
              </span>
            </span>
          </h1>

          <p className="hero-focus mt-7 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
            Massa leve, ingredientes selecionados e recheios generosos. Descubra o sabor da Pizza House.
          </p>

          <div style={order(1)} className="hero-rise mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href={whatsappLink(whatsappMessages.order)} icon="whatsapp" data-cta="hero-whatsapp">
              Peça agora pelo WhatsApp
            </ButtonLink>
            <ButtonLink href="#cardapio" variant="outline" arrow>
              Conheça nosso cardápio
            </ButtonLink>
          </div>

          <ul style={order(2)} className="hero-rise mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-cream/75">
            <li className="flex items-center gap-2">
              <span className="flex text-gold" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <span>
                <strong className="font-semibold text-cream">{site.rating.value.toLocaleString("pt-BR")}</strong> no Google ·{" "}
                {site.rating.countLabel.toLowerCase()}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={15} className="text-gold" aria-hidden="true" />
              {site.hours.label}, {site.hours.display}
            </li>
          </ul>
        </div>
      </m.div>

      {/* Selo giratório */}
      <div
        style={order(5)}
        className="hero-rise pointer-events-none absolute bottom-28 right-[9%] hidden size-36 rounded-full bg-ink/45 backdrop-blur-[2px] lg:block xl:right-[10%]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 120 120" className="size-full animate-spin-slow text-cream/80">
          <defs>
            <path id="selo-circulo" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
          </defs>
          <text className="fill-current font-sans text-[8.6px] font-semibold uppercase">
            <textPath href="#selo-circulo" textLength="284" lengthAdjust="spacing">
              Pizza artesanal · Desde {site.foundedYear} · Divinópolis ·
            </textPath>
          </text>
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid size-14 place-items-center rounded-full border border-gold/40 bg-ink/60 text-gold backdrop-blur">
            <SliceIcon size={24} />
          </span>
        </div>
      </div>

      {/* Indicador de rolagem */}
      <a
        href="#historia"
        style={order(7)}
        className="hero-rise absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-cream/55 transition-colors hover:text-cream md:flex [@media(max-height:820px)]:!hidden"
      >
        Role para descobrir
        <span className="scroll-cue" aria-hidden="true" />
      </a>
    </section>
  );
}
