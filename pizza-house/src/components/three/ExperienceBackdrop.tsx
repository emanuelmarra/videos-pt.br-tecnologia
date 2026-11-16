"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Picture } from "@/components/ui/Picture";
import { clamp01, experience } from "./state";

const PizzaScene = dynamic(() => import("./PizzaScene"), { ssr: false });

/**
 * Decide se o aparelho roda o 3D com fluidez: exige WebGL com aceleração de
 * hardware (sem renderização por software, comum em máquinas sem placa de vídeo).
 * Use ?3d=1 no endereço para forçar a cena 3D (testes/demonstração).
 */
function canRun3D() {
  try {
    if (new URLSearchParams(window.location.search).get("3d") === "1") return true;
    const nav = navigator as Navigator & { deviceMemory?: number };
    if ((nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2) return false;
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

/**
 * Fundo fixo do início da página: a pizza 3D acompanha o hero e a seção
 * "experiência". É carregada depois da página (não atrasa o primeiro conteúdo)
 * e, sem WebGL, dá lugar à fotografia da marguerita.
 */
export function ExperienceBackdrop() {
  const wrap = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "3d" | "photo">("pending");
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    experience.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canRun3D()) {
      setMode("photo");
      return;
    }
    const start = () => setMode("3d");
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: object) => number }).requestIdleCallback;
    if (idle) idle(start, { timeout: 1200 });
    else window.setTimeout(start, 400);
  }, []);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const story = document.getElementById("experiencia");
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!hero || !story) return;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const top = story.offsetTop;
      const len = Math.max(1, story.offsetHeight - vh);
      experience.scrollPx = y;
      experience.vh = vh;
      experience.enter = clamp01(y / Math.max(1, hero.offsetHeight));
      experience.story = clamp01((y - top) / len);
      const fade = clamp01((y - (top + len)) / (vh * 0.7));
      if (wrap.current) wrap.current.style.setProperty("--fade", String(1 - fade));
      setActive(fade < 1);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onPointer = (e: PointerEvent) => {
      experience.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      experience.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 bg-[#070504] opacity-[var(--fade,1)]"
      style={{ ["--fade" as string]: 1 }}
    >
      {/* brilho do forno e vinheta */}
      <div className="absolute inset-0 bg-[radial-gradient(55%_60%_at_72%_52%,rgb(193_139_74/0.20),transparent_70%)] max-lg:bg-[radial-gradient(80%_45%_at_50%_30%,rgb(193_139_74/0.22),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgb(0_0_0/0.6))]" />

      {mode === "3d" && (
        <div className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}>
          <PizzaScene active={active} onReady={() => setReady(true)} />
        </div>
      )}

      {mode === "photo" && (
        <div className="absolute inset-x-0 top-0 h-[62%] animate-[fade-in_1.2s_ease-out_both] lg:inset-y-0 lg:left-auto lg:h-full lg:w-[52%]">
          <Picture image="hero-pizza" alt="" sizes="(min-width: 1024px) 52vw, 100vw" className="h-full w-full" imgClassName="object-[30%_50%] lg:object-left" />
          <div className="absolute inset-0 bg-linear-to-t from-[#070504] via-[#070504]/30 to-transparent lg:bg-linear-to-r lg:via-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-[#070504]/75 to-transparent" />
        </div>
      )}
    </div>
  );
}
