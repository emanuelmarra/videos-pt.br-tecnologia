"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { smooth } from "@/lib/smooth-scroll";

/**
 * Rolagem suave com inércia (desktop). Desativada para quem prefere movimento
 * reduzido; no celular a rolagem nativa é mantida.
 */
export function SmoothScroll() {
  useEffect(() => {
    // só no desktop com mouse; no celular a rolagem nativa já é a melhor experiência
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.09, wheelMultiplier: 0.95 });
    smooth.lenis = lenis;

    // links internos (#secao) com rolagem suave
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const id = a.getAttribute("href")!;
      const target = id === "#" ? null : document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      // o deslocamento do cabeçalho vem do scroll-padding-top do CSS (respeitado pelo Lenis)
      requestAnimationFrame(() => lenis.scrollTo(target as HTMLElement, { force: true, duration: 1.4 }));
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      lenis.destroy();
      smooth.lenis = null;
    };
  }, []);
  return null;
}
