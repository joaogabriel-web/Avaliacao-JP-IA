import {
  PRODUCT_IMAGES,
  type CategoryId,
  type CheckoutFormData,
  type ConfirmedOrder,
  type PaymentMethod,
  type Product,
} from "@/data/menu";

type OrderLineInput = { productId: string; quantity: number };
type CreateOrderInput = CheckoutFormData & { items: OrderLineInput[] };

const CATEGORY_IDS: Record<string, Exclude<CategoryId, "todos">> = {
  combinados: "combinados",
  sushis: "sushis",
  sashimis: "sashimis",
  temakis: "temakis",
  "hot-rolls": "hot-rolls",
  entradas: "entradas",
  bebidas: "bebidas",
  sobremesas: "sobremesas",
};

const PAYMENT_METHODS: Record<string, PaymentMethod> = {
  pix: "pix",
  cash: "cash",
  credit: "credit",
  debit: "debit",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string") throw new Error(`Resposta inválida do servidor: ${key}.`);
  return value;
}

function requiredNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Resposta inválida do servidor: ${key}.`);
  }
  return value;
}

function parseProduct(value: unknown): Product {
  if (!isRecord(value)) throw new Error("Resposta inválida do servidor: produto.");

  const imageKey = requiredString(value, "imageKey");
  const image = Object.prototype.hasOwnProperty.call(PRODUCT_IMAGES, imageKey)
    ? PRODUCT_IMAGES[imageKey]
    : undefined;
  const categoryKey = requiredString(value, "categoryId");
  const categoryId = Object.prototype.hasOwnProperty.call(CATEGORY_IDS, categoryKey)
    ? CATEGORY_IDS[categoryKey]
    : undefined;
  if (!image || !categoryId) {
    throw new Error("Resposta inválida do servidor: imagem ou categoria do produto.");
  }

  const pieces = value["pieces"];
  if (pieces !== undefined && typeof pieces !== "string") {
    throw new Error("Resposta inválida do servidor: pieces.");
  }

  return {
    id: requiredString(value, "id"),
    name: requiredString(value, "name"),
    shortDescription: requiredString(value, "shortDescription"),
    fullDescription: requiredString(value, "fullDescription"),
    price: requiredNumber(value, "price"),
    categoryId,
    image,
    imageAlt: requiredString(value, "imageAlt"),
    stock: requiredNumber(value, "stock"),
    ...(typeof pieces === "string" ? { pieces } : {}),
  };
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, init);
  } catch (error) {
    throw new Error("Não foi possível conectar ao backend. Verifique se a API está em execução.", {
      cause: error,
    });
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    throw new Error("O backend retornou uma resposta inválida.", { cause: error });
  }

  if (!response.ok) {
    const errorPayload =
      isRecord(payload) && isRecord(payload["error"]) ? payload["error"] : null;
    const message =
      errorPayload && typeof errorPayload["message"] === "string"
        ? errorPayload["message"]
        : "Não foi possível concluir a solicitação.";
    throw new Error(message);
  }

  return payload;
}

export async function fetchMenu(): Promise<Product[]> {
  const payload = await request("/menu");
  if (!isRecord(payload) || !Array.isArray(payload["products"])) {
    throw new Error("O backend retornou um cardápio inválido.");
  }
  return payload["products"].map(parseProduct);
}

export async function submitOrder(input: CreateOrderInput): Promise<ConfirmedOrder> {
  const payload = await request("/orders", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!isRecord(payload) || !Array.isArray(payload["items"])) {
    throw new Error("O backend retornou um pedido inválido.");
  }

  const fulfillment = requiredString(payload, "fulfillment");
  const paymentMethodKey = requiredString(payload, "paymentMethod");
  const paymentMethod = Object.prototype.hasOwnProperty.call(PAYMENT_METHODS, paymentMethodKey)
    ? PAYMENT_METHODS[paymentMethodKey]
    : undefined;
  if (fulfillment !== "pickup" && fulfillment !== "delivery") {
    throw new Error("O backend retornou um tipo de atendimento inválido.");
  }
  if (!paymentMethod) {
    throw new Error("O backend retornou uma forma de pagamento inválida.");
  }

  const items = payload["items"].map((item) => {
    if (!isRecord(item)) {
      throw new Error("O backend retornou um item de pedido inválido.");
    }
    const quantity = item["quantity"];
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) {
      throw new Error("O backend retornou um item de pedido inválido.");
    }
    return { product: parseProduct(item["product"]), quantity };
  });
  const addressSummary = payload["addressSummary"];
  const notes = payload["notes"];
  const cashPaid = payload["cashPaid"];
  const cashChange = payload["cashChange"];

  if (addressSummary !== undefined && typeof addressSummary !== "string") {
    throw new Error("O backend retornou um endereço inválido.");
  }
  if (notes !== undefined && typeof notes !== "string") {
    throw new Error("O backend retornou observações inválidas.");
  }
  if (
    (cashPaid !== undefined && typeof cashPaid !== "number") ||
    (cashChange !== undefined && typeof cashChange !== "number")
  ) {
    throw new Error("O backend retornou valores de troco inválidos.");
  }

  return {
    orderNumber: requiredString(payload, "orderNumber"),
    createdAt: requiredString(payload, "createdAt"),
    customerName: requiredString(payload, "customerName"),
    fulfillment,
    ...(typeof addressSummary === "string" ? { addressSummary } : {}),
    ...(typeof notes === "string" ? { notes } : {}),
    paymentMethod,
    ...(typeof cashPaid === "number" ? { cashPaid } : {}),
    ...(typeof cashChange === "number" ? { cashChange } : {}),
    items,
    subtotal: requiredNumber(payload, "subtotal"),
    deliveryFee: requiredNumber(payload, "deliveryFee"),
    discount: requiredNumber(payload, "discount"),
    total: requiredNumber(payload, "total"),
  };
}
