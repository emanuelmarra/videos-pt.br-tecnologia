import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return []; // defina NEXT_PUBLIC_SITE_URL para gerar o sitemap
  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${site.url}/og-image.jpg`],
    },
  ];
}
