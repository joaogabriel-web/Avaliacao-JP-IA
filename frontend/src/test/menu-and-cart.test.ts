import { describe, expect, it } from "vitest";
import { DEMO_DELIVERY_FEE, DEMO_PRODUCTS, type CheckoutFormData } from "@/data/menu";
import {
  calculateCartTotals,
  calculateChange,
  filterProducts,
  getStockStatus,
  validateCheckoutForm,
} from "@/services/menu-service";

describe("Regras do cardápio e carrinho", () => {
  it("filtra produtos por categoria e por pesquisa combinada sem diferenciar acentos", () => {
    const byCategory = filterProducts(DEMO_PRODUCTS, "temakis", "");
    expect(byCategory.length).toBeGreaterThan(0);
    expect(byCategory.every((p) => p.categoryId === "temakis")).toBe(true);

    const combined = filterProducts(DEMO_PRODUCTS, "temakis", "salmao");
    expect(combined.map((p) => p.id)).toEqual(["temaki-salmao-completo"]);
  });

  it("classifica corretamente estoque disponível, limitado e indisponível", () => {
    const available = DEMO_PRODUCTS.find((p) => p.stock > 3);
    const limited = DEMO_PRODUCTS.find((p) => p.stock > 0 && p.stock <= 3);
    const unavailable = DEMO_PRODUCTS.find((p) => p.stock === 0);

    expect(available).toBeDefined();
    expect(limited).toBeDefined();
    expect(unavailable).toBeDefined();

    if (available) expect(getStockStatus(available)).toBe("available");
    if (limited) expect(getStockStatus(limited)).toBe("limited");
    if (unavailable) expect(getStockStatus(unavailable)).toBe("unavailable");
  });

  it("calcula subtotal, taxa de entrega demonstrativa e desconto acima de R$ 150", () => {
    const omakase = DEMO_PRODUCTS.find((p) => p.id === "comb-omakase-24");
    const temaki = DEMO_PRODUCTS.find((p) => p.id === "temaki-salmao-completo");
    expect(omakase).toBeDefined();
    expect(temaki).toBeDefined();
    if (!omakase || !temaki) return;

    // 118.90 + 34.90 = 153.80 -> 10% desconto = 15.38
    const pickupTotals = calculateCartTotals(
      [
        { product: omakase, quantity: 1 },
        { product: temaki, quantity: 1 },
      ],
      "pickup",
    );
    expect(pickupTotals.subtotal).toBe(153.8);
    expect(pickupTotals.discount).toBe(15.38);
    expect(pickupTotals.deliveryFee).toBe(0);
    expect(pickupTotals.total).toBe(138.42);

    const deliveryTotals = calculateCartTotals([{ product: temaki, quantity: 1 }], "delivery");
    expect(deliveryTotals.deliveryFee).toBe(DEMO_DELIVERY_FEE);
    expect(deliveryTotals.discount).toBe(0);
    expect(deliveryTotals.total).toBe(46.9);
  });

  it("calcula troco corretamente e rejeita valor menor que o total", () => {
    const ok = calculateChange("100", 79.9);
    expect(ok.error).toBeUndefined();
    expect(ok.change).toBe(20.1);

    const insufficient = calculateChange("50", 79.9);
    expect(insufficient.change).toBeNull();
    expect(insufficient.error).toContain("menor que o total");
  });

  it("valida campos obrigatórios na finalização para retirada e entrega", () => {
    const emptyPickup: CheckoutFormData = {
      customerName: "",
      fulfillment: "pickup",
      street: "",
      number: "",
      neighborhood: "",
      complement: "",
      notes: "",
      paymentMethod: "pix",
      cashAmount: "",
    };
    const resPickup = validateCheckoutForm(emptyPickup, 50);
    expect(resPickup.isValid).toBe(false);
    expect(resPickup.fields.customerName.status).toBe("error");

    const missingAddressDelivery: CheckoutFormData = {
      ...emptyPickup,
      customerName: "João",
      fulfillment: "delivery",
    };
    const resDelivery = validateCheckoutForm(missingAddressDelivery, 62);
    expect(resDelivery.isValid).toBe(false);
    expect(resDelivery.fields.street.status).toBe("error");
    expect(resDelivery.fields.number.status).toBe("error");
    expect(resDelivery.fields.neighborhood.status).toBe("error");

    const validDelivery: CheckoutFormData = {
      ...missingAddressDelivery,
      street: "Rua Japão",
      number: "120",
      neighborhood: "Liberdade",
    };
    expect(validateCheckoutForm(validDelivery, 62).isValid).toBe(true);
  });
});