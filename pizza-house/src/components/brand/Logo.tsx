import { cn } from "@/lib/cn";
import { LOGO_HEIGHT, LOGO_PATH, LOGO_PIZZA, LOGO_PIZZA_WEDGE, LOGO_VIEWBOX, LOGO_WIDTH } from "./logo-path";

/** <use> com o mesmo sistema de coordenadas do símbolo (mapeamento 1:1). */
const use = { href: "#ph-logo", x: -2, y: -6, width: LOGO_WIDTH, height: LOGO_HEIGHT } as const;

/**
 * Sprite do logotipo (renderizado uma única vez no <body>). Todas as instâncias
 * do logo reutilizam o mesmo desenho via <use>, mantendo o HTML leve.
 */
export function LogoSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <symbol id="ph-logo" viewBox={LOGO_VIEWBOX}>
          <path fill="currentColor" fillRule="evenodd" d={LOGO_PATH} />
        </symbol>
        <clipPath id="ph-logo-pizza" clipPathUnits="userSpaceOnUse">
          <circle cx={LOGO_PIZZA.cx} cy={LOGO_PIZZA.cy} r={LOGO_PIZZA.r} />
          <path d={LOGO_PIZZA_WEDGE} />
        </clipPath>
        <mask id="ph-logo-letters" maskUnits="userSpaceOnUse" x="-10" y="-10" width="450" height="260">
          <rect x="-10" y="-10" width="450" height="260" fill="#fff" />
          <circle cx={LOGO_PIZZA.cx} cy={LOGO_PIZZA.cy} r={LOGO_PIZZA.r} fill="#000" />
          <path d={LOGO_PIZZA_WEDGE} fill="#000" />
        </mask>
      </defs>
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** Texto alternativo; use `decorative` quando houver texto visível ao lado. */
  title?: string;
  decorative?: boolean;
  /** Destaca o ícone de pizza em dourado. */
  accent?: boolean;
}

/** Logotipo oficial Pizza House (vetor). Cor = `currentColor`. */
export function Logo({ className, title = "Pizza House", decorative, accent = true }: LogoProps) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      className={cn("block h-auto", className)}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
    >
      {accent ? (
        <>
          <use {...use} mask="url(#ph-logo-letters)" />
          <use {...use} clipPath="url(#ph-logo-pizza)" className="text-gold" />
        </>
      ) : (
        <use {...use} />
      )}
    </svg>
  );
}

/** Logo usado no pré-carregamento: pizza gira e as letras se revelam (CSS puro). */
export function LogoIntro() {
  return (
    <svg viewBox={LOGO_VIEWBOX} className="preloader__logo" aria-hidden="true" focusable="false">
      <g className="preloader__letters">
        <use {...use} mask="url(#ph-logo-letters)" />
      </g>
      <g className="preloader__pizza">
        <use {...use} clipPath="url(#ph-logo-pizza)" className="preloader__pizza-fill" />
      </g>
    </svg>
  );
}
