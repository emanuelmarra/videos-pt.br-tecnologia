import type { NextConfig } from "next";

/**
 * Exportação 100% estática (pasta `out/`): pode ser publicada em qualquer
 * hospedagem — Vercel, Netlify, Cloudflare Pages, Hostinger, cPanel etc.
 * As imagens já são otimizadas previamente por `npm run images`.
 */
// Pacote para abrir no computador / enviar à hospedagem: caminhos relativos (npm run pacote)
const relative = process.env.NEXT_PUBLIC_RELATIVE_ASSETS === "1";

const nextConfig: NextConfig = {
  output: "export",
  ...(relative ? { assetPrefix: "." } : {}),
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // CSS crítico embutido no HTML: evita uma requisição bloqueante no primeiro acesso
  experimental: { inlineCss: true },
};

export default nextConfig;
