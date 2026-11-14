/**
 * ============================================================================
 *  CONFIGURAÇÃO CENTRAL DA PIZZA HOUSE
 *  Todas as informações do negócio ficam aqui. Edite este arquivo para
 *  atualizar telefone, horários, endereço, redes sociais e avaliações.
 * ============================================================================
 */

export const site = {
  name: "Pizza House",
  legalName: "Pizza House Divinópolis",
  tagline: "Pizzaria artesanal em Divinópolis — MG",
  description:
    "Pizzaria artesanal em Divinópolis — MG. Massa leve, ingredientes selecionados e recheios generosos. Salão, retirada e delivery todos os dias, das 18h às 23h. Peça pelo WhatsApp.",
  foundedYear: 2020,

  /**
   * Domínio definitivo do site (usado em SEO, sitemap e compartilhamento).
   * ➜ Defina a variável de ambiente NEXT_PUBLIC_SITE_URL na hospedagem,
   *   por exemplo: https://www.seudominio.com.br
   */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ?? // Vercel
    process.env.URL ?? // Netlify
    process.env.CF_PAGES_URL ?? // Cloudflare Pages
    "http://localhost:3000"
  ).replace(/\/$/, ""),

  /** Telefone exibido no site e usado no link "Ligar". */
  phone: {
    display: "(37) 3214-7992",
    e164: "+553732147992",
  },

  /** Número oficial de WhatsApp (somente dígitos, com DDI 55 + DDD). */
  whatsapp: {
    number: "553732147992",
    display: "(37) 3214-7992",
    defaultMessage: "Olá! Vim pelo site da Pizza House e gostaria de fazer um pedido.",
  },

  /**
   * Endereço.
   * ⚠ Rua, número e bairro foram lidos do card do Google publicado no Instagram
   *   da Pizza House ("R. Ibirité, 230 - Bom Pastor"). Confirme antes de publicar.
   *   Para ocultar, deixe `street` e `neighborhood` como string vazia ("").
   */
  address: {
    street: "R. Ibirité, 230",
    neighborhood: "Bom Pastor",
    city: "Divinópolis",
    state: "MG",
    country: "BR",
    postalCode: "", // CEP — preencher quando confirmado
  },

  /** Horário de funcionamento (informado: todos os dias, das 18h às 23h). */
  hours: {
    label: "Todos os dias",
    open: "18:00",
    close: "23:00",
    display: "18h às 23h",
    /** 0 = domingo … 6 = sábado */
    days: [0, 1, 2, 3, 4, 5, 6],
    timeZone: "America/Sao_Paulo",
  },

  /** Reservas para eventos e confraternizações: de segunda (1) a quinta (4). */
  reservations: {
    days: [1, 2, 3, 4],
    label: "Segunda a quinta-feira",
  },

  services: ["Salão", "Retirada", "Delivery"],

  /** Reputação no Google (informada: nota 4,9 com mais de mil avaliações). */
  rating: {
    value: 4.9,
    best: 5,
    count: 1000,
    countLabel: "Mais de mil avaliações",
    source: "Google",
  },

  social: {
    /**
     * Perfil oficial do Instagram — ex.: "https://www.instagram.com/usuario/".
     * Enquanto estiver vazio, os links de Instagram ficam ocultos.
     */
    instagram: "",
    instagramHandle: "", // ex.: "@usuario"
  },

  maps: {
    /**
     * Opcional: cole aqui o link de incorporação oficial do Google Maps
     * (Google Maps ➜ Compartilhar ➜ Incorporar um mapa ➜ copiar o src do iframe).
     * Se vazio, o mapa é gerado a partir do nome e endereço abaixo.
     */
    embedUrl: "",
    /** Opcional: link direto do perfil no Google (para avaliar / ver avaliações). */
    reviewsUrl: "",
  },
} as const;

export type Site = typeof site;

/** Endereço em uma linha, apenas com as partes preenchidas. */
export function fullAddress() {
  const { street, neighborhood, city, state } = site.address;
  const first = [street, neighborhood].filter(Boolean).join(" — ");
  return [first, `${city} — ${state}`].filter(Boolean).join(", ");
}

export const mapsQuery = [site.name, site.address.street, site.address.neighborhood, `${site.address.city} - ${site.address.state}`]
  .filter(Boolean)
  .join(", ");

export const mapsLinks = {
  search: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`,
  directions: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`,
  embed: site.maps.embedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery)}&z=16&output=embed`,
  reviews: site.maps.reviewsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`,
};

export const navLinks = [
  { href: "#inicio", label: "Início" },
  { href: "#historia", label: "Nossa história" },
  { href: "#cardapio", label: "Cardápio" },
  { href: "#galeria", label: "Galeria" },
  { href: "#contato", label: "Contato" },
] as const;
