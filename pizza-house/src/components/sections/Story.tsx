"use client";

import { m, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

/*
 * "A experiência": seção fixa na tela enquanto a pizza 3D (ao fundo) se desmonta
 * em camadas — massa, molho e queijo, ingredientes — e por fim é servida.
 * As faixas abaixo precisam bater com as etapas de components/three/Pizza.tsx.
 */
const steps = [
  {
    range: [0.1, 0.36],
    n: "01",
    label: "A massa",
    title: "Massa artesanal.",
    text: "Leveza e sabor em cada pedaço: é aqui que toda pizza da casa começa.",
  },
  {
    range: [0.36, 0.56],
    n: "02",
    label: "Molho e queijo",
    title: "Queijo de ponta a ponta.",
    text: "Molho de tomate e uma camada generosa de queijo, gratinada até chegar à borda.",
  },
  {
    range: [0.56, 0.76],
    n: "03",
    label: "Ingredientes",
    title: "Ingredientes que fazem a diferença.",
    text: "Recheios generosos e ingredientes selecionados — como nesta marguerita, com tomate e manjericão.",
  },
  {
    range: [0.76, 1],
    n: "04",
    label: "Para compartilhar",
    title: "Feita para compartilhar.",
    text: "Perfeita para dividir com quem você gosta: no salão, na retirada ou no delivery.",
  },
] as const;

/** Faixa de visibilidade de uma etapa (entradas sempre crescentes e dentro de 0–1). */
function useBand(p: MotionValue<number>, a: number, b: number) {
  const input: number[] = [];
  const op: number[] = [];
  const ys: number[] = [];
  // a etapa anterior some antes de a próxima aparecer (sem textos sobrepostos)
  if (a > 0) {
    input.push(a, a + 0.04);
    op.push(0, 1);
    ys.push(40, 0);
  } else {
    input.push(0);
    op.push(1);
    ys.push(0);
  }
  if (b < 1) {
    input.push(b - 0.045, b - 0.008);
    op.push(1, 0);
    ys.push(0, -40);
  } else {
    input.push(1);
    op.push(1);
    ys.push(0);
  }
  const opacity = useTransform(p, input, op);
  const y = useTransform(p, input, ys);
  return { opacity, y };
}

function Step({ p, step, last }: { p: MotionValue<number>; step: (typeof steps)[number]; last: boolean }) {
  const { opacity, y } = useBand(p, step.range[0], last ? 1 : step.range[1]);
  return (
    <m.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2">
      <p className="flex items-baseline gap-3 font-serif text-gold">
        <span className="text-5xl italic leading-none lg:text-6xl">{step.n}</span>
        <span className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.3em]">{step.label}</span>
      </p>
      <h3 className="mt-4 text-[2.4rem] leading-[1.02] text-cream sm:text-5xl lg:text-[3.6rem]">{step.title}</h3>
      <p className="mt-4 max-w-md text-base leading-relaxed text-cream/75 sm:text-lg">{step.text}</p>
      {last && (
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={whatsappLink(whatsappMessages.order)} icon="whatsapp" data-cta="story-whatsapp">
            Peça a sua pelo WhatsApp
          </ButtonLink>
          <ButtonLink href="#cardapio" variant="outline" arrow className="hidden sm:inline-flex">
            Ver o cardápio
          </ButtonLink>
        </div>
      )}
    </m.div>
  );
}

export function Story() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const intro = useBand(p, -0.2, 0.1);
  const bar = useTransform(p, [0.08, 1], ["0%", "100%"]);

  return (
    <section id="experiencia" ref={ref} aria-labelledby="experiencia-titulo" className="relative z-10 h-[420vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* leitura do texto no celular */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-linear-to-t from-[#070504] via-[#070504]/85 to-transparent lg:hidden" />
        <div className="container-site relative h-full">
          <div className="relative h-full max-w-xl pb-16 pt-28 lg:pb-0 lg:pt-0">
            <m.div style={intro} className="absolute inset-x-0 bottom-16 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2">
              <Eyebrow>A experiência Pizza House</Eyebrow>
              <h2 id="experiencia-titulo" className="mt-5 text-[2.7rem] leading-[1] text-cream sm:text-6xl lg:text-[4.4rem]">
                Uma pizza, <em className="text-gradient-gold">em detalhes.</em>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-cream/70 sm:text-lg">
                Continue rolando e veja, camada por camada, o que faz cada fatia valer a pena.
              </p>
            </m.div>
            <div className="absolute inset-x-0 bottom-16 top-28 lg:inset-y-0">
              {steps.map((s, i) => (
                <Step key={s.n} p={p} step={s} last={i === steps.length - 1} />
              ))}
            </div>
          </div>

        </div>
        <div className="container-site absolute inset-x-0 bottom-7 hidden items-center gap-8 lg:flex" aria-hidden="true">
          {steps.map((s) => (
            <StepDot key={s.n} p={p} a={s.range[0]} b={s.range[1]} label={`${s.n} · ${s.label}`} />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-cream/10" aria-hidden="true">
          <m.div className="h-full bg-gold" style={{ width: bar }} />
        </div>
      </div>
    </section>
  );
}

function StepDot({ p, a, b, label }: { p: MotionValue<number>; a: number; b: number; label: string }) {
  const end = Math.min(1, b);
  const on = useTransform(p, [a - 0.02, a, end - 0.01, end], [0.55, 1, 1, end === 1 ? 1 : 0.55]);
  const w = useTransform(p, [a - 0.02, a, end - 0.01, end], [12, 36, 36, end === 1 ? 36 : 12]);
  return (
    <m.div style={{ opacity: on }} className={cn("flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-cream")}>
      <m.span style={{ width: w }} className="block h-px bg-gold" />
      {label}
    </m.div>
  );
}
