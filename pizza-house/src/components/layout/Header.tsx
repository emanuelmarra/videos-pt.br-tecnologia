"use client";

import { AnimatePresence, m } from "framer-motion";
import { Clock, MapPin, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { navLinks, site } from "@/config/site";
import { useActiveSection, useLockBodyScroll, useScrolled } from "@/lib/hooks";
import { external, whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

const sectionIds = navLinks.map((l) => l.href.slice(1));
const ease = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const scrolled = useScrolled(40);
  const active = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);

  // Fecha com Esc, mantém o foco dentro do menu e devolve o foco ao botão
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () => Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
    const t = window.setTimeout(() => focusables()[0]?.focus(), 350);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const els = [toggleRef.current!, ...focusables()];
        const i = els.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          els[els.length - 1].focus();
        } else if (!e.shiftKey && i === els.length - 1) {
          e.preventDefault();
          els[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (wasOpen.current && !open) toggleRef.current?.focus({ preventScroll: true });
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    document.documentElement.toggleAttribute("data-menu-open", open);
  }, [open]);

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,padding,border-color,backdrop-filter] duration-500",
        scrolled || open
          ? "border-b border-gold/15 bg-ink/85 py-2.5 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent py-4 lg:py-6",
      )}
    >
      <div className="container-site flex items-center justify-between gap-6">
        <a href="#inicio" className="relative z-10 -m-2 shrink-0 p-2 text-cream" aria-label="Pizza House — voltar ao início" onClick={() => setOpen(false)}>
          <Logo decorative className={cn("transition-[width] duration-500", scrolled ? "w-[104px] lg:w-[116px]" : "w-[112px] lg:w-[136px]")} />
        </a>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative block rounded-full px-4 py-2 text-[0.9rem] font-medium transition-colors duration-300",
                      isActive ? "text-cream" : "text-cream/65 hover:text-cream",
                    )}
                  >
                    {isActive && (
                      <m.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full border border-gold/30 bg-gold/10"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <ButtonLink href={whatsappLink(whatsappMessages.order)} icon="whatsapp" size="sm" className="hidden sm:inline-flex" data-cta="header-whatsapp">
            Pedir pelo WhatsApp
          </ButtonLink>
          <a
            href={whatsappLink(whatsappMessages.order)}
            {...external}
            className="grid size-11 place-items-center rounded-full bg-gold text-ink transition-transform active:scale-95 sm:hidden"
            aria-label="Pedir pelo WhatsApp (abre em nova aba)"
            data-cta="header-whatsapp-mobile"
          >
            <WhatsAppIcon size={20} />
          </a>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="relative grid size-11 place-items-center rounded-full border border-cream/20 text-cream transition-colors hover:border-gold/60 lg:hidden"
          >
            <span className="relative block h-3.5 w-5" aria-hidden="true">
              <span
                className={cn(
                  "absolute left-0 block h-[1.5px] w-5 rounded-full bg-current transition-all duration-500 ease-[var(--ease-premium)]",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-1.5 block h-[1.5px] rounded-full bg-current transition-all duration-500 ease-[var(--ease-premium)]",
                  open ? "w-0 opacity-0" : "w-3.5 opacity-100",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-[1.5px] w-5 rounded-full bg-current transition-all duration-500 ease-[var(--ease-premium)]",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </div>
    </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="menu-mobile"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="bg-wood fixed inset-0 z-40 flex h-[100dvh] flex-col overflow-y-auto px-6 pb-10 pt-28 lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.65, ease }}
          >
            <nav aria-label="Navegação do menu mobile">
              <ul className="space-y-1">
                {navLinks.map((link, i) => (
                  <m.li
                    key={link.href}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.6, ease, delay: 0.18 + i * 0.06 }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-2.5 font-serif text-[2.6rem] leading-none text-cream transition-colors hover:text-gold-light"
                    >
                      <span className="font-sans text-xs font-semibold tracking-[0.2em] text-gold/70">0{i + 1}</span>
                      {link.label}
                    </a>
                  </m.li>
                ))}
              </ul>
            </nav>

            <m.div
              className="mt-auto space-y-6 pt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.6, ease, delay: 0.5 }}
            >
              <ButtonLink href={whatsappLink(whatsappMessages.order)} icon="whatsapp" className="w-full" data-cta="menu-whatsapp">
                Pedir pelo WhatsApp
              </ButtonLink>
              <ul className="space-y-3 text-sm text-cream/75">
                <li className="flex items-center gap-3">
                  <Clock size={16} className="text-gold" aria-hidden="true" />
                  {site.hours.label}, {site.hours.display}
                </li>
                <li>
                  <a href={`tel:${site.phone.e164}`} className="flex items-center gap-3 hover:text-cream">
                    <Phone size={16} className="text-gold" aria-hidden="true" />
                    {site.phone.display}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={16} className="text-gold" aria-hidden="true" />
                  {site.address.city} — {site.address.state}
                </li>
              </ul>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
