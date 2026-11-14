"use client";

import { AnimatePresence, m } from "framer-motion";
import { AlertCircle, CalendarDays, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

const weekdays = [
  { short: "Seg", day: 1 },
  { short: "Ter", day: 2 },
  { short: "Qua", day: 3 },
  { short: "Qui", day: 4 },
  { short: "Sex", day: 5 },
  { short: "Sáb", day: 6 },
  { short: "Dom", day: 0 },
];
const weekdayNames = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const occasions = [
  { label: "Confraternização", phrase: "uma confraternização" },
  { label: "Aniversário", phrase: "um aniversário" },
  { label: "Encontro de amigos", phrase: "um encontro de amigos" },
  { label: "Reunião de família", phrase: "uma reunião de família" },
  { label: "Outro", phrase: "um evento" },
];

export function Reservations() {
  const [occasion, setOccasion] = useState<string>("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState<number | "">("");

  const parsed = useMemo(() => {
    if (!date) return null;
    const [y, m, d] = date.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return { label: `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`, weekday: dt.getDay() };
  }, [date]);

  const outsideDays = parsed !== null && !(site.reservations.days as readonly number[]).includes(parsed.weekday);

  const message = useMemo(() => {
    if (!occasion && !parsed && !people) return whatsappMessages.reservation;
    const parts = ["Olá! Vim pelo site da Pizza House e gostaria de consultar a disponibilidade de reserva"];
    parts.push(` para ${occasions.find((o) => o.label === occasion)?.phrase ?? "um evento"}`);
    if (parsed) parts.push(` no dia ${parsed.label} (${weekdayNames[parsed.weekday]})`);
    if (people) parts.push(`, para ${people} ${people === 1 ? "pessoa" : "pessoas"}`);
    return parts.join("") + ".";
  }, [occasion, parsed, people]);

  // data mínima = hoje (calculada no navegador, não no build)
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  useEffect(() => {
    const t = new Date();
    setMinDate(`${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`);
  }, []);

  return (
    <section id="reservas" aria-labelledby="reservas-titulo" className="section-pad relative overflow-hidden bg-ink">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_10%_80%,rgb(117_68_38/0.35),transparent_70%)]" aria-hidden="true" />
      <div className="container-site relative grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-6">
          <Reveal>
            <Eyebrow>Reservas e confraternizações</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="reservas-titulo" className="mt-5 text-[2.6rem] leading-[1.02] text-cream sm:text-5xl lg:text-[3.9rem]">
              Momentos especiais merecem <em className="text-gradient-gold">uma Pizza House.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/75">
              Está planejando uma confraternização, um encontro com amigos ou uma comemoração especial? Entre em contato e consulte as
              possibilidades de reserva.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-9 rounded-[1.5rem] border border-gold/25 bg-linear-to-br from-gold/[0.09] to-transparent p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-gold text-ink">
                  <CalendarDays size={22} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-serif text-2xl leading-tight text-cream">Reservas de segunda a quinta-feira</p>
                  <p className="mt-1 text-sm text-cream/65">Aceitamos reservas para eventos e confraternizações nesses dias.</p>
                </div>
              </div>
              <ul className="mt-6 grid grid-cols-7 gap-1.5 sm:gap-2" aria-label="Dias com reservas para eventos">
                {weekdays.map((w) => {
                  const on = (site.reservations.days as readonly number[]).includes(w.day);
                  return (
                    <li
                      key={w.short}
                      className={cn(
                        "rounded-xl py-2.5 text-center text-xs font-bold uppercase tracking-wider sm:text-sm",
                        on ? "bg-gold/90 text-ink" : "border border-cream/10 text-cream/55",
                      )}
                    >
                      {w.short}
                      <span className="sr-only">{on ? " — aceita reservas" : " — sem reservas para eventos"}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>

          {/* Montador de mensagem: os dados só preenchem o texto do WhatsApp */}
          <Reveal delay={0.26}>
            <form
              className="mt-6 rounded-[1.5rem] border border-cream/10 bg-cream/[0.03] p-6 sm:p-7"
              onSubmit={(e) => {
                e.preventDefault();
                window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
              }}
              aria-describedby="reserva-ajuda"
            >
              <p id="reserva-ajuda" className="text-sm text-cream/60">
                Se quiser, adiantamos os detalhes — tudo é opcional e vai direto na sua mensagem do WhatsApp.
              </p>

              <fieldset className="mt-5">
                <legend className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold">Ocasião</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {occasions.map(({ label: o }) => {
                    const active = occasion === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setOccasion(active ? "" : o)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm transition-all duration-300",
                          active ? "border-gold bg-gold text-ink" : "border-cream/15 text-cream/75 hover:border-gold/60 hover:text-cream",
                        )}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold">Data desejada</span>
                  <input
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-2 block h-12 w-full rounded-xl border border-cream/15 bg-ink/70 px-4 text-cream [color-scheme:dark] focus:border-gold focus:outline-none"
                  />
                </label>
                <div>
                  <span id="pessoas-label" className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-gold">
                    Número de pessoas
                  </span>
                  <div className="mt-2 flex h-12 items-center rounded-xl border border-cream/15 bg-ink/70" role="group" aria-labelledby="pessoas-label">
                    <button
                      type="button"
                      onClick={() => setPeople((p) => (p === "" || p <= 1 ? "" : p - 1))}
                      className="grid h-full w-12 place-items-center text-cream/70 hover:text-gold"
                      aria-label="Diminuir número de pessoas"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={200}
                      placeholder="—"
                      value={people}
                      onChange={(e) => setPeople(e.target.value === "" ? "" : Math.max(1, Math.min(200, Number(e.target.value))))}
                      className="h-full w-full min-w-0 flex-1 appearance-none bg-transparent text-center text-cream [appearance:textfield] placeholder:text-cream/40 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
                      aria-labelledby="pessoas-label"
                    />
                    <button
                      type="button"
                      onClick={() => setPeople((p) => (p === "" ? 2 : Math.min(200, p + 1)))}
                      className="grid h-full w-12 place-items-center text-cream/70 hover:text-gold"
                      aria-label="Aumentar número de pessoas"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {outsideDays && (
                  <m.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2 overflow-hidden pt-4 text-sm text-gold-light"
                    role="status"
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    As reservas para eventos acontecem de segunda a quinta-feira. Você pode escolher outra data ou falar com a gente mesmo
                    assim.
                  </m.p>
                )}
              </AnimatePresence>

              <ButtonLink href={whatsappLink(message)} icon="whatsapp" className="mt-6 w-full whitespace-normal text-center sm:w-auto sm:whitespace-nowrap" data-cta="reservation-whatsapp">
                Consultar disponibilidade pelo WhatsApp
              </ButtonLink>
            </form>
          </Reveal>
        </div>

        {/* Fotografias do ambiente */}
        <div className="relative mx-auto w-full min-w-0 max-w-md lg:col-span-6 lg:max-w-none lg:pl-10">
          <Reveal y={50} className="relative">
            <div className="overflow-hidden rounded-t-[12rem] rounded-b-[2rem] border border-gold/20 shadow-[0_50px_100px_-50px_rgb(0_0_0/0.9)]">
              <Picture
                image="salao"
                alt="Salão aconchegante da Pizza House, com parede de tijolinhos e mesa servida"
                sizes="(min-width: 1024px) 34rem, 90vw"
                className="aspect-[4/5]"
              />
            </div>
          </Reveal>
          <Reveal y={40} delay={0.15} className="absolute -bottom-8 -left-4 w-[52%] sm:-left-10 lg:-left-2">
            <div className="overflow-hidden rounded-2xl border-[5px] border-ink shadow-2xl">
              <Picture image="doces-trio" alt="Pizzas doces para celebrar" sizes="(min-width: 1024px) 18rem, 45vw" className="aspect-square" />
            </div>
          </Reveal>
          <Reveal delay={0.3} className="absolute right-3 top-8 sm:right-0 lg:right-2">
            <div className="rounded-2xl border border-gold/30 bg-ink/85 px-5 py-4 text-center shadow-xl backdrop-blur">
              <span className="block font-serif text-4xl leading-none text-gold-light">Seg–Qui</span>
              <span className="mt-1 block text-[0.65rem] font-bold uppercase tracking-[0.2em] text-cream/60">eventos e reservas</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
