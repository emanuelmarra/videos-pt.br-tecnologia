import type { ImageKey } from "@/lib/images";

/**
 * Galeria — fotografias reais da Pizza House (recortadas dos posts enviados).
 * A ordem abaixo forma um mosaico sem buracos:
 *  • `span`: destaque em telas grandes ("tall" = 2 linhas, "wide" = 2 colunas)
 *  • `mobileWide`: ocupa a largura toda no celular
 */
export interface GalleryItem {
  image: ImageKey;
  alt: string;
  caption: string;
  span?: "tall" | "wide";
  mobileWide?: boolean;
}

export const gallery: GalleryItem[] = [
  {
    image: "hero-pizza",
    alt: "Pizza marguerita com tomates assados, manjericão e mussarela gratinada",
    caption: "Marguerita",
    span: "tall",
    mobileWide: true,
  },
  {
    image: "doces-trio",
    alt: "Três pizzas doces: brigadeiro com granulado, mesclada e chocolate com biscoito",
    caption: "Pizzas doces",
    span: "wide",
  },
  {
    image: "queijo-derretido",
    alt: "Fatia de pizza sendo servida com o queijo derretido se esticando",
    caption: "Queijo que estica",
  },
  {
    image: "mesa-pizzas",
    alt: "Mesa de madeira com pizzas salgadas e doces servidas em tábuas, pratos e bebidas",
    caption: "Mesa para compartilhar",
  },
  {
    image: "nutella",
    alt: "Pizza doce de creme de avelã coberta com castanhas picadas",
    caption: "Creme de avelã",
  },
  {
    image: "salao",
    alt: "Cliente saboreando uma fatia de pizza no salão da Pizza House",
    caption: "No nosso salão",
    span: "tall",
  },
  {
    image: "fachada",
    alt: "Placa iluminada da Pizza House na fachada, com o telefone (37) 3214-7992",
    caption: "Nossa casa",
    span: "wide",
    mobileWide: true,
  },
  {
    image: "pizza-entrega",
    alt: "Pizza com listras de catupiry dentro da caixa de entrega",
    caption: "Também no delivery",
    span: "tall",
  },
  {
    image: "pizza-catupiry",
    alt: "Pizza com cobertura gratinada e listras de catupiry sobre tábua de madeira",
    caption: "Feita para dividir",
    span: "wide",
  },
  {
    image: "fatia-presunto",
    alt: "Fatia de pizza com presunto e queijo derretido sendo retirada da tábua",
    caption: "Recheio generoso",
  },
];
