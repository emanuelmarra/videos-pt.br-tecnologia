import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Marquee } from "@/components/sections/Marquee";
import { Story } from "@/components/sections/Story";
import { ExperienceBackdrop } from "@/components/three/ExperienceBackdrop";
import { Cursor } from "@/components/ui/Cursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { Combo } from "@/components/sections/Combo";
import { Features } from "@/components/sections/Features";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { Menu } from "@/components/sections/Menu";
import { OrderCta } from "@/components/sections/OrderCta";
import { Reservations } from "@/components/sections/Reservations";
import { Reviews } from "@/components/sections/Reviews";

export default function Home() {
  return (
    <>
      <ExperienceBackdrop />
      <Header />
      <main id="conteudo">
        <Hero />
        <Story />
        <Marquee />
        <About />
        <Features />
        <Menu />
        <Combo />
        <Gallery />
        <Reviews />
        <Reservations />
        <Location />
        <OrderCta />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <Cursor />
    </>
  );
}
