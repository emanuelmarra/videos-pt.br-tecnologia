import { ArrowUp, CalendarDays, Clock, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Ornament } from "@/components/ui/Ornament";
import { fullAddress, mapsLinks, navLinks, site } from "@/config/site";
import { external, whatsappLink, whatsappMessages } from "@/lib/whatsapp";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-char pt-20 text-cream/70" aria-labelledby="rodape-titulo">
      <h2 id="rodape-titulo" className="sr-only">
        Rodapé — Pizza House Divinópolis
      </h2>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-gold/40 to-transparent" aria-hidden="true" />
      <div className="container-site">
        <div className="grid gap-12 pb-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Logo className="w-40 text-cream" />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed">
              Pizzaria artesanal em Divinópolis — MG desde {site.foundedYear}. Massa leve, ingredientes selecionados e recheios
              generosos, no salão, para retirada ou no delivery.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink href={whatsappLink(whatsappMessages.order)} icon="whatsapp" size="sm" data-cta="footer-whatsapp">
                Pedir pelo WhatsApp
              </ButtonLink>
              {site.social.instagram && (
                <a
                  href={site.social.instagram}
                  {...external}
                  className="grid size-11 place-items-center rounded-full border border-cream/15 text-cream transition-colors hover:border-gold hover:text-gold"
                  aria-label={`Instagram da Pizza House ${site.social.instagramHandle} (abre em nova aba)`}
                >
                  <InstagramIcon size={19} />
                </a>
              )}
            </div>
          </div>

          <nav className="lg:col-span-2" aria-label="Navegação do rodapé">
            <h3 className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-gold">Navegação</h3>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="link-underline transition-colors hover:text-cream">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#reservas" className="link-underline transition-colors hover:text-cream">
                  Reservas
                </a>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-gold">Contato</h3>
            <ul className="mt-5 space-y-4 text-[0.95rem]">
              <li>
                <a href={`tel:${site.phone.e164}`} className="flex items-start gap-3 transition-colors hover:text-cream">
                  <Phone size={17} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-cream/60">Telefone</span>
                    {site.phone.display}
                  </span>
                </a>
              </li>
              <li>
                <a href={whatsappLink(whatsappMessages.order)} {...external} className="flex items-start gap-3 transition-colors hover:text-cream">
                  <WhatsAppIcon size={17} className="mt-0.5 shrink-0 text-gold" />
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-cream/60">WhatsApp</span>
                    {site.whatsapp.display}
                  </span>
                </a>
              </li>
              <li>
                <a href={mapsLinks.search} {...external} className="flex items-start gap-3 transition-colors hover:text-cream">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  <span>
                    <span className="block text-xs uppercase tracking-wider text-cream/60">Endereço</span>
                    {fullAddress()}
                  </span>
                </a>
              </li>
              {site.social.instagram && (
                <li>
                  <a href={site.social.instagram} {...external} className="flex items-start gap-3 transition-colors hover:text-cream">
                    <InstagramIcon size={17} className="mt-0.5 shrink-0 text-gold" />
                    <span>
                      <span className="block text-xs uppercase tracking-wider text-cream/60">Instagram</span>
                      {site.social.instagramHandle || "Siga a Pizza House"}
                    </span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-gold">Funcionamento</h3>
            <ul className="mt-5 space-y-4 text-[0.95rem]">
              <li className="flex items-start gap-3">
                <Clock size={17} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  <span className="block text-cream">{site.hours.label}</span>
                  {site.hours.display}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CalendarDays size={17} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <span>
                  <span className="block text-cream">Reservas para eventos</span>
                  {site.reservations.label}
                </span>
              </li>
            </ul>
            <p className="mt-6 text-sm text-cream/50">{site.services.join(" · ")}</p>
          </div>
        </div>

        <Ornament className="opacity-60" />

        <div className="flex flex-col items-center justify-between gap-4 py-8 text-center text-xs text-cream/60 sm:flex-row sm:text-left">
          <p>
            © {year} {site.name} · {site.address.city} — {site.address.state}. Todos os direitos reservados.
          </p>
          <a href="#inicio" className="group inline-flex items-center gap-2 rounded-full px-3 py-2 transition-colors hover:text-cream">
            Voltar ao topo
            <ArrowUp size={14} className="transition-transform duration-500 group-hover:-translate-y-1" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
