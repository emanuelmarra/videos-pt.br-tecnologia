"use client";

import { m, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Cursor de destaque (somente mouse): um anel dourado que segue o ponteiro,
 * cresce sobre links/botões e mostra rótulos como "Ver" ou "Pedir".
 * O cursor nativo continua visível.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 520, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 520, damping: 40, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const el = (e.target as HTMLElement).closest?.("[data-cursor], a, button") as HTMLElement | null;
      setHover(!!el);
      setLabel(el?.dataset.cursor ?? "");
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = label ? 84 : hover ? 54 : 30;
  return (
    <m.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden lg:block"
      style={{ x: sx, y: sy }}
    >
      <m.div
        className="-translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full border border-gold/70 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ink backdrop-blur-[1px]"
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor: label ? "rgba(193,139,74,0.95)" : hover ? "rgba(193,139,74,0.12)" : "rgba(193,139,74,0)",
        }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        {label}
      </m.div>
    </m.div>
  );
}
