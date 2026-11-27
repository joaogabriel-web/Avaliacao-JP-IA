import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Minus, Plus, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CATEGORY_LABELS, type Product } from "@/data/menu";
import { formatCurrency, getStockLabel, getStockStatus } from "@/services/menu-service";

interface ProductDetailModalProps {
  product: Product | null;
  quantityInCart: number;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  quantityInCart,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

  if (!product) return null;

  const stockStatus = getStockStatus(product);
  const stockLabel = getStockLabel(product);
  const isUnavailable = stockStatus === "unavailable";
  const maxAddable = Math.max(0, product.stock - quantityInCart);
  const canAdd = !isUnavailable && maxAddable > 0;

  const statusClass =
    stockStatus === "available"
      ? "status-pill-available"
      : stockStatus === "limited"
        ? "status-pill-limited"
        : "status-pill-unavailable";

  const StatusIcon =
    stockStatus === "available"
      ? CheckCircle2
      : stockStatus === "limited"
        ? AlertTriangle
        : XCircle;

  const handleConfirmAdd = () => {
    if (!canAdd) return;
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <Dialog open={Boolean(product)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-lg">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.imageAlt}
            className={`size-full object-cover ${isUnavailable ? "grayscale" : ""}`}
          />
          <span
            className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusClass}`}
          >
            <StatusIcon className="size-3.5" aria-hidden="true" />
            {stockLabel}
          </span>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <DialogHeader className="space-y-1 text-left">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {CATEGORY_LABELS[product.categoryId]}
              {product.pieces ? ` · ${product.pieces}` : ""}
            </p>
            <DialogTitle className="font-display text-2xl font-semibold text-foreground">
              {product.name}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {product.fullDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-secondary/50 px-4 py-3">
            <div>
              <p className="text-xs text-muted-foreground">Preço unitário demonstrativo</p>
              <p className="text-xl font-semibold text-foreground">
                {formatCurrency(product.price)}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {isUnavailable
                ? "Sem estoque demonstrativo"
                : `Estoque simulado: ${product.stock} un.${quantityInCart > 0 ? ` (${quantityInCart} no carrinho)` : ""}`}
            </p>
          </div>

          {canAdd ? (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-foreground">Quantidade</span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Diminuir quantidade"
                  className="size-9"
                >
                  <Minus className="size-4" aria-hidden="true" />
                </Button>
                <span
                  data-testid="modal-quantity-value"
                  className="min-w-8 text-center text-base font-semibold text-foreground"
                >
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.min(maxAddable, q + 1))}
                  disabled={quantity >= maxAddable}
                  aria-label="Aumentar quantidade"
                  className="size-9"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              role="status"
              className="status-pill-unavailable flex items-center gap-2 rounded-md px-3 py-2 text-sm"
            >
              <XCircle className="size-4 shrink-0" aria-hidden="true" />
              {isUnavailable
                ? "Este item está indisponível e não pode ser adicionado ao carrinho."
                : "Você já adicionou todo o estoque simulado disponível deste item."}
            </div>
          )}

          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <Button type="button" variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button
              type="button"
              disabled={!canAdd}
              onClick={handleConfirmAdd}
              className="flex-1 sm:flex-initial"
            >
              {canAdd
                ? `Adicionar · ${formatCurrency(product.price * quantity)}`
                : "Indisponível"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}