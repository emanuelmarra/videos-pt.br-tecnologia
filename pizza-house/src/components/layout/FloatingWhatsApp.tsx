"use client";

import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/icons";
import { external, whatsappLink, whatsappMessages } from "@/lib/whatsapp";

/** Botão flutuante de WhatsApp com convite discreto (exibido uma vez por sessão). */
export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [bubble, setBubble] = useState(false);

  useEffect(() => {
    const show = window.setTimeout(() => setVisible(true), 1600);
    let seen = false;
    try {
      seen = sessionStorage.getItem("ph-bubble") === "1";
    } catch {
      /* ignora */
    }
    const open = seen ? undefined : window.setTimeout(() => setBubble(true), 9000);
    const close = seen ? undefined : window.setTimeout(() => dismiss(), 17000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(open);
      window.clearTimeout(close);
    };
  }, []);

  function dismiss() {
    setBubble(false);
    try {
      sessionStorage.setItem("ph-bubble", "1");
    } catch {
      /* ignora */
    }
  }

  return (
    <div className="floating-wa pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-40 flex items-end gap-3 sm:right-6">
      <AnimatePresence>
        {visible && bubble && (
          <m.div
            initial={{ opacity: 0, x: 12, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative mb-2 hidden max-w-[220px] rounded-2xl rounded-br-sm border border-gold/20 bg-ink/95 py-3 pl-4 pr-9 text-sm leading-snug text-cream shadow-2xl backdrop-blur sm:block"
            role="status"
          >
            Bateu a fome? <span className="text-gold-light">Peça sua pizza pelo WhatsApp.</span>
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full text-cream/50 hover:bg-cream/10 hover:text-cream"
              aria-label="Fechar mensagem"
            >
              <X size={14} />
            </button>
          </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
          <m.a
            href={whatsappLink(whatsappMessages.order)}
            {...external}
            aria-label="Pedir pelo WhatsApp (abre em nova aba)"
            data-cta="floating-whatsapp"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6 }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group pointer-events-auto relative grid size-[3.6rem] place-items-center rounded-full bg-whatsapp text-white shadow-[0_14px_34px_-10px_rgb(37_211_102/0.7)] ring-1 ring-white/20 sm:size-16"
            onClick={dismiss}
          >
            <span className="absolute inset-0 rounded-full bg-whatsapp animate-pulse-ring" aria-hidden="true" />
            <WhatsAppIcon size={30} className="relative" />
            <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink/95 px-3.5 py-1.5 text-xs font-semibold text-cream opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 lg:block">
              Peça pelo WhatsApp
            </span>
          </m.a>
        )}
      </AnimatePresence>
    </div>
  );
}
