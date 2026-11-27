import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import heroSushi from "@/assets/hero-sushi.jpg";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { MenuHeader } from "@/components/MenuHeader";
import { OrderConfirmationModal } from "@/components/OrderConfirmationModal";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DEMO_PRODUCTS,
  MENU_CATEGORIES,
  type CategoryId,
  type ConfirmedOrder,
  type Product,
} from "@/data/menu";
import { useCart } from "@/hooks/use-cart";
import { calculateCartTotals, filterProducts } from "@/services/menu-service";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kuroi Sushi — Cardápio Digital Interativo (Demonstração)" },
      {
        name: "description",
        content:
          "Explore o cardápio digital interativo demonstrativo do Kuroi Sushi: combinados, sushis, sashimis, temakis, hot rolls, entradas, bebidas e sobremesas.",
      },
      { property: "og:title", content: "Kuroi Sushi — Cardápio Digital Interativo" },
      {
        property: "og:description",
        content:
          "Monte seu pedido demonstrativo de sushi com filtros por categoria, carrinho em tempo real e simulação de pagamento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

export function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  const {
    items,
    hydrated,
    getItemQuantity,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart(DEMO_PRODUCTS);

  const totals = useMemo(() => calculateCartTotals(items, "pickup"), [items]);
  const filteredProducts = useMemo(
    () => filterProducts(DEMO_PRODUCTS, selectedCategory, searchQuery),
    [selectedCategory, searchQuery],
  );

  const hasActiveFilters = selectedCategory !== "todos" || searchQuery.trim() !== "";

  const handleAddToCart = (product: Product, quantity = 1) => {
    const result = addItem(product, quantity);
    if (!result.ok) {
      toast.error(result.message ?? "Não foi possível adicionar este item.");
      return;
    }
    toast.success(
      `${quantity}× ${product.name} ${quantity === 1 ? "adicionado" : "adicionados"} ao carrinho.`,
    );
  };

  const handleUpdateQuantity = (productId: string, nextQty: number) => {
    const result = updateQuantity(productId, nextQty);
    if (!result.ok && result.message) {
      toast.warning(result.message);
    }
  };

  const handleRemoveItem = (productId: string) => {
    const item = items.find((entry) => entry.product.id === productId);
    removeItem(productId);
    if (item) {
      toast.info(`${item.product.name} removido do carrinho.`);
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast.info("Carrinho esvaziado.");
  };

  const handleClearFilters = () => {
    setSelectedCategory("todos");
    setSearchQuery("");
  };

  const handleOrderConfirmed = (order: ConfirmedOrder) => {
    setCheckoutOpen(false);
    setCartOpen(false);
    clearCart();
    setConfirmedOrder(order);
    toast.success(`Pedido demonstrativo #${order.orderNumber} confirmado.`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MenuHeader
        itemCount={totals.itemCount}
        subtotal={totals.subtotal}
        onOpenCart={() => setCartOpen(true)}
      />

      <section className="relative overflow-hidden bg-hero-surface text-hero-foreground">
        <img
          src={heroSushi}
          alt="Mesa japonesa contemporânea com seleção de sushis, nigiris e uramakis frescos"
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-hero-foreground/80">
            Culinária Japonesa Contemporânea · Versão Demonstrativa
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Sabores frescos, montados no seu ritmo.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-hero-foreground/85 sm:text-base">
            Escolha seus pratos favoritos, acompanhe disponibilidade em tempo real e simule seu
            pedido sem cadastro. Todos os itens, preços e estoques exibidos são demonstrativos.
          </p>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {/* Barra de pesquisa e filtros */}
        <section aria-label="Busca e categorias do cardápio" className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-md">
              <label htmlFor="menu-search" className="sr-only">
                Pesquisar produtos pelo nome
              </label>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="menu-search"
                type="search"
                placeholder="Pesquisar sushi, temaki, combinado..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 bg-card pl-9 pr-10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Limpar pesquisa"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground sm:justify-end">
              <span aria-live="polite">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "prato encontrado" : "pratos encontrados"}
              </span>
              {hasActiveFilters && (
                <Button type="button" variant="ghost" size="sm" onClick={handleClearFilters}>
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>

          <nav aria-label="Categorias do cardápio" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div className="flex w-max gap-2 pb-1 sm:w-auto sm:flex-wrap">
              {MENU_CATEGORIES.map((category) => {
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    aria-pressed={isActive}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-foreground/30 hover:bg-secondary"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </section>

        {/* Indicador amarelo de carregamento inicial */}
        {!hydrated && (
          <div
            role="status"
            className="status-pill-limited mt-6 flex items-center gap-2 rounded-md px-4 py-3 text-sm"
          >
            <Loader2 className="size-4 animate-spin shrink-0" aria-hidden="true" />
            Carregando preferências locais do carrinho...
          </div>
        )}

        {/* Grade de produtos */}
        <section aria-label="Lista de produtos" className="mt-6">
          {filteredProducts.length === 0 ? (
            <div
              role="status"
              className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-14 text-center"
            >
              <AlertTriangle className="size-8 text-status-warning" aria-hidden="true" />
              <h2 className="mt-3 font-display text-xl font-semibold text-foreground">
                Nenhum produto encontrado
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Não encontramos pratos compatíveis com{" "}
                {searchQuery.trim() ? `"${searchQuery.trim()}"` : "os filtros selecionados"}. Tente
                outro termo ou limpe os filtros.
              </p>
              <Button type="button" variant="outline" onClick={handleClearFilters} className="mt-4">
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantityInCart={getItemQuantity(product.id)}
                  onSelect={setSelectedProduct}
                  onQuickAdd={(item) => handleAddToCart(item, 1)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border bg-card py-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            <strong className="text-foreground">Kuroi Sushi</strong> · Aplicação demonstrativa
            executada localmente no navegador.
          </p>
          <p>Dados, preços, estoques e pedidos são simulados e não enviados a um restaurante real.</p>
        </div>
      </footer>

      <ProductDetailModal
        product={selectedProduct}
        quantityInCart={selectedProduct ? getItemQuantity(selectedProduct.id) : 0}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={items}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        items={items}
        onOrderConfirmed={handleOrderConfirmed}
      />

      <OrderConfirmationModal
        order={confirmedOrder}
        onStartNewOrder={() => setConfirmedOrder(null)}
      />
    </div>
  );
}
