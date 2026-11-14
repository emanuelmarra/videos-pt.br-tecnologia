import { site } from "@/config/site";

/**
 * Monta um link oficial do WhatsApp (wa.me) com mensagem pré-preenchida.
 * Abre o app no celular e o WhatsApp Web no computador.
 */
export function whatsappLink(message: string = site.whatsapp.defaultMessage) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

const intro = "Olá! Vim pelo site da Pizza House";

export const whatsappMessages = {
  order: site.whatsapp.defaultMessage,
  flavor: (flavor: string, sweet = false) =>
    `${intro} e gostaria de pedir uma pizza ${sweet ? "doce " : ""}de ${flavor}. Quais tamanhos estão disponíveis?`,
  size: (size: string, slices: number) =>
    `${intro} e gostaria de pedir uma pizza ${size} (${slices} fatias). Pode me ajudar com os sabores?`,
  combo: (name: string, items: readonly string[], price: string) =>
    `${intro} e quero o ${name}: ${items.join(", ")}, por ${price}.`,
  reservation: `${intro} e gostaria de consultar a disponibilidade de reserva para um evento ou confraternização.`,
  menu: `${intro} e gostaria de conhecer o cardápio completo e os valores.`,
} as const;

/** Atributos padrão para links externos (WhatsApp, Maps, Instagram). */
export const external = { target: "_blank", rel: "noopener noreferrer" } as const;
