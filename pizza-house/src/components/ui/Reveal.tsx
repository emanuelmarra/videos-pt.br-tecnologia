"use client";

import { m, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Deslocamento inicial (px) */
  y?: number;
  x?: number;
  duration?: number;
  amount?: number;
  as?: "div" | "li" | "article" | "section" | "header" | "p" | "span";
}

/** Revela o conteúdo suavemente quando entra na tela. */
export function Reveal({ children, className, delay = 0, y = 32, x = 0, duration = 0.95, amount = 0.2, as = "div" }: RevealProps) {
  const Tag = m[as];
  return (
    <Tag
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, ease, delay }}
    >
      {children}
    </Tag>
  );
}

const groupVariants: Variants = {
  hidden: {},
  show: (stagger: number = 0.1) => ({ transition: { staggerChildren: stagger, delayChildren: 0.05 } }),
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

/** Grupo com entrada escalonada dos filhos (`RevealItem`). */
export function RevealGroup({
  children,
  className,
  stagger = 0.1,
  amount = 0.15,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  amount?: number;
  as?: "div" | "ul" | "ol" | "dl";
}) {
  const Tag = m[as];
  return (
    <Tag className={className} variants={groupVariants} custom={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount }}>
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article" | "dd" | "dt";
}) {
  const Tag = m[as];
  return (
    <Tag data-reveal="" className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}
