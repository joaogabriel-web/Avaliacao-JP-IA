import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MenuPage } from "@/routes/index";

describe("Interface do Cardápio Digital Interativo", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("exibe produtos, filtra por pesquisa/categoria e bloqueia itens indisponíveis", () => {
    render(<MenuPage />);

    expect(screen.getByText("Combinado Omakase Kuroi")).toBeInTheDocument();

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

  it("adiciona ao carrinho, ajusta quantidade, valida checkout, calcula troco e confirma pedido", async () => {
    render(<MenuPage />);

    // Adicionar produto disponível
    fireEvent.click(
      screen.getByRole("button", { name: /Adicionar Temaki Salmão Completo ao carrinho/i }),
    );
    expect(screen.getByTestId("cart-badge-count")).toHaveTextContent("1");

    // Abrir carrinho e aumentar quantidade
    fireEvent.click(screen.getByRole("button", { name: /Abrir carrinho de compras/i }));
    expect(screen.getByText("Seu carrinho")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Aumentar quantidade de Temaki Salmão Completo/i }),
    );
    expect(screen.getByTestId("cart-qty-temaki-salmao-completo")).toHaveTextContent("2");

    // Ir para finalização
    fireEvent.click(screen.getByRole("button", { name: "Finalizar pedido" }));
    expect(screen.getByText("Finalização do pedido")).toBeInTheDocument();

    // Tentar enviar sem nome -> erro de validação
    fireEvent.click(screen.getByRole("button", { name: /Confirmar pedido/i }));
    expect(screen.getByText("Nome do cliente é obrigatório.")).toBeInTheDocument();

    // Preencher nome e selecionar Dinheiro com troco
    fireEvent.change(screen.getByLabelText("Nome do cliente *"), {
      target: { value: "Ana Costa" },
    });
    fireEvent.click(screen.getByText("Dinheiro"));
    fireEvent.change(screen.getByLabelText("Troco para quanto? (opcional)"), {
      target: { value: "100" },
    });
    expect(screen.getByTestId("cash-change-preview")).toHaveTextContent("R$ 30,20");

    // Confirmar pedido demonstrativo
    fireEvent.click(screen.getByRole("button", { name: /Confirmar pedido/i }));

    await waitFor(
      () => {
        expect(screen.getByText("Pedido realizado com sucesso")).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    expect(screen.getByTestId("demo-order-number").textContent).toMatch(/^#KS-\d{4}$/);
    expect(screen.getByText(/não foi transmitido/i)).toBeInTheDocument();

    // Voltar ao cardápio e verificar carrinho zerado
    fireEvent.click(
      screen.getByRole("button", { name: "Voltar ao cardápio e iniciar novo pedido" }),
    );
    expect(screen.getByTestId("cart-badge-count")).toHaveTextContent("0");
  });
});