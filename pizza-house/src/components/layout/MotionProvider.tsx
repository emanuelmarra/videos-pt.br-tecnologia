"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";

const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

/**
 * - Carrega o motor de animações sob demanda (JavaScript inicial menor).
 * - Respeita a preferência do sistema por movimento reduzido em todas as animações.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  // sinaliza que o JavaScript carregou (a rede de segurança do layout deixa de agir)
  useEffect(() => {
    document.documentElement.dataset.hydrated = "1";
  }, []);
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
