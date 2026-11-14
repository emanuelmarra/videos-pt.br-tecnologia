/**
 * ============================================================================
 *  CARDÁPIO — edite sabores, descrições, fotos, tamanhos, preços e combos aqui.
 * ============================================================================
 *
 *  • Preços: use número (ex.: 52) ou `null` para "consultar".
 *  • Fotos: `image` aponta para uma foto otimizada (veja src/data/images.json).
 *    Sabores ainda sem foto usam uma ilustração elegante (`illustration`).
 *    Para colocar a foto real: salve-a em assets/photos/<nome>.jpg, adicione
 *    o nome em scripts/optimize-images.mjs, rode `npm run images` e troque
 *    `illustration` por `image: "<nome>"`.
 *  • ⚠ As descrições seguem a receita tradicional de cada sabor — revise os
 *    ingredientes para que fiquem idênticos aos da Pizza House.
 */
import type { ImageKey } from "@/lib/images";

export type Category = "salgadas" | "doces";

export type IllustrationKind =
  | "calabresa"
  | "quatro-queijos"
  | "cinco-queijos"
  | "costela"
  | "pepperoni"
  | "kitkat";

export interface Flavor {
  id: string;
  name: string;
  category: Category;
  description: string;
  image?: ImageKey;
  illustration?: IllustrationKind;
  /** Selo opcional exibido no card (ex.: "Premium"). */
  tag?: string;
  /** Preço individual do sabor — deixe sem preencher enquanto não houver valor confirmado. */
  price?: number | null;
}

export const categories: { id: Category | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "salgadas", label: "Salgadas" },
  { id: "doces", label: "Doces" },
];

export const flavors: Flavor[] = [
  // ---------------------------------------------------------------- Salgadas
  {
    id: "marguerita",
    name: "Marguerita",
    category: "salgadas",
    description: "Molho de tomate, mussarela, tomate e manjericão fresco. A clássica italiana, simples e perfeita.",
    image: "marguerita",
  },
  {
    id: "calabresa",
    name: "Calabresa",
    category: "salgadas",
    description: "Molho de tomate, mussarela, calabresa fatiada e cebola. Clássica e sempre bem-vinda à mesa.",
    illustration: "calabresa",
  },
  {
    id: "quatro-queijos",
    name: "Quatro Queijos",
    category: "salgadas",
    description: "Quatro queijos derretidos em equilíbrio sobre a massa leve — cremosa do centro à borda.",
    illustration: "quatro-queijos",
  },
  {
    id: "frango-catupiry",
    name: "Frango com Catupiry",
    category: "salgadas",
    description: "Frango desfiado e temperado, coberto com a cremosidade do Catupiry.",
    image: "frango-catupiry",
  },
  {
    id: "cinco-queijos",
    name: "5 Queijos",
    category: "salgadas",
    description: "Para quem ama queijo: cinco variedades que se completam em sabor, textura e cremosidade.",
    illustration: "cinco-queijos",
  },
  {
    id: "costela-premium",
    name: "Costela Premium",
    category: "salgadas",
    description: "Costela bovina desfiada, macia e suculenta, em um sabor feito para impressionar.",
    illustration: "costela",
    tag: "Premium",
  },
  {
    id: "carne-seca-catupiry",
    name: "Carne Seca com Catupiry",
    category: "salgadas",
    description: "Carne seca desfiada e o Catupiry cremoso: uma combinação brasileira que não tem erro.",
    image: "carne-seca",
  },
  {
    id: "pepperoni",
    name: "Pepperoni",
    category: "salgadas",
    description: "Fatias de pepperoni levemente picantes sobre mussarela derretida e molho de tomate.",
    illustration: "pepperoni",
  },
  {
    id: "portuguesa",
    name: "Portuguesa",
    category: "salgadas",
    description: "Presunto, ovos, cebola, pimentão, azeitonas e mussarela. Farta, colorida e cheia de sabor.",
    image: "portuguesa",
  },

  // ------------------------------------------------------------------- Doces
  {
    id: "nutella",
    name: "Nutella",
    category: "doces",
    description: "Creme de avelã Nutella espalhado generosamente sobre a massa quentinha.",
    image: "nutella-thumb",
  },
  {
    id: "mesclada",
    name: "Mesclada",
    category: "doces",
    description: "Chocolate ao leite e chocolate branco em um desenho marmorizado irresistível.",
    image: "mesclada",
  },
  {
    id: "oreo",
    name: "Oreo",
    category: "doces",
    description: "Chocolate cremoso com pedaços crocantes do biscoito Oreo.",
    image: "oreo",
  },
  {
    id: "brigadeiro",
    name: "Brigadeiro",
    category: "doces",
    description: "Brigadeiro cremoso coberto com chocolate granulado — o doce mais brasileiro em forma de pizza.",
    image: "brigadeiro",
  },
  {
    id: "kitkat",
    name: "KitKat",
    category: "doces",
    description: "Chocolate cremoso com pedaços crocantes de KitKat em cada fatia.",
    illustration: "kitkat",
  },
];

// --------------------------------------------------------------------------
//  Tamanhos e preços informados
// --------------------------------------------------------------------------
export interface Size {
  id: string;
  name: string;
  /** Complemento do nome (ex.: "Individual"). */
  note?: string;
  slices: number;
  /** `null` = preço a consultar */
  price: number | null;
  /** Como o preço deve ser lido: "a partir de", "aprox." ou texto para consultar. */
  priceLabel: string;
}

export const sizes: Size[] = [
  { id: "pequena", name: "Pequena", note: "Individual", slices: 4, price: 46, priceLabel: "a partir de" },
  { id: "media", name: "Média", slices: 6, price: 52, priceLabel: "aprox." },
  { id: "grande", name: "Grande", slices: 8, price: 68, priceLabel: "a partir de" },
  { id: "gigante", name: "Gigante", slices: 10, price: null, priceLabel: "Preço a consultar" },
];

// --------------------------------------------------------------------------
//  Combos especiais
// --------------------------------------------------------------------------
export interface Combo {
  id: string;
  name: string;
  tagline: string;
  items: { icon: "pizza" | "soda" | "gift"; label: string }[];
  price: number;
  image: ImageKey;
}

export const comboCasal: Combo = {
  id: "combo-casal",
  name: "Combo Casal",
  tagline: "Para dividir a pizza, a conversa e a sobremesa.",
  items: [
    { icon: "pizza", label: "1 pizza média de 6 fatias" },
    { icon: "soda", label: "2 refrigerantes em lata" },
    { icon: "gift", label: "1 caixa de bombom" },
  ],
  price: 85.9,
  image: "queijo-derretido",
};

export const menuNotes =
  "Valores de referência, sujeitos a alteração — confirme o valor final do seu pedido pelo WhatsApp. Imagens ilustrativas.";
