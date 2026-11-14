const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 85.9 -> "R$ 85,90" (com espaço normal, sem caractere especial). */
export function formatPrice(value: number) {
  return brl.format(value).replace(/\s/g, " ");
}
