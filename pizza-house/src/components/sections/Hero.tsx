"use client";

import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Clock, Star } from "lucide-react";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { SliceIcon } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { site } from "@/config/site";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

/** Ordem da animação de entrada (CSS puro: aparece sem esperar o JavaScript). */
const order = (i: number) => ({ "--i": i }) as React.CSSProperties;

/**
 * Hero: texto à esquerda; à direita (ou acima, no celular) a pizza 3D
 * interativa do fundo fixo (components/three), que segue o mouse.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "28%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section id="inicio" ref={ref} aria-labelledby="hero-titulo" className="relative z-10 flex min-h-[100svh] items-end lg:items-center">
      {/* leitura do texto sobre a cena no celular */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-linear-to-t from-[#070504] via-[#070504]/80 to-transparent lg:hidden" aria-hidden="true" />

      <m.div style={{ y: contentY, opacity: fade }} className="container-site relative w-full pb-16 pt-[46svh] sm:pb-24 lg:py-32">
        <div className="max-w-[40rem] lg:max-w-[min(48rem,50vw)]">
          <p style={order(-2)} className="hero-rise flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-gold sm:text-xs sm:tracking-[0.32em]">
            <SliceIcon size={16} className="shrink-0" />
            <span>
              Pizzaria artesanal · Divinópolis<span className="hidden sm:inline"> — MG</span>
            </span>
          </p>

          <h1
            id="hero-titulo"
            className="mt-6 font-serif text-[3rem] font-medium leading-[0.98] tracking-[-0.015em] text-cream sm:text-7xl lg:text-[clamp(3.6rem,min(5.5vw,10vh),6.4rem)]"
          >
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
            <Magnetic>
              <ButtonLink href={whatsappLink(whatsappMessages.order)} icon="whatsapp" data-cta="hero-whatsapp" className="w-full sm:w-auto">
                Peça agora pelo WhatsApp
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="#cardapio" variant="outline" arrow className="w-full sm:w-auto">
                Conheça nosso cardápio
              </ButtonLink>
            </Magnetic>
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

      {/* Indicador de rolagem */}
      <a
        href="#experiencia"
        style={order(7)}
        className="hero-rise absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-cream/55 transition-colors hover:text-cream md:flex [@media(max-height:820px)]:!hidden"
      >
        Role para explorar
        <span className="scroll-cue" aria-hidden="true" />
      </a>
    </section>
  );
}
