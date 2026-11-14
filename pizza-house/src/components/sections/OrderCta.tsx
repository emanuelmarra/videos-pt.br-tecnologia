import { Clock, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { site } from "@/config/site";
import { whatsappLink, whatsappMessages } from "@/lib/whatsapp";

/** Chamada final para pedido — o WhatsApp como caminho principal. */
export function OrderCta() {
  return (
    <section aria-labelledby="pedido-titulo" className="relative overflow-hidden bg-ink py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_50%,rgb(193_139_74/0.16),transparent_70%)]" aria-hidden="true" />
      <div className="container-site relative grid items-center gap-12 md:grid-cols-[1fr_auto] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Peça agora</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 id="pedido-titulo" className="mt-5 max-w-2xl text-[2.6rem] leading-[1.02] text-cream sm:text-5xl lg:text-6xl">
              Bateu a vontade? <em className="text-gradient-gold">A sua pizza está a uma mensagem.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 flex items-center gap-2 text-cream/70">
              <Clock size={16} className="text-gold" aria-hidden="true" />
              {site.hours.label}, {site.hours.display} · {site.services.join(", ").replace(/, ([^,]*)$/, " e $1")}
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={whatsappLink(whatsappMessages.order)} icon="whatsapp" data-cta="final-whatsapp">
              Pedir pelo WhatsApp
            </ButtonLink>
            <ButtonLink href={`tel:${site.phone.e164}`} variant="outline" icon={<Phone size={18} aria-hidden="true" />}>
              Ligar {site.phone.display}
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal y={40} delay={0.1} className="mx-auto w-56 sm:w-64 lg:w-72">
          <div className="relative">
            <span className="absolute -inset-3 rounded-full border border-gold/25" aria-hidden="true" />
            <span className="absolute -inset-7 rounded-full border border-gold/10" aria-hidden="true" />
            <div className="overflow-hidden rounded-full border border-gold/30 shadow-[0_40px_80px_-40px_rgb(193_139_74/0.6)]">
              <Picture
                image="pedido-telefone"
                alt="Cliente sorrindo enquanto faz um pedido pelo celular"
                sizes="18rem"
                className="aspect-square"
                imgClassName="object-[50%_22%]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
