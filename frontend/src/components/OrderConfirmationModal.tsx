import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PAYMENT_LABELS, type ConfirmedOrder } from "@/data/menu";
import { formatCurrency } from "@/services/menu-service";

interface OrderConfirmationModalProps {
  order: ConfirmedOrder | null;
  onStartNewOrder: () => void;
}

export function OrderConfirmationModal({ order, onStartNewOrder }: OrderConfirmationModalProps) {
  if (!order) return null;

  return (
    <Dialog open={Boolean(order)} onOpenChange={(open) => !open && onStartNewOrder()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader className="items-center text-center">
          <div className="status-pill-available flex size-12 items-center justify-center rounded-full">
            <CheckCircle2 className="size-6" aria-hidden="true" />
          </div>
          <DialogTitle className="font-display text-2xl font-semibold text-foreground">
            Pedido realizado com sucesso
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Número demonstrativo{" "}
            <strong data-testid="demo-order-number" className="text-foreground">
              #{order.orderNumber}
            </strong>{" "}
            · {order.createdAt}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            role="note"
            className="status-pill-limited flex items-start gap-2.5 rounded-md px-3.5 py-3 text-xs leading-relaxed"
          >
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              <strong>Aviso demonstrativo:</strong> este pedido foi registrado apenas nesta
              simulação local e <strong>não foi transmitido</strong> para a cozinha ou para o
              restaurante.
            </span>
          </div>

          <div className="rounded-lg border border-border bg-secondary/35 p-4 text-sm">
            <dl className="space-y-1.5">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Cliente</dt>
                <dd className="font-medium text-foreground">{order.customerName}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Atendimento</dt>
                <dd className="font-medium text-foreground">
                  {order.fulfillment === "delivery" ? "Entrega demonstrativa" : "Retirada no restaurante"}
                </dd>
              </div>
              {order.addressSummary && (
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Endereço</dt>
                  <dd className="text-right font-medium text-foreground">{order.addressSummary}</dd>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Pagamento simulado</dt>
                <dd className="font-medium text-foreground">
                  {PAYMENT_LABELS[order.paymentMethod]}
                </dd>
              </div>
              {order.cashPaid !== undefined && order.cashChange !== undefined && (
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Troco ({formatCurrency(order.cashPaid)})</dt>
                  <dd className="font-medium text-status-available">
                    {formatCurrency(order.cashChange)}
                  </dd>
                </div>
              )}
              {order.notes && (
                <div className="border-t border-border pt-2 text-xs text-muted-foreground">
                  Obs.: {order.notes}
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-lg border border-border p-4 text-sm">
            <h3 className="font-semibold text-foreground">Itens do pedido</h3>
            <ul className="mt-2 divide-y divide-border">
              {order.items.map(({ product, quantity }) => (
                <li key={product.id} className="flex justify-between gap-2 py-1.5">
                  <span className="text-foreground">
                    {quantity}× {product.name}
                  </span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-2 space-y-1 border-t border-border pt-2">
              {order.discount > 0 && (
                <div className="flex justify-between text-xs text-status-available">
                  <span>Desconto demonstrativo</span>
                  <span>- {formatCurrency(order.discount)}</span>
                </div>
              )}
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Taxa de entrega demonstrativa</span>
                  <span>{formatCurrency(order.deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-foreground">
                <span>Valor total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={onStartNewOrder} className="w-full">
            Voltar ao cardápio e iniciar novo pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}