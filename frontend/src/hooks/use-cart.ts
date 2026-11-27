import { useCallback, useEffect, useRef, useState } from "react";
import { DEMO_PRODUCTS, type CartItem, type Product } from "@/data/menu";

const CART_STORAGE_KEY = "kuroi_sushi_demo_cart_v1";

interface StoredCartEntry {
  productId: string;
  quantity: number;
}

export interface CartActionResult {
  ok: boolean;
  reason?: "unavailable" | "invalid_quantity" | "exceeds_stock";
  message?: string;
}

function loadStoredCart(catalog: Product[]): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const catalogMap = new Map(catalog.map((p) => [p.id, p]));
    const restored: CartItem[] = [];

    for (const entry of parsed) {
      if (
        typeof entry !== "object" ||
        entry === null ||
        typeof (entry as StoredCartEntry).productId !== "string" ||
        typeof (entry as StoredCartEntry).quantity !== "number"
      ) {
        continue;
      }
      const { productId, quantity } = entry as StoredCartEntry;
      const product = catalogMap.get(productId);
      if (!product || product.stock <= 0 || quantity <= 0) continue;
      restored.push({
        product,
        quantity: Math.min(Math.floor(quantity), product.stock),
      });
    }
    return restored;
  } catch {
    return [];
  }
}

function persistCart(items: CartItem[]): void {
  try {
    const payload: StoredCartEntry[] = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage indisponível (ex.: navegação privada restrita)
  }
}

export function useCart(catalog: Product[] = DEMO_PRODUCTS) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (catalog.length === 0) return;
    const catalogMap = new Map(catalog.map((product) => [product.id, product]));
    setItems((current) => {
      if (!hasHydrated.current) {
        hasHydrated.current = true;
        return loadStoredCart(catalog);
      }
      return current.flatMap((item) => {
        const product = catalogMap.get(item.product.id);
        if (!product || product.stock <= 0) return [];
        return [{ product, quantity: Math.min(item.quantity, product.stock) }];
      });
    });
    setHydrated(true);
  }, [catalog]);

  useEffect(() => {
    if (!hydrated) return;
    persistCart(items);
  }, [items, hydrated]);

  const getItemQuantity = useCallback(
    (productId: string) => {
      const found = items.find((item) => item.product.id === productId);
      return found ? found.quantity : 0;
    },
    [items],
  );

  const addItem = useCallback(
    (product: Product, quantityToAdd = 1): CartActionResult => {
      if (product.stock <= 0) {
        return {
          ok: false,
          reason: "unavailable",
          message: `${product.name} está indisponível no momento.`,
        };
      }
      const qty = Math.floor(quantityToAdd);
      if (!Number.isFinite(qty) || qty <= 0) {
        return {
          ok: false,
          reason: "invalid_quantity",
          message: "Selecione uma quantidade válida.",
        };
      }

      const existing = items.find((item) => item.product.id === product.id);
      const nextQty = (existing ? existing.quantity : 0) + qty;
      if (nextQty > product.stock) {
        return {
          ok: false,
          reason: "exceeds_stock",
          message: `Limite de estoque demonstrativo atingido (${product.stock} un.).`,
        };
      }

      setItems((prev) => {
        const current = prev.find((item) => item.product.id === product.id);
        if (current) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + qty, product.stock) }
              : item,
          );
        }
        return [...prev, { product, quantity: qty }];
      });

      return { ok: true };
    },
    [items],
  );

  const updateQuantity = useCallback(
    (productId: string, nextQuantity: number): CartActionResult => {
      const target = items.find((item) => item.product.id === productId);
      if (!target) return { ok: false, reason: "invalid_quantity" };

      const qty = Math.floor(nextQuantity);
      if (!Number.isFinite(qty) || qty < 0) {
        return {
          ok: false,
          reason: "invalid_quantity",
          message: "A quantidade não pode ser negativa.",
        };
      }
      if (qty === 0) {
        setItems((prev) => prev.filter((item) => item.product.id !== productId));
        return { ok: true };
      }
      if (qty > target.product.stock) {
        return {
          ok: false,
          reason: "exceeds_stock",
          message: `Estoque demonstrativo máximo: ${target.product.stock} un.`,
        };
      }

      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: qty } : item,
        ),
      );
      return { ok: true };
    },
    [items],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    hydrated,
    getItemQuantity,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}