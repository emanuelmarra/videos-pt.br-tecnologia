import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";
import { SplitReveal } from "./SplitReveal";

export function Eyebrow({ children, tone = "dark", className, centered }: { children: ReactNode; tone?: "dark" | "light"; className?: string; centered?: boolean }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.32em] sm:text-xs",
        tone === "dark" ? "text-gold" : "text-wood",
        centered && "justify-center",
        className,
      )}
    >
      <span className={cn("h-px w-8", tone === "dark" ? "bg-gold/60" : "bg-wood/50")} aria-hidden="true" />
      {children}
      {centered && <span className={cn("h-px w-8", tone === "dark" ? "bg-gold/60" : "bg-wood/50")} aria-hidden="true" />}
    </p>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  /** "dark" = seção escura (texto claro); "light" = seção creme (texto escuro). */
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
  id?: string;
}

export function SectionHeading({ eyebrow, title, intro, tone = "dark", align = "left", className, id }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div className={cn(centered && "mx-auto max-w-3xl text-center", className)}>
      <Reveal>
        <Eyebrow tone={tone} centered={centered}>
          {eyebrow}
        </Eyebrow>
      </Reveal>
      <h2
        id={id}
        className={cn("mt-5 text-[2.6rem] leading-[1.02] sm:text-5xl lg:text-[4.1rem]", tone === "dark" ? "text-cream" : "text-espresso")}
      >
        <SplitReveal delay={0.08}>{title}</SplitReveal>
      </h2>
      {intro && (
        <Reveal delay={0.16}>
          <p className={cn("mt-6 text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-cream/70" : "text-[#5b4232]", centered && "mx-auto max-w-2xl")}>
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
