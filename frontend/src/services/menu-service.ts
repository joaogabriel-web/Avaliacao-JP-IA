import {
  DEMO_DELIVERY_FEE,
  DEMO_DISCOUNT_RATE,
  DEMO_DISCOUNT_THRESHOLD,
  type CartItem,
  type CategoryId,
  type CheckoutFormData,
  type FulfillmentType,
  type Product,
  type StockStatus,
} from "@/data/menu";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function getStockStatus(product: Product): StockStatus {
  if (product.stock <= 0) return "unavailable";
  if (product.stock <= 3) return "limited";
  return "available";
}

export function getStockLabel(product: Product): string {
  const status = getStockStatus(product);
  if (status === "unavailable") return "Indisponível";
  if (status === "limited") {
    return product.stock === 1 ? "Última unidade" : `Restam ${product.stock}`;
  }
  return "Disponível";
}

export function filterProducts(
  products: Product[],
  category: CategoryId,
  query: string,
): Product[] {
  const normalizedQuery = normalizeText(query);
  return products.filter((product) => {
    const matchesCategory = category === "todos" || product.categoryId === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return normalizeText(product.name).includes(normalizedQuery);
  });
}

export interface CartTotals {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  itemCount: number;
  remainingForDiscount: number;
}

export function calculateCartTotals(
  items: CartItem[],
  fulfillment: FulfillmentType = "pickup",
): CartTotals {
  const subtotal = Math.round(
    items.reduce((acc, item) => acc + item.product.price * item.quantity, 0) * 100,
  ) / 100;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const deliveryFee = fulfillment === "delivery" && subtotal > 0 ? DEMO_DELIVERY_FEE : 0;
  const discount =
    subtotal >= DEMO_DISCOUNT_THRESHOLD
      ? Math.round(subtotal * DEMO_DISCOUNT_RATE * 100) / 100
      : 0;
  const total = Math.max(0, Math.round((subtotal + deliveryFee - discount) * 100) / 100);
  const remainingForDiscount = Math.max(
    0,
    Math.round((DEMO_DISCOUNT_THRESHOLD - subtotal) * 100) / 100,
  );

  return { subtotal, deliveryFee, discount, total, itemCount, remainingForDiscount };
}

export function parseCashAmount(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (!cleaned) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return Number.NaN;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export interface ChangeResult {
  paid: number | null;
  change: number | null;
  error?: string;
}

export function calculateChange(rawCashAmount: string, total: number): ChangeResult {
  const paid = parseCashAmount(rawCashAmount);
  if (paid === null) {
    return { paid: null, change: null };
  }
  if (Number.isNaN(paid) || paid <= 0) {
    return { paid: null, change: null, error: "Informe um valor numérico válido maior que zero." };
  }
  if (paid < total) {
    return {
      paid,
      change: null,
      error: `O valor informado é menor que o total de ${formatCurrency(total)}.`,
    };
  }
  return {
    paid,
    change: Math.round((paid - total) * 100) / 100,
  };
}

export type FieldValidationStatus = "idle" | "valid" | "error";

export interface FieldValidation {
  status: FieldValidationStatus;
  message?: string;
}

export interface CheckoutValidationResult {
  isValid: boolean;
  fields: {
    customerName: FieldValidation;
    street: FieldValidation;
    number: FieldValidation;
    neighborhood: FieldValidation;
    cashAmount: FieldValidation;
  };
}

function validateRequiredText(value: string, label: string, minLen = 2): FieldValidation {
  const trimmed = value.trim();
  if (!trimmed) {
    return { status: "error", message: `${label} é obrigatório.` };
  }
  if (trimmed.length < minLen) {
    return { status: "error", message: `${label} deve ter pelo menos ${minLen} caracteres.` };
  }
  return { status: "valid" };
}

export function validateCheckoutForm(
  data: CheckoutFormData,
  total: number,
): CheckoutValidationResult {
  const customerName = validateRequiredText(data.customerName, "Nome do cliente", 2);
  const isDelivery = data.fulfillment === "delivery";

  const street: FieldValidation = isDelivery
    ? validateRequiredText(data.street, "Rua", 3)
    : { status: "idle" };
  const number: FieldValidation = isDelivery
    ? validateRequiredText(data.number, "Número", 1)
    : { status: "idle" };
  const neighborhood: FieldValidation = isDelivery
    ? validateRequiredText(data.neighborhood, "Bairro", 2)
    : { status: "idle" };

  let cashAmount: FieldValidation = { status: "idle" };
  if (data.paymentMethod === "cash" && data.cashAmount.trim() !== "") {
    const changeResult = calculateChange(data.cashAmount, total);
    if (changeResult.error) {
      cashAmount = { status: "error", message: changeResult.error };
    } else {
      cashAmount = { status: "valid" };
    }
  }

  const allValid =
    customerName.status === "valid" &&
    street.status !== "error" &&
    number.status !== "error" &&
    neighborhood.status !== "error" &&
    cashAmount.status !== "error";

  return {
    isValid: allValid,
    fields: { customerName, street, number, neighborhood, cashAmount },
  };
}

export function generateDemoOrderNumber(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `KS-${num}`;
}