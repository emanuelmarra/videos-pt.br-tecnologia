import type Lenis from "lenis";

/** Instância única da rolagem suave (Lenis), quando ativa. */
export const smooth: { lenis: Lenis | null } = { lenis: null };

