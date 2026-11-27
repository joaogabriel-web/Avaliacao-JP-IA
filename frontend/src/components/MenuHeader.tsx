import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/services/menu-service";

interface MenuHeaderProps {
  itemCount: number;
  subtotal: number;
  onOpenCart: () => void;
}

export function MenuHeader({ itemCount, subtotal, onOpenCart }: MenuHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary font-display text-lg font-semibold text-primary-foreground"
          >
            黒
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold leading-tight text-foreground sm:text-xl">
              Kuroi Sushi
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Cardápio Digital · Pedidos locais
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={onOpenCart}
          aria-label={`Abrir carrinho de compras com ${itemCount} ${itemCount === 1 ? "item" : "itens"}`}
          className="relative h-10 gap-2 px-3 sm:px-4"
        >
          <ShoppingBag className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Carrinho</span>
          <span
            data-testid="cart-badge-count"
            className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary-foreground px-1.5 py-0.5 text-xs font-semibold text-primary"
          >
            {itemCount}
          </span>
          {subtotal > 0 && (
            <span className="hidden border-l border-primary-foreground/30 pl-2 text-xs font-medium md:inline">
              {formatCurrency(subtotal)}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}