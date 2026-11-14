import type { NextConfig } from "next";

/**
 * Exportação 100% estática (pasta `out/`): pode ser publicada em qualquer
 * hospedagem — Vercel, Netlify, Cloudflare Pages, Hostinger, cPanel etc.
 * As imagens já são otimizadas previamente por `npm run images`.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // CSS crítico embutido no HTML: evita uma requisição bloqueante no primeiro acesso
  experimental: { inlineCss: true },
};

export default nextConfig;
