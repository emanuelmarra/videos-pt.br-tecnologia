import { site } from "@/config/site";
import { flavors } from "@/data/menu";

/**
 * Dados estruturados Schema.org (Restaurant) — apenas informações confirmadas.
 * Obs.: a nota do Google não é marcada aqui de propósito: as diretrizes do Google
 * não permitem que um negócio marque avaliações sobre si mesmo em seu próprio site.
 */
export function JsonLd() {
  const url = site.url;
  const { street, neighborhood, city, state, country, postalCode } = site.address;

  const restaurant = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${url}/#restaurante`,
    name: site.name,
    alternateName: site.legalName,
    description: site.description,
    url: `${url}/`,
    image: [`${url}/og-image.jpg`],
    logo: `${url}/brand/icon-512.png`,
    telephone: site.phone.e164,
    servesCuisine: ["Pizza", "Pizza artesanal", "Pizza doce"],
    foundingDate: String(site.foundedYear),
    acceptsReservations: true,
    address: {
      "@type": "PostalAddress",
      ...(street ? { streetAddress: [street, neighborhood].filter(Boolean).join(" - ") } : {}),
      addressLocality: city,
      addressRegion: state,
      addressCountry: country,
      ...(postalCode ? { postalCode } : {}),
    },
    areaServed: { "@type": "City", name: `${city}, ${state}` },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: site.hours.open,
        closes: site.hours.close,
      },
    ],
    hasMenu: {
      "@type": "Menu",
      name: "Cardápio Pizza House",
      url: `${url}/#cardapio`,
      hasMenuSection: (["salgadas", "doces"] as const).map((cat) => ({
        "@type": "MenuSection",
        name: cat === "salgadas" ? "Pizzas salgadas" : "Pizzas doces",
        hasMenuItem: flavors
          .filter((f) => f.category === cat)
          .map((f) => ({ "@type": "MenuItem", name: `Pizza ${f.name}`, description: f.description })),
      })),
    },
    ...(site.social.instagram ? { sameAs: [site.social.instagram] } : {}),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#site`,
    name: `${site.name} Divinópolis`,
    url: `${url}/`,
    inLanguage: "pt-BR",
    publisher: { "@id": `${url}/#restaurante` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify([restaurant, website]).replace(/</g, "\\u003c") }}
    />
  );
}
