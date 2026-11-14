import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { LogoSprite } from "@/components/brand/Logo";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { introScript, Preloader } from "@/components/layout/Preloader";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/config/site";
import "./globals.css";

const serif = localFont({
  src: [
    { path: "../fonts/cormorant-garamond-latin.woff2", style: "normal", weight: "300 700" },
    { path: "../fonts/cormorant-garamond-latin-italic.woff2", style: "italic", weight: "300 700" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const sans = localFont({
  src: "../fonts/manrope-latin.woff2",
  weight: "200 800",
  variable: "--font-manrope",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
});

const title = "Pizza House | Pizzaria Artesanal em Divinópolis — MG";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: "%s | Pizza House Divinópolis" },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "pizzaria em Divinópolis",
    "pizza artesanal em Divinópolis",
    "pizza artesanal Divinópolis MG",
    "Pizza House Divinópolis",
    "melhor pizza em Divinópolis",
    "delivery de pizza Divinópolis",
    "pizza doce Divinópolis",
    "pizzaria Bom Pastor Divinópolis",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  category: "restaurant",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: `${site.name} Divinópolis`,
    title,
    description: site.description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Pizza House — pizzaria artesanal em Divinópolis, MG" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: true, address: false, email: false },
  other: {
    "geo.region": "BR-MG",
    "geo.placename": "Divinópolis",
  },
};

export const viewport: Viewport = {
  themeColor: "#171412",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="grain">
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}.preloader{display:none!important}"}</style>
        </noscript>
        <LogoSprite />
        <Preloader />
        <a
          href="#conteudo"
          className="sr-only z-[110] rounded-full bg-gold px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Pular para o conteúdo
        </a>
        <MotionProvider>{children}</MotionProvider>
        <JsonLd />
      </body>
    </html>
  );
}
