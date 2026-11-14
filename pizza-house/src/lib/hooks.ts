"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { site } from "@/config/site";

/** Deslocamento vertical suave (parallax) conforme o elemento atravessa a tela. */
export function useParallax(ref: RefObject<HTMLElement | null>, distance = 60): MotionValue<number> {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-distance, distance]);
}

/** true quando a página foi rolada além de `offset` px. */
export function useScrolled(offset = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}

/** Seção visível no momento (para destacar o item do menu). */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

/** Bloqueia a rolagem da página (menu mobile, lightbox). */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    html.style.paddingRight = scrollbar ? `${scrollbar}px` : "";
    return () => {
      html.style.overflow = prev;
      html.style.paddingRight = "";
    };
  }, [locked]);
}

/** Dispositivo com ponteiro preciso (mouse) — habilita efeitos de hover 3D. */
export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

interface OpenStatus {
  ready: boolean;
  isOpen: boolean;
  label: string;
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Status "Aberto agora / Fechado" calculado no fuso de Divinópolis (Brasília). */
export function useOpenStatus(): OpenStatus {
  const [status, setStatus] = useState<OpenStatus>({ ready: false, isOpen: false, label: "" });
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const compute = () => {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: site.hours.timeZone,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date());
      const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
      const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
      const now = Number(get("hour")) * 60 + Number(get("minute"));
      const open = toMinutes(site.hours.open);
      const close = toMinutes(site.hours.close);
      const openToday = (site.hours.days as readonly number[]).includes(dayIndex);
      const isOpen = openToday && now >= open && now < close;
      const openLabel = site.hours.open.replace(":00", "h");
      const label = isOpen
        ? `Aberto agora · até as ${site.hours.close.replace(":00", "h")}`
        : now < open && openToday
          ? `Fechado agora · abrimos hoje às ${openLabel}`
          : `Fechado agora · abrimos às ${openLabel}`;
      setStatus({ ready: true, isOpen, label });
    };
    compute();
    timer.current = window.setInterval(compute, 60_000);
    return () => window.clearInterval(timer.current);
  }, []);

  return status;
}
