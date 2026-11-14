"use client";

import { AnimatePresence, m, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/icons";
import { Picture } from "@/components/ui/Picture";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";
import { gallery } from "@/data/gallery";
import { useLockBodyScroll } from "@/lib/hooks";
import { getImage } from "@/lib/images";
import { cn } from "@/lib/cn";

const layout: Record<string, string> = {
  tall: "lg:row-span-2",
  wide: "lg:col-span-2",
};

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  return (
    <section id="galeria" aria-labelledby="galeria-titulo" className="bg-paper section-pad relative overflow-hidden text-espresso">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            id="galeria-titulo"
            tone="light"
            eyebrow="Galeria"
            title={
              <>
                Feita para ser vista. <em className="text-wood">E saboreada.</em>
              </>
            }
            className="max-w-2xl"
          />
          {site.social.instagram && (
            <ButtonLink href={site.social.instagram} variant="outline-dark" icon={<InstagramIcon size={18} />}>
              Siga no Instagram
            </ButtonLink>
          )}
        </div>

        <RevealGroup
          className="mt-14 grid auto-rows-[10.5rem] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[15rem] sm:gap-4 lg:mt-16 lg:auto-rows-[13.5rem] lg:grid-cols-4 xl:auto-rows-[15rem]"
          stagger={0.07}
          amount={0.05}
        >
          {gallery.map((item, i) => (
            <RevealItem
              key={item.image}
              className={cn(
                item.span && layout[item.span],
                item.mobileWide && (item.span === "wide" ? "col-span-2" : "col-span-2 lg:col-span-1"),
              )}
            >
              <button
                type="button"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setIndex(i);
                }}
                className="group relative block h-full w-full overflow-hidden rounded-2xl bg-espresso/10 text-left shadow-[0_20px_40px_-28px_rgb(40_23_15/0.7)] ring-1 ring-wood/10"
                aria-label={`Ampliar foto: ${item.caption}`}
              >
                <Picture
                  image={item.image}
                  alt={item.alt}
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="h-full w-full"
                  imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-premium)] group-hover:scale-[1.07]"
                />
                <span className="absolute inset-0 bg-linear-to-t from-ink/75 via-ink/0 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
                <span className="absolute inset-x-4 bottom-3.5 flex translate-y-1 items-end justify-between gap-3 transition-transform duration-500 group-hover:translate-y-0 sm:inset-x-5 sm:bottom-4">
                  <span className="font-serif text-lg leading-tight text-cream sm:text-xl">{item.caption}</span>
                  <span className="grid size-9 shrink-0 scale-75 place-items-center rounded-full bg-cream/90 text-ink opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" aria-hidden="true">
                    <Expand size={15} />
                  </span>
                </span>
              </button>
            </RevealItem>
          ))}
        </RevealGroup>
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
