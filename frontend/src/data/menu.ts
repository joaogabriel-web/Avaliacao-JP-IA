import catCombinados from "@/assets/cat-combinados.jpg";
import catSushis from "@/assets/cat-sushis.jpg";
import catSashimis from "@/assets/cat-sashimis.jpg";
import catTemakis from "@/assets/cat-temakis.jpg";
import catHotrolls from "@/assets/cat-hotrolls.jpg";
import catEntradas from "@/assets/cat-entradas.jpg";
import catBebidas from "@/assets/cat-bebidas.jpg";
import catSobremesas from "@/assets/cat-sobremesas.jpg";

export const PRODUCT_IMAGES: Record<string, string> = {
  "cat-combinados": catCombinados,
  "cat-sushis": catSushis,
  "cat-sashimis": catSashimis,
  "cat-temakis": catTemakis,
  "cat-hotrolls": catHotrolls,
  "cat-entradas": catEntradas,
  "cat-bebidas": catBebidas,
  "cat-sobremesas": catSobremesas,
};

export type CategoryId =
  | "todos"
  | "combinados"
  | "sushis"
  | "sashimis"
  | "temakis"
  | "hot-rolls"
  | "entradas"
  | "bebidas"
  | "sobremesas";

export type StockStatus = "available" | "limited" | "unavailable";
export type FulfillmentType = "pickup" | "delivery";
export type PaymentMethod = "pix" | "cash" | "credit" | "debit";

export interface Category {
  id: CategoryId;
  label: string;
}

export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  categoryId: Exclude<CategoryId, "todos">;
  image: string;
  imageAlt: string;
  stock: number;
  pieces?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutFormData {
  customerName: string;
  fulfillment: FulfillmentType;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
  notes: string;
  paymentMethod: PaymentMethod;
  cashAmount: string;
}

export interface ConfirmedOrder {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  fulfillment: FulfillmentType;
  addressSummary?: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  cashPaid?: number;
  cashChange?: number;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

export const MENU_CATEGORIES: Category[] = [
  { id: "todos", label: "Todos" },
  { id: "combinados", label: "Combinados" },
  { id: "sushis", label: "Sushis" },
  { id: "sashimis", label: "Sashimis" },
  { id: "temakis", label: "Temakis" },
  { id: "hot-rolls", label: "Hot Rolls" },
  { id: "entradas", label: "Entradas" },
  { id: "bebidas", label: "Bebidas" },
  { id: "sobremesas", label: "Sobremesas" },
];

export const CATEGORY_LABELS: Record<Exclude<CategoryId, "todos">, string> = {
  combinados: "Combinados",
  sushis: "Sushis",
  sashimis: "Sashimis",
  temakis: "Temakis",
  "hot-rolls": "Hot Rolls",
  entradas: "Entradas",
  bebidas: "Bebidas",
  sobremesas: "Sobremesas",
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: "Pix",
  cash: "Dinheiro",
  credit: "Cartão de crédito",
  debit: "Cartão de débito",
};

export const DEMO_DELIVERY_FEE = 12;
export const DEMO_DISCOUNT_THRESHOLD = 150;
export const DEMO_DISCOUNT_RATE = 0.1;

/** Dados exclusivamente demonstrativos; substituíveis por uma API no futuro. */
export const DEMO_PRODUCTS: Product[] = [
  {
    id: "comb-omakase-24",
    name: "Combinado Omakase Kuroi",
    shortDescription: "Seleção do chef com 24 peças entre sashimis, nigiris e uramakis.",
    fullDescription:
      "Combinado demonstrativo com 8 sashimis frescos (salmão e atum), 6 nigiris selados no maçarico com flor de sal, 6 uramakis Philadelphia e 4 hossomakis de pepino. Acompanha shoyu, wasabi e gengibre.",
    price: 118.9,
    categoryId: "combinados",
    image: catCombinados,
    imageAlt: "Combinado Omakase com 24 peças em cerâmica preta",
    stock: 8,
    pieces: "24 peças",
  },
  {
    id: "comb-salmao-16",
    name: "Combinado Salmão Clássico",
    shortDescription: "16 peças dedicadas ao salmão fresco com toque de cebolinha.",
    fullDescription:
      "Ideal para quem aprecia salmão: 4 sashimis de salmão, 4 nigiris de salmão, 4 uramakis Philadelphia e 4 joes de salmão com cream cheese.",
    price: 79.9,
    categoryId: "combinados",
    image: catCombinados,
    imageAlt: "Combinado de salmão clássico com 16 peças",
    stock: 2,
    pieces: "16 peças",
  },
  {
    id: "sushi-nigiri-dupla",
    name: "Nigiri Salmão & Atum",
    shortDescription: "6 nigiris artesanais sobre arroz temperado com vinagre de arroz.",
    fullDescription:
      "Três nigiris de salmão fresco e três de atum selecionado, moldados na hora sobre arroz japonês shari em temperatura ideal.",
    price: 42.5,
    categoryId: "sushis",
    image: catSushis,
    imageAlt: "Nigiris de salmão e atum em prato retangular escuro",
    stock: 10,
    pieces: "6 unidades",
  },
  {
    id: "sushi-uramaki-trufado",
    name: "Uramaki Salmão Trufado",
    shortDescription: "8 peças com azeite trufado, raspas de limão siciliano e gergelim.",
    fullDescription:
      "Uramaki recheado com salmão fresco e cream cheese, coberto por lâmina de salmão maçaricado, gotas de azeite trufado e raspas cítricas.",
    price: 48.0,
    categoryId: "sushis",
    image: catSushis,
    imageAlt: "Uramaki de salmão trufado com gergelim",
    stock: 3,
    pieces: "8 unidades",
  },
  {
    id: "sashimi-salmao-10",
    name: "Sashimi de Salmão",
    shortDescription: "10 fatias altas de salmão fresco servidas sobre folha de shisô.",
    fullDescription:
      "Cortes altos e precisos de salmão refrigerado na temperatura correta, realçando textura macia e sabor suave.",
    price: 54.0,
    categoryId: "sashimis",
    image: catSashimis,
    imageAlt: "Fatias altas de sashimi de salmão sobre gelo",
    stock: 9,
    pieces: "10 fatias",
  },
  {
    id: "sashimi-peixe-branco",
    name: "Sashimi Peixe Branco Ponzu",
    shortDescription: "8 fatias delicadas de peixe branco com molho ponzu cítrico.",
    fullDescription:
      "Peixe branco do dia fatiado fino e finalizado com molho ponzu artesanal e pimenta togarashi suave. Item sazonal demonstrativo.",
    price: 52.0,
    categoryId: "sashimis",
    image: catSashimis,
    imageAlt: "Sashimi de peixe branco com folha de shisô",
    stock: 0,
    pieces: "8 fatias",
  },
  {
    id: "temaki-salmao-completo",
    name: "Temaki Salmão Completo",
    shortDescription: "Alga nori crocante com cubos de salmão, cream cheese e cebolinha.",
    fullDescription:
      "Cone artesanal enrolado no momento do preparo para preservar a crocância da alga nori, recheado generosamente com salmão fresco em cubos.",
    price: 34.9,
    categoryId: "temakis",
    image: catTemakis,
    imageAlt: "Temaki de salmão com cream cheese e cebolinha",
    stock: 12,
    pieces: "1 unidade",
  },
  {
    id: "temaki-atum-spicy",
    name: "Temaki Atum Spicy",
    shortDescription: "Atum picado com maionese levemente picante e flocos crocantes.",
    fullDescription:
      "Combinação equilibrada de atum fresco, molho sriracha suave, cebolinha e crispy de tempurá em alga nori tostada.",
    price: 36.9,
    categoryId: "temakis",
    image: catTemakis,
    imageAlt: "Temaki de atum spicy em suporte de madeira",
    stock: 2,
    pieces: "1 unidade",
  },
  {
    id: "hot-philadelphia-10",
    name: "Hot Roll Philadelphia",
    shortDescription: "10 peças empanadas na farinha panko com tarê artesanal.",
    fullDescription:
      "Clássico enrolado quente de salmão e cream cheese, empanado em panko leve, frito até dourar e finalizado com molho tarê e cebolinha fresca.",
    price: 39.9,
    categoryId: "hot-rolls",
    image: catHotrolls,
    imageAlt: "Hot rolls crocantes com molho tarê e cebolinha",
    stock: 11,
    pieces: "10 unidades",
  },
  {
    id: "hot-camarao-crispy",
    name: "Hot Roll Camarão Crispy",
    shortDescription: "8 peças crocantes com camarão temperado e couve crispy.",
    fullDescription:
      "Enrolado quente recheado com camarão salteado e cream cheese, finalizado com fios crocantes de couve e tarê reduzido.",
    price: 46.5,
    categoryId: "hot-rolls",
    image: catHotrolls,
    imageAlt: "Hot roll de camarão com cobertura crocante",
    stock: 0,
    pieces: "8 unidades",
  },
  {
    id: "entrada-gyoza-suino",
    name: "Gyoza Grelhado na Chapa",
    shortDescription: "6 unidades douradas com recheio suíno e molho de shoyu cítrico.",
    fullDescription:
      "Massa fina selada na chapa até formar base crocante, recheada com carne suína, gengibre fresco e nirá, servida com molho ponzu.",
    price: 29.9,
    categoryId: "entradas",
    image: catEntradas,
    imageAlt: "Gyozas dourados servidos em cerâmica japonesa",
    stock: 14,
    pieces: "6 unidades",
  },
  {
    id: "entrada-edamame",
    name: "Edamame com Flor de Sal",
    shortDescription: "Vagens de soja cozidas no vapor com flor de sal marinho.",
    fullDescription:
      "Entrada leve e clássica da culinária japonesa, servida morna com cristais de flor de sal.",
    price: 22.0,
    categoryId: "entradas",
    image: catEntradas,
    imageAlt: "Vagens de edamame verde com flor de sal",
    stock: 15,
    pieces: "Porção 180g",
  },
  {
    id: "bebida-yuzu-soda",
    name: "Soda Artesanal de Yuzu",
    shortDescription: "Refresco gaseificado com cítrico japonês yuzu e hortelã.",
    fullDescription:
      "Bebida refrescante preparada com xarope demonstrativo de yuzu, água com gás bem gelada e folhas frescas de hortelã.",
    price: 16.5,
    categoryId: "bebidas",
    image: catBebidas,
    imageAlt: "Soda gelada de yuzu com hortelã em copo alto",
    stock: 18,
    pieces: "350 ml",
  },
  {
    id: "bebida-matcha-gelado",
    name: "Chá Verde Matcha Gelado",
    shortDescription: "Matcha cerimonial batido com gelo e leve toque adocicado.",
    fullDescription:
      "Infusão fria de chá verde matcha com sabor equilibrado e notas vegetais suaves, ideal para harmonizar com sushis e sashimis.",
    price: 18.0,
    categoryId: "bebidas",
    image: catBebidas,
    imageAlt: "Chá verde matcha gelado em copo transparente",
    stock: 3,
    pieces: "350 ml",
  },
  {
    id: "sobremesa-mochi-trio",
    name: "Trio de Mochi Gelado",
    shortDescription: "3 unidades artesanais nos sabores matcha, morango e gergelim.",
    fullDescription:
      "Massa macia de arroz moti recheada com sorvete cremoso nos sabores tradicionais japoneses, polvilhada com leve camada de matcha.",
    price: 28.0,
    categoryId: "sobremesas",
    image: catSobremesas,
    imageAlt: "Três unidades de mochi gelado em prato de cerâmica",
    stock: 7,
    pieces: "3 unidades",
  },
];