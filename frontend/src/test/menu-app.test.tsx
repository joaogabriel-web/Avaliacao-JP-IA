import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DEMO_PRODUCTS, type CategoryId } from "@/data/menu";
import { MenuPage } from "@/routes/index";

const IMAGE_KEYS: Record<Exclude<CategoryId, "todos">, string> = {
  combinados: "cat-combinados",
  sushis: "cat-sushis",
  sashimis: "cat-sashimis",
  temakis: "cat-temakis",
  "hot-rolls": "cat-hotrolls",
  entradas: "cat-entradas",
  bebidas: "cat-bebidas",
  sobremesas: "cat-sobremesas",
};

const API_PRODUCTS = DEMO_PRODUCTS.map(({ image, ...product }) => ({
  ...product,
  imageKey: IMAGE_KEYS[product.categoryId],
}));
const TEMAKI = API_PRODUCTS.find((product) => product.id === "temaki-salmao-completo")!;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function installApiMock(orderResponse?: Response) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    if (String(input) === "/api/menu") {
      return jsonResponse({ products: API_PRODUCTS });
    }
    if (String(input) === "/api/orders" && init?.method === "POST") {
      return (
        orderResponse ??
        jsonResponse(
          {
            orderNumber: "KS-1234",
            createdAt: "2026-03-01T12:00:00.000Z",
            customerName: "Ana Costa",
            fulfillment: "pickup",
            paymentMethod: "cash",
            cashPaid: 100,
            cashChange: 30.2,
            items: [{ product: { ...TEMAKI, stock: 10 }, quantity: 2 }],
            subtotal: 69.8,
            deliveryFee: 0,
            discount: 0,
            total: 69.8,
          },
          201,
        )
      );
    }
    return jsonResponse({ error: { message: "Rota não encontrada." } }, 404);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("Interface do Cardápio Digital Interativo", () => {
  beforeEach(() => {
    window.localStorage.clear();
    installApiMock();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("exibe produtos, filtra por pesquisa/categoria e bloqueia itens indisponíveis", async () => {
    render(<MenuPage />);

    expect(await screen.findByText("Combinado Omakase Kuroi")).toBeInTheDocument();

    const unavailableBtn = screen.getByRole("button", {
      name: /Sashimi Peixe Branco Ponzu indisponível/i,
    });
    expect(unavailableBtn).toBeDisabled();

    const searchInput = screen.getByLabelText("Pesquisar produtos pelo nome");
    fireEvent.change(searchInput, { target: { value: "Gyoza" } });
    expect(screen.getByText("Gyoza Grelhado na Chapa")).toBeInTheDocument();
    expect(screen.queryByText("Combinado Omakase Kuroi")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "PratoInexistente123" } });
    expect(screen.getByText("Nenhum produto encontrado")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Limpar filtros" })[0]!);
    expect(screen.getByText("Combinado Omakase Kuroi")).toBeInTheDocument();
  });

  it("registra o pedido pelo backend e atualiza o carrinho após confirmação", async () => {
    const fetchMock = installApiMock();
    render(<MenuPage />);
    await screen.findByText("Combinado Omakase Kuroi");

    fireEvent.click(
      screen.getByRole("button", { name: /Adicionar Temaki Salmão Completo ao carrinho/i }),
    );
    expect(screen.getByTestId("cart-badge-count")).toHaveTextContent("1");

    fireEvent.click(screen.getByRole("button", { name: /Abrir carrinho de compras/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /Aumentar quantidade de Temaki Salmão Completo/i }),
    );
    expect(screen.getByTestId("cart-qty-temaki-salmao-completo")).toHaveTextContent("2");

    fireEvent.click(screen.getByRole("button", { name: "Finalizar pedido" }));
    fireEvent.click(screen.getByRole("button", { name: /Confirmar pedido/i }));
    expect(screen.getByText("Nome do cliente é obrigatório.")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Nome do cliente *"), {
      target: { value: "Ana Costa" },
    });
    fireEvent.click(screen.getByText("Dinheiro"));
    fireEvent.change(screen.getByLabelText("Troco para quanto? (opcional)"), {
      target: { value: "100" },
    });
    expect(screen.getByTestId("cash-change-preview")).toHaveTextContent("R$ 30,20");

    fireEvent.click(screen.getByRole("button", { name: /Confirmar pedido/i }));
    await waitFor(() => {
      expect(screen.getByText("Pedido realizado com sucesso")).toBeInTheDocument();
    });

    expect(screen.getByTestId("demo-order-number").textContent).toMatch(/^#KS-\d{4}$/);
    expect(screen.getByText(/não foi transmitido/i)).toBeInTheDocument();
    expect(screen.getByRole("note")).toHaveTextContent(/banco SQLite local/i);
    const orderRequest = fetchMock.mock.calls.find(
      ([input, init]) => String(input) === "/api/orders" && init?.method === "POST",
    );
    expect(JSON.parse(String(orderRequest?.[1]?.body))).toMatchObject({
      customerName: "Ana Costa",
      paymentMethod: "cash",
      cashAmount: "100",
      items: [{ productId: "temaki-salmao-completo", quantity: 2 }],
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Voltar ao cardápio e iniciar novo pedido" }),
    );
    expect(screen.getByTestId("cart-badge-count")).toHaveTextContent("0");
  });

  it("exibe falhas da API ao registrar o pedido sem fechar o checkout", async () => {
    installApiMock(
      jsonResponse(
        {
          error: {
            code: "INSUFFICIENT_STOCK",
            message: "Temaki Salmão Completo não possui estoque suficiente.",
          },
        },
        409,
      ),
    );
    render(<MenuPage />);
    await screen.findByText("Combinado Omakase Kuroi");

    fireEvent.click(
      screen.getByRole("button", { name: /Adicionar Temaki Salmão Completo ao carrinho/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /Abrir carrinho de compras/i }));
    fireEvent.click(screen.getByRole("button", { name: "Finalizar pedido" }));
    fireEvent.change(screen.getByLabelText("Nome do cliente *"), {
      target: { value: "Ana Costa" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Confirmar pedido/i }));

    expect(
      await screen.findByText("Temaki Salmão Completo não possui estoque suficiente."),
    ).toBeInTheDocument();
    expect(screen.getByText("Finalização do pedido")).toBeInTheDocument();
  });

  it("permite tentar novamente quando o cardápio não pode ser carregado", async () => {
    let requestCount = 0;
    const fetchMock = vi.fn(async () => {
      requestCount += 1;
      if (requestCount === 1) {
        return jsonResponse(
          { error: { code: "UNAVAILABLE", message: "Backend indisponível." } },
          503,
        );
      }
      return jsonResponse({ products: API_PRODUCTS });
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<MenuPage />);

    expect(await screen.findByText("Backend indisponível.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(await screen.findByText("Combinado Omakase Kuroi")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
