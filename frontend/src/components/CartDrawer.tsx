import { AlertTriangle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DEMO_DELIVERY_FEE, DEMO_DISCOUNT_THRESHOLD, type CartItem } from "@/data/menu";
import { calculateCartTotals, formatCurrency } from "@/services/menu-service";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, nextQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export function CartDrawer({
  open,
  onOpenChange,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}: CartDrawerProps) {
  const totals = calculateCartTotals(items, "pickup");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="font-display text-xl font-semibold text-foreground">
            Seu carrinho
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {totals.itemCount === 0
              ? "Nenhum item selecionado"
              : `${totals.itemCount} ${totals.itemCount === 1 ? "item selecionado" : "itens selecionados"} · Valores demonstrativos`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <ShoppingBag className="size-6" aria-hidden="true" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              Seu carrinho está vazio
            </h3>
            <p className="max-w-xs text-sm text-muted-foreground">
              Explore o cardápio e adicione combinados, sushis, temakis ou bebidas para simular seu
              pedido.
            </p>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Ver cardápio
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {totals.remainingForDiscount > 0 ? (
                <div className="status-pill-limited flex items-start gap-2 rounded-md px-3 py-2 text-xs">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    Faltam <strong>{formatCurrency(totals.remainingForDiscount)}</strong> para
                    ativar 10% de desconto demonstrativo (acima de{" "}
                    {formatCurrency(DEMO_DISCOUNT_THRESHOLD)}).
                  </span>
                </div>
              ) : (
                <div className="status-pill-available rounded-md px-3 py-2 text-xs font-medium">
                  Desconto demonstrativo de 10% aplicado automaticamente!
                </div>
              )}

              <ul className="space-y-3" aria-label="Produtos no carrinho">
                {items.map(({ product, quantity }) => {
                  const atStockLimit = quantity >= product.stock;
                  return (
                    <li
                      key={product.id}
                      className="flex gap-3 rounded-lg border border-border bg-card p-3"
                    >
                      <img
                        src={product.image}
                        alt={product.imageAlt}
                        className="size-16 shrink-0 rounded-md object-cover"
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="truncate text-sm font-semibold text-foreground">
                            {product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(product.id)}
                            aria-label={`Remover ${product.name} do carrinho`}
                            className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(product.price)} cada
                        </p>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                              aria-label={`Diminuir quantidade de ${product.name}`}
                              className="size-7"
                            >
                              <Minus className="size-3.5" aria-hidden="true" />
                            </Button>
                            <span
                              data-testid={`cart-qty-${product.id}`}
                              className="min-w-6 text-center text-sm font-medium text-foreground"
                            >
                              {quantity}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              disabled={atStockLimit}
                              onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                              aria-label={`Aumentar quantidade de ${product.name}`}
                              className="size-7"
                            >
                              <Plus className="size-3.5" aria-hidden="true" />
                            </Button>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {formatCurrency(product.price * quantity)}
                          </span>
                        </div>

                        {atStockLimit && (
                          <p className="mt-1 text-xs text-status-warning">
                            Limite de estoque simulado ({product.stock} un.)
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <SheetFooter className="flex-col gap-3 border-t border-border bg-secondary/40 px-5 py-4 sm:flex-col">
              <div className="w-full space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-status-available">
                    <span>Desconto demonstrativo (10%)</span>
                    <span>- {formatCurrency(totals.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Taxa de entrega demonstrativa</span>
                  <span>Grátis (retirada) ou {formatCurrency(DEMO_DELIVERY_FEE)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-foreground">
                  <span>Total estimado</span>
                  <span data-testid="cart-total-value">{formatCurrency(totals.total)}</span>
                </div>
              </div>

              <div className="flex w-full gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClearCart}
                  className="shrink-0"
                >
                  Limpar
                </Button>
                <Button type="button" onClick={onCheckout} className="flex-1">
                  Finalizar pedido
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}