import { LogoIntro } from "@/components/brand/Logo";

/**
 * Abertura animada (somente CSS): a pizza do logotipo gira e as letras se revelam.
 * Some sozinha em ~2s, mesmo sem JavaScript. Não aparece de novo na mesma sessão
 * e é desativada para quem prefere movimento reduzido.
 */
export function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <LogoIntro />
      <span className="preloader__bar" />
    </div>
  );
}

/** Script mínimo executado antes da pintura: pula a abertura se já foi vista. */
export const introScript = `try{if(sessionStorage.getItem('ph-intro'))document.documentElement.setAttribute('data-intro-seen','');else sessionStorage.setItem('ph-intro','1')}catch(e){}`;
