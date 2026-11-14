/**
 * Depoimentos de clientes.
 * ⚠ Use apenas avaliações reais, com autorização (ex.: copiadas do Google com
 *   o nome exibido publicamente). Enquanto a lista estiver vazia, a seção mostra
 *   um convite para ver/deixar avaliações no Google.
 *
 * Exemplo de formato:
 *   { name: "Nome do cliente", text: "Texto da avaliação…", rating: 5, source: "Google", date: "2026-10" }
 */
export interface Testimonial {
  name: string;
  text: string;
  rating: number;
  source?: string;
  /** AAAA-MM */
  date?: string;
}

export const testimonials: Testimonial[] = [];
