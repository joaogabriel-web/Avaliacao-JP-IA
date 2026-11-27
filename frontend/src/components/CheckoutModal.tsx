import { useMemo, useState, type FormEvent } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Store,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DEMO_DELIVERY_FEE,
  PAYMENT_LABELS,
  type CartItem,
  type CheckoutFormData,
  type ConfirmedOrder,
  type PaymentMethod,
} from "@/data/menu";
import {
  calculateCartTotals,
  calculateChange,
  formatCurrency,
  validateCheckoutForm,
  type FieldValidation,
} from "@/services/menu-service";
import { submitOrder } from "@/services/api";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onOrderConfirmed: (order: ConfirmedOrder) => void;
}

const INITIAL_FORM: CheckoutFormData = {
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

const PAYMENT_OPTIONS: PaymentMethod[] = ["pix", "cash", "credit", "debit"];

function fieldBorderClass(validation: FieldValidation, showState: boolean): string {
  if (!showState) return "";
  if (validation.status === "error") return "field-error";
  if (validation.status === "valid") return "field-valid";
  return "";
}

export function CheckoutModal({
  open,
  onOpenChange,
  items,
  onOrderConfirmed,
}: CheckoutModalProps) {
  const [form, setForm] = useState<CheckoutFormData>(INITIAL_FORM);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const totals = useMemo(
    () => calculateCartTotals(items, form.fulfillment),
    [items, form.fulfillment],
  );
  const validation = useMemo(() => validateCheckoutForm(form, totals.total), [form, totals.total]);
  const changeInfo = useMemo(
    () =>
      form.paymentMethod === "cash"
        ? calculateChange(form.cashAmount, totals.total)
        : { paid: null, change: null },
    [form.paymentMethod, form.cashAmount, totals.total],
  );

  const markTouched = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));
  const showField = (field: string) => submitted || Boolean(touched[field]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!validation.isValid || items.length === 0) return;

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const order = await submitOrder({
        ...form,
        customerName: form.customerName.trim(),
        street: form.street.trim(),
        number: form.number.trim(),
        neighborhood: form.neighborhood.trim(),
        complement: form.complement.trim(),
        notes: form.notes.trim(),
        items: items.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
        })),
      });
      setForm(INITIAL_FORM);
      setTouched({});
      setSubmitted(false);
      onOrderConfirmed(order);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Não foi possível registrar o pedido.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isSubmitting && onOpenChange(next)}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-2xl font-semibold text-foreground">
            Finalização do pedido
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Revise os itens e informe os dados para registrar o pedido localmente. Nenhum
            pagamento será processado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Resumo dos produtos */}
          <section aria-labelledby="review-heading" className="rounded-lg border border-border bg-secondary/35 p-4">
            <h3 id="review-heading" className="text-sm font-semibold text-foreground">
              Resumo do pedido ({totals.itemCount} {totals.itemCount === 1 ? "item" : "itens"})
            </h3>
            <ul className="mt-3 divide-y divide-border text-sm">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex items-center justify-between gap-2 py-2">
                  <span className="text-foreground">
                    {quantity}× {product.name}
                  </span>
                  <span className="shrink-0 font-medium text-foreground">
                    {formatCurrency(product.price * quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
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
              <div className="flex justify-between text-muted-foreground">
                <span>Taxa de entrega demonstrativa</span>
                <span>{totals.deliveryFee > 0 ? formatCurrency(totals.deliveryFee) : "Grátis"}</span>
              </div>
              <div className="flex justify-between pt-1 text-base font-semibold text-foreground">
                <span>Total geral</span>
                <span data-testid="checkout-total-value">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </section>

          {/* Dados do cliente e tipo de atendimento */}
          <section className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="customerName">Nome do cliente *</Label>
              <Input
                id="customerName"
                name="customerName"
                placeholder="Ex.: Mariana Silva"
                value={form.customerName}
                onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                onBlur={() => markTouched("customerName")}
                aria-invalid={showField("customerName") && validation.fields.customerName.status === "error"}
                className={fieldBorderClass(validation.fields.customerName, showField("customerName"))}
              />
              {showField("customerName") && validation.fields.customerName.status === "error" && (
                <p role="alert" className="flex items-center gap-1.5 text-xs text-status-unavailable">
                  <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                  {validation.fields.customerName.message}
                </p>
              )}
              {showField("customerName") && validation.fields.customerName.status === "valid" && (
                <p className="flex items-center gap-1.5 text-xs text-status-available">
                  <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                  Campo preenchido corretamente
                </p>
              )}
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-foreground">Tipo de atendimento *</legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, fulfillment: "pickup" }))}
                  aria-pressed={form.fulfillment === "pickup"}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                    form.fulfillment === "pickup"
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  <Store className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Retirada no restaurante</p>
                    <p className="text-xs text-muted-foreground">Sem taxa adicional</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, fulfillment: "delivery" }))}
                  aria-pressed={form.fulfillment === "delivery"}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                    form.fulfillment === "delivery"
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/30"
                  }`}
                >
                  <Truck className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Entrega demonstrativa</p>
                    <p className="text-xs text-muted-foreground">
                      Taxa simulada de {formatCurrency(DEMO_DELIVERY_FEE)}
                    </p>
                  </div>
                </button>
              </div>
            </fieldset>

            {form.fulfillment === "delivery" && (
              <div className="space-y-3 rounded-lg border border-border bg-secondary/25 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Endereço demonstrativo para entrega
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor="street">Rua *</Label>
                    <Input
                      id="street"
                      placeholder="Ex.: Rua das Flores"
                      value={form.street}
                      onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
                      onBlur={() => markTouched("street")}
                      aria-invalid={showField("street") && validation.fields.street.status === "error"}
                      className={fieldBorderClass(validation.fields.street, showField("street"))}
                    />
                    {showField("street") && validation.fields.street.status === "error" && (
                      <p role="alert" className="flex items-center gap-1 text-xs text-status-unavailable">
                        <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                        {validation.fields.street.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="number">Número *</Label>
                    <Input
                      id="number"
                      placeholder="Ex.: 240"
                      value={form.number}
                      onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
                      onBlur={() => markTouched("number")}
                      aria-invalid={showField("number") && validation.fields.number.status === "error"}
                      className={fieldBorderClass(validation.fields.number, showField("number"))}
                    />
                    {showField("number") && validation.fields.number.status === "error" && (
                      <p role="alert" className="flex items-center gap-1 text-xs text-status-unavailable">
                        <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                        {validation.fields.number.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input
                      id="neighborhood"
                      placeholder="Ex.: Liberdade"
                      value={form.neighborhood}
                      onChange={(e) => setForm((f) => ({ ...f, neighborhood: e.target.value }))}
                      onBlur={() => markTouched("neighborhood")}
                      aria-invalid={
                        showField("neighborhood") && validation.fields.neighborhood.status === "error"
                      }
                      className={fieldBorderClass(
                        validation.fields.neighborhood,
                        showField("neighborhood"),
                      )}
                    />
                    {showField("neighborhood") && validation.fields.neighborhood.status === "error" && (
                      <p role="alert" className="flex items-center gap-1 text-xs text-status-unavailable">
                        <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                        {validation.fields.neighborhood.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="complement">Complemento (opcional)</Label>
                    <Input
                      id="complement"
                      placeholder="Ex.: Apto 42"
                      value={form.complement}
                      onChange={(e) => setForm((f) => ({ ...f, complement: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="notes">Observações adicionais (opcional)</Label>
              <Textarea
                id="notes"
                rows={2}
                placeholder="Ex.: Sem cebolinha, enviar hashi extra..."
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
          </section>

          {/* Forma de pagamento simulada */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">
              Forma de pagamento simulada *
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PAYMENT_OPTIONS.map((method) => {
                const selected = form.paymentMethod === method;
                return (
                  <label
                    key={method}
                    className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition-colors ${
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-foreground/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={selected}
                      onChange={() => setForm((f) => ({ ...f, paymentMethod: method }))}
                      className="sr-only"
                    />
                    {PAYMENT_LABELS[method]}
                  </label>
                );
              })}
            </div>

            {form.paymentMethod === "cash" && (
              <div className="space-y-1.5 rounded-lg border border-border bg-secondary/25 p-3">
                <Label htmlFor="cashAmount">Troco para quanto? (opcional)</Label>
                <Input
                  id="cashAmount"
                  inputMode="decimal"
                  placeholder={`Ex.: ${Math.ceil(totals.total / 10) * 10}`}
                  value={form.cashAmount}
                  onChange={(e) => setForm((f) => ({ ...f, cashAmount: e.target.value }))}
                  onBlur={() => markTouched("cashAmount")}
                  aria-invalid={showField("cashAmount") && validation.fields.cashAmount.status === "error"}
                  className={fieldBorderClass(validation.fields.cashAmount, showField("cashAmount"))}
                />
                {validation.fields.cashAmount.status === "error" && (
                  <p role="alert" className="flex items-center gap-1.5 text-xs text-status-unavailable">
                    <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                    {validation.fields.cashAmount.message}
                  </p>
                )}
                {changeInfo.change !== null && (
                  <p
                    data-testid="cash-change-preview"
                    className="flex items-center gap-1.5 text-xs font-medium text-status-available"
                  >
                    <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                    Troco estimado: {formatCurrency(changeInfo.change)}
                  </p>
                )}
              </div>
            )}

            <p className="status-pill-limited flex items-start gap-2 rounded-md px-3 py-2 text-xs">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Simulação local: nenhum pagamento real é processado e nenhuma cobrança é gerada.
            </p>
          </fieldset>

          {submitted && !validation.isValid && (
            <div
              role="alert"
              className="status-pill-unavailable flex items-center gap-2 rounded-md px-3 py-2 text-sm"
            >
              <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
              Verifique os campos destacados em vermelho antes de confirmar.
            </div>
          )}

          {submitError && (
            <div role="alert" className="status-pill-unavailable rounded-md px-3 py-2 text-sm">
              {submitError}
            </div>
          )}

          {isSubmitting && (
            <div
              role="status"
              className="status-pill-limited flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
            >
              <Loader2 className="size-4 animate-spin shrink-0" aria-hidden="true" />
              Registrando pedido...
            </div>
          )}

          <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Voltar ao carrinho
            </Button>
            <Button type="submit" disabled={isSubmitting || items.length === 0}>
              {isSubmitting ? "Confirmando..." : `Confirmar pedido · ${formatCurrency(totals.total)}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}