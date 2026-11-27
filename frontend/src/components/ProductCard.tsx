import { AlertTriangle, Check, CheckCircle2, Plus, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, type Product } from "@/data/menu";
import { formatCurrency, getStockLabel, getStockStatus } from "@/services/menu-service";

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export function ProductCard({
  product,
  quantityInCart,
  onSelect,
  onQuickAdd,
}: ProductCardProps) {
  const stockStatus = getStockStatus(product);
  const stockLabel = getStockLabel(product);
  const isUnavailable = stockStatus === "unavailable";
  const reachedLimit = !isUnavailable && quantityInCart >= product.stock;

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

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-lg border bg-card transition-colors ${
        quantityInCart > 0 ? "border-status-available/50 ring-1 ring-status-available/20" : "border-border"
      } ${isUnavailable ? "opacity-75" : ""}`}
    >
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="flex flex-1 flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
        aria-label={`Ver detalhes de ${product.name}`}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.imageAlt}
            loading="lazy"
            className={`size-full object-cover transition-transform duration-300 ${
              isUnavailable ? "grayscale" : "group-hover:scale-[1.03]"
            }`}
          />
          <span
            className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass}`}
          >
            <StatusIcon className="size-3.5 shrink-0" aria-hidden="true" />
            {stockLabel}
          </span>
          {quantityInCart > 0 && (
            <span className="status-pill-available absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
              <Check className="size-3.5 shrink-0" aria-hidden="true" />
              {quantityInCart} no carrinho
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>{CATEGORY_LABELS[product.categoryId]}</span>
            {product.pieces && <span>{product.pieces}</span>}
          </div>
          <h3 className="mt-1 text-lg font-semibold leading-snug text-foreground">
            {product.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {product.shortDescription}
          </p>
        </div>
      </button>

      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
        <p className="text-base font-semibold text-foreground">{formatCurrency(product.price)}</p>
        <Button
          type="button"
          size="sm"
          variant={isUnavailable ? "secondary" : quantityInCart > 0 ? "outline" : "default"}
          disabled={isUnavailable || reachedLimit}
          onClick={() => onQuickAdd(product)}
          aria-label={
            isUnavailable
              ? `${product.name} indisponível`
              : reachedLimit
                ? `Limite de estoque atingido para ${product.name}`
                : `Adicionar ${product.name} ao carrinho`
          }
          className="h-9 gap-1.5 px-3"
        >
          {isUnavailable ? (
            "Indisponível"
          ) : reachedLimit ? (
            "Limite atingido"
          ) : (
            <>
              <Plus className="size-4" aria-hidden="true" />
              Adicionar
            </>
          )}
        </Button>
      </div>
    </article>
  );
}