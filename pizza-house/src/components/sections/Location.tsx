"use client";

import { Bike, Clock, MapPin, Navigation, Phone, ShoppingBag, Store } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { mapsLinks, site } from "@/config/site";
import { useOpenStatus } from "@/lib/hooks";
import { external, whatsappLink, whatsappMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

const services = [
  { icon: Store, label: "Salão" },
  { icon: ShoppingBag, label: "Retirada" },
  { icon: Bike, label: "Delivery" },
];

export function Location() {
  const status = useOpenStatus();
  const hasStreet = Boolean(site.address.street);

  return (
    <section id="contato" aria-labelledby="contato-titulo" className="bg-paper section-pad relative overflow-hidden text-espresso">
      <div className="container-site">
        <SectionHeading
          id="contato-titulo"
          tone="light"
          eyebrow="Localização e horários"
          title={
            <>
              Venha nos visitar <em className="text-wood">em Divinópolis.</em>
            </>
          }
          intro="Aberta todos os dias, das 18h às 23h. No salão, para retirada ou no conforto da sua casa."
          className="max-w-3xl"
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1" stagger={0.08}>
            <RevealItem>
              <InfoCard icon={MapPin} title="Endereço">
                {hasStreet && (
                  <p className="text-lg text-espresso">
                    {site.address.street}
                    {site.address.neighborhood && <span className="text-[#5b4232]"> — {site.address.neighborhood}</span>}
                  </p>
                )}
                <p className={cn(hasStreet ? "text-[#5b4232]" : "text-lg text-espresso")}>
                  {site.address.city} — {site.address.state}
                </p>
                <a
                  href={mapsLinks.directions}
                  {...external}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-wood underline-offset-4 hover:underline"
                >
                  <Navigation size={15} aria-hidden="true" />
                  Como chegar
                  <span className="sr-only">(abre o Google Maps em nova aba)</span>
                </a>
              </InfoCard>
            </RevealItem>

            <RevealItem>
              <InfoCard icon={Clock} title="Horário de funcionamento">
                <p className="text-lg text-espresso">{site.hours.label}</p>
                <p className="text-[#5b4232]">das {site.hours.display}</p>
                <p className="mt-3 min-h-7" aria-live="polite">
                  {status.ready && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                        status.isOpen ? "bg-emerald-700/10 text-emerald-800" : "bg-wood/10 text-wood",
                      )}
                    >
                      <span className="relative flex size-2">
                        {status.isOpen && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-600 opacity-60" />}
                        <span className={cn("relative inline-flex size-2 rounded-full", status.isOpen ? "bg-emerald-600" : "bg-wood/60")} />
                      </span>
                      {status.label}
                    </span>
                  )}
                </p>
              </InfoCard>
            </RevealItem>

            <RevealItem>
              <InfoCard icon={Phone} title="Telefone e WhatsApp">
                <p className="text-lg text-espresso">{site.phone.display}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <ButtonLink href={whatsappLink(whatsappMessages.order)} icon="whatsapp" size="sm" data-cta="contact-whatsapp">
                    WhatsApp
                  </ButtonLink>
                  <ButtonLink href={`tel:${site.phone.e164}`} variant="outline-dark" size="sm" icon={<Phone size={16} aria-hidden="true" />}>
                    Ligar
                  </ButtonLink>
                </div>
              </InfoCard>
            </RevealItem>

            <RevealItem>
              <InfoCard icon={Store} title="Formas de atendimento">
                <ul className="flex flex-wrap gap-2">
                  {services.map((s) => (
                    <li key={s.label} className="inline-flex items-center gap-2 rounded-full border border-wood/20 bg-warm/70 px-3.5 py-1.5 text-sm text-espresso">
                      <s.icon size={15} className="text-wood" aria-hidden="true" />
                      {s.label}
                    </li>
                  ))}
                </ul>
              </InfoCard>
            </RevealItem>
          </RevealGroup>

          <Reveal delay={0.1} className="lg:col-span-7">
            <MapEmbed />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ icon: Icon, title, children }: { icon: typeof MapPin; title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full gap-4 rounded-[1.5rem] border border-wood/15 bg-warm/60 p-5 shadow-[0_20px_50px_-35px_rgb(117_68_38/0.6)] transition-colors duration-500 hover:border-wood/35 sm:p-6">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-espresso text-gold">
        <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h3 className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.22em] text-wood">{title}</h3>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

/**
 * Mapa com carregamento sob demanda: só baixa o Google Maps quando a pessoa pede
 * (página mais rápida e sem cookies de terceiros antes do clique).
 */
function MapEmbed() {
  const [load, setLoad] = useState(false);
  return (
    <div className="relative h-full min-h-[24rem] overflow-hidden rounded-[2rem] border border-wood/20 bg-espresso shadow-[0_40px_80px_-45px_rgb(40_23_15/0.8)] lg:min-h-[34rem]">
      {load ? (
        <iframe
          src={mapsLinks.embed}
          title={`Mapa: localização da ${site.name} em ${site.address.city}`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <>
          <MapArt />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-6 text-center">
            <div className="relative">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-gold/60" aria-hidden="true" />
              <span className="relative grid size-16 place-items-center rounded-full bg-gold text-ink shadow-2xl">
                <MapPin size={28} strokeWidth={1.8} aria-hidden="true" />
              </span>
            </div>
            <div>
              <p className="font-serif text-3xl text-cream">{site.name}</p>
              <p className="mt-1 text-sm text-cream/70">
                {[site.address.street, site.address.neighborhood].filter(Boolean).join(" — ")}
                {site.address.street ? " · " : ""}
                {site.address.city} — {site.address.state}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={() => setLoad(true)} className="btn btn-gold btn-sm">
                <MapPin size={16} aria-hidden="true" />
                Carregar mapa interativo
              </button>
              <ButtonLink href={mapsLinks.search} variant="outline" size="sm" icon={<Navigation size={16} aria-hidden="true" />}>
                Abrir no Google Maps
              </ButtonLink>
            </div>
          </div>
        </>
      )}
      {load && (
        <a
          href={mapsLinks.directions}
          {...external}
          className="btn btn-gold btn-sm absolute bottom-4 left-4 shadow-xl"
        >
          <Navigation size={16} aria-hidden="true" />
          Traçar rota
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      )}
    </div>
  );
}

/** Ilustração de mapa (ruas estilizadas) usada antes de carregar o Google Maps. */
function MapArt() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="map-glow" cx="50%" cy="48%" r="55%">
          <stop offset="0" stopColor="#3a2416" />
          <stop offset="1" stopColor="#170d08" />
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="url(#map-glow)" />
      <g stroke="#c18b4a" strokeOpacity="0.16" fill="none">
        {Array.from({ length: 14 }, (_, i) => (
          <path key={`h${i}`} d={`M-20 ${i * 48 + 10} C200 ${i * 48 + (i % 2 ? 40 : -20)}, 520 ${i * 48 + (i % 3 ? -30 : 50)}, 820 ${i * 48 + 20}`} strokeWidth={i % 4 === 0 ? 7 : 2} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <path key={`v${i}`} d={`M${i * 74 - 20} -20 C${i * 74 + (i % 2 ? 50 : -40)} 220, ${i * 74 + (i % 3 ? -30 : 60)} 420, ${i * 74 + 30} 620`} strokeWidth={i % 5 === 0 ? 7 : 2} />
        ))}
      </g>
      <path d="M-20 420 C180 380 300 470 470 400 S720 300 820 330" stroke="#c18b4a" strokeOpacity="0.35" strokeWidth="10" fill="none" />
      <circle cx="400" cy="290" r="150" fill="#c18b4a" opacity="0.06" />
    </svg>
  );
}
