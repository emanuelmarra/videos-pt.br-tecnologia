"use client";

import { AnimatePresence, m, useMotionTemplate, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Move, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/icons";
import { Picture } from "@/components/ui/Picture";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";
import { gallery } from "@/data/gallery";
import { useLockBodyScroll } from "@/lib/hooks";
import { getImage } from "@/lib/images";
import { cn } from "@/lib/cn";

const N = gallery.length;
const STEP = 360 / N;

/**
 * Galeria em carrossel 3D: as fotos formam um anel que gira com a rolagem
 * (e com o arrasto). Clique em uma foto para ampliar.
 */
export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const [front, setFront] = useState(0);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const section = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const dragState = useRef({ active: false, startX: 0, start: 0, moved: false });

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const scrollRot = useTransform(scrollYProgress, [0.05, 0.95], [0, -(360 - STEP)]);
  const drag = useMotionValue(0);
  const rot = useMotionValue(0);
  const smoothRot = useSpring(rot, { stiffness: 80, damping: 20, mass: 0.7 });
  useMotionValueEvent(scrollRot, "change", (v) => rot.set(v + drag.get()));
  useMotionValueEvent(drag, "change", (v) => rot.set(scrollRot.get() + v));

  const paint = useCallback((r: number) => {
    let best = 0;
    let bestCos = -2;
    cards.current.forEach((el, i) => {
      if (!el) return;
      const ang = ((((i * STEP + r) % 360) + 540) % 360) - 180;
      const c = Math.cos((ang * Math.PI) / 180);
      el.style.filter = `brightness(${(0.42 + 0.58 * Math.max(0, c)).toFixed(3)})`;
      el.style.opacity = c < -0.25 ? "0.28" : "1";
      el.style.zIndex = String(Math.round((c + 1) * 50));
      if (c > bestCos) {
        bestCos = c;
        best = i;
      }
    });
    setFront((f) => (f === best ? f : best));
  }, []);
  useMotionValueEvent(smoothRot, "change", paint);
  useEffect(() => paint(0), [paint]);

  const ringTransform = useMotionTemplate`translateZ(calc(var(--radius) * -1)) rotateX(-7deg) rotateY(${smoothRot}deg)`;

  // arrastar para girar (mouse e toque horizontal)
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = dragState.current;
      if (!d.active) return;
      const dx = e.clientX - d.startX;
      if (Math.abs(dx) > 6) d.moved = true;
      drag.set(d.start + dx * 0.28);
    };
    const up = () => {
      dragState.current.active = false;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [drag]);

  const current = gallery[front];

  return (
    <section id="galeria" ref={section} aria-labelledby="galeria-titulo" className="bg-paper relative h-[300vh] text-espresso lg:h-[340vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_58%,rgb(255_249_240/0.95),transparent_70%)]" aria-hidden="true" />
        <div className="container-site relative pt-24 sm:pt-28">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              id="galeria-titulo"
              tone="light"
              eyebrow="Galeria"
              title={
                <>
                  Feita para ser vista. <em className="text-wood">E saboreada.</em>
                </>
              }
              className="max-w-2xl [&_h2]:text-[2.3rem] sm:[&_h2]:text-5xl lg:[&_h2]:text-[3.6rem]"
            />
            {site.social.instagram && (
              <ButtonLink href={site.social.instagram} variant="outline-dark" icon={<InstagramIcon size={18} />}>
                Siga no Instagram
              </ButtonLink>
            )}
          </div>
        </div>

        <div
          className="ring-stage relative min-h-0 flex-1 touch-pan-y select-none [--card-w:190px] [--radius:330px] sm:[--card-w:240px] sm:[--radius:420px] lg:[--card-w:290px] lg:[--radius:520px]"
          onPointerDown={(e) => {
            dragState.current = { active: true, startX: e.clientX, start: drag.get(), moved: false };
          }}
          data-cursor="Arraste"
        >
          <span className="pointer-events-none absolute bottom-[8%] left-1/2 h-10 w-[70%] max-w-3xl -translate-x-1/2 rounded-[50%] bg-espresso/25 blur-2xl" aria-hidden="true" />
          <m.div className="ring absolute left-1/2 top-[48%] h-0 w-0" style={{ transform: ringTransform }}>
            {gallery.map((item, i) => (
              <div
                key={item.image}
                ref={(el) => void (cards.current[i] = el)}
                className="ring-card absolute"
                style={{
                  width: "var(--card-w)",
                  height: "calc(var(--card-w) * 1.3)",
                  left: "calc(var(--card-w) / -2)",
                  top: "calc(var(--card-w) * -0.65)",
                  transform: `rotateY(${i * STEP}deg) translateZ(var(--radius))`,
                }}
              >
                <button
                  type="button"
                  data-cursor="Ver"
                  onClick={(e) => {
                    if (dragState.current.moved) return;
                    lastTrigger.current = e.currentTarget;
                    setIndex(i);
                  }}
                  className="group relative block h-full w-full overflow-hidden rounded-2xl bg-espresso/10 text-left shadow-[0_30px_60px_-30px_rgb(40_23_15/0.8)] ring-1 ring-wood/15"
                  aria-label={`Ampliar foto: ${item.caption}`}
                >
                  <Picture
                    image={item.image}
                    alt={item.alt}
                    sizes="(min-width: 1024px) 290px, (min-width: 640px) 240px, 190px"
                    className="pointer-events-none h-full w-full"
                    imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-premium)] group-hover:scale-[1.07]"
                  />
                  <span className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" aria-hidden="true" />
                  <span className="absolute inset-x-4 bottom-3 font-serif text-lg leading-tight text-cream sm:text-xl">{item.caption}</span>
                </button>
              </div>
            ))}
          </m.div>
        </div>

        <div className="container-site relative flex items-end justify-between gap-6 pb-8 sm:pb-10">
          <div aria-live="polite">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.26em] text-wood tabular-nums">
              {String(front + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </p>
            <p className="mt-1 font-serif text-2xl leading-tight text-espresso sm:text-3xl">{current.caption}</p>
          </div>
          <p className="hidden items-center gap-2 text-xs font-medium text-[#5b4232] sm:flex">
            <Move size={15} className="text-wood" aria-hidden="true" />
            Role ou arraste para girar
          </p>
        </div>
      </div>

      <Lightbox
        index={index}
        onClose={() => {
          setIndex(null);
          window.setTimeout(() => lastTrigger.current?.focus({ preventScroll: true }), 50);
        }}
        onChange={setIndex}
      />
    </section>
  );
}

function Lightbox({ index, onClose, onChange }: { index: number | null; onClose: () => void; onChange: (i: number) => void }) {
  const open = index !== null;
  const [dir, setDir] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);

  const go = useCallback(
    (step: number) => {
      if (index === null) return;
      setDir(step);
      onChange((index + step + gallery.length) % gallery.length);
    },
    [index, onChange],
  );

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Tab") {
        const els = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button") ?? []);
        const i = els.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          els[els.length - 1]?.focus();
        } else if (!e.shiftKey && i === els.length - 1) {
          e.preventDefault();
          els[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  };

  const item = index !== null ? gallery[index] : null;
  const img = item ? getImage(item.image) : null;

  return (
    <AnimatePresence>
      {item && img && (
        <m.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria de fotos: ${item.caption}`}
          data-lenis-prevent=""
          className="fixed inset-0 z-[70] flex flex-col bg-char/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center justify-between px-4 py-4 text-cream/70 sm:px-8">
            <span className="text-sm tabular-nums tracking-widest">
              {String(index! + 1).padStart(2, "0")} <span className="text-cream/50">/ {String(gallery.length).padStart(2, "0")}</span>
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="grid size-11 place-items-center rounded-full border border-cream/15 text-cream transition-colors hover:border-gold hover:text-gold"
              aria-label="Fechar galeria"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 sm:px-20" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <m.figure
                key={item.image}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d * 80, scale: 0.97 }),
                  center: { opacity: 1, x: 0, scale: 1 },
                  exit: (d: number) => ({ opacity: 0, x: d * -80, scale: 0.97 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={onDragEnd}
                className="flex max-h-full cursor-grab flex-col items-center active:cursor-grabbing"
              >
                <Picture
                  image={item.image}
                  alt={item.alt}
                  sizes="(min-width: 640px) 760px, 92vw"
                  className="overflow-hidden rounded-2xl shadow-2xl"
                  imgClassName="pointer-events-none max-h-[68vh] w-auto max-w-[min(92vw,760px)] object-contain sm:max-h-[72vh]"
                  placeholder={false}
                />
                <figcaption className="mt-4 max-w-xl text-center">
                  <span className="block font-serif text-2xl text-cream">{item.caption}</span>
                  <span className="mt-1 block text-sm text-cream/55">{item.alt}</span>
                </figcaption>
              </m.figure>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-cream/15 bg-ink/60 text-cream backdrop-blur transition-colors hover:border-gold hover:text-gold sm:grid lg:left-8"
              aria-label="Foto anterior"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-cream/15 bg-ink/60 text-cream backdrop-blur transition-colors hover:border-gold hover:text-gold sm:grid lg:right-8"
              aria-label="Próxima foto"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* miniaturas */}
          <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-5 pt-4 scrollbar-none sm:pb-7">
            {gallery.map((g, i) => (
              <button
                key={g.image}
                type="button"
                onClick={() => {
                  setDir(i > index! ? 1 : -1);
                  onChange(i);
                }}
                aria-label={`Ver foto ${i + 1}: ${g.caption}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "relative size-12 shrink-0 overflow-hidden rounded-lg transition-all duration-300 sm:size-14",
                  i === index ? "opacity-100 ring-2 ring-gold ring-offset-2 ring-offset-char" : "opacity-45 hover:opacity-80",
                )}
              >
                <Picture image={g.image} alt="" sizes="56px" className="h-full w-full" placeholder={false} />
              </button>
            ))}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
