import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "@/test/utils";
import BookingPage from "./BookingPage";
import CatalogPage from "./CatalogPage";
import DressPage from "./DressPage";
import NotFoundPage from "./NotFoundPage";

beforeEach(() => vi.useRealTimers());
afterEach(() => vi.restoreAllMocks());

describe("CatalogPage (integração)", () => {
  it("mostra skeletons e depois os vestidos", async () => {
    renderWithRouter(<CatalogPage />, "/vestidos");
    expect(screen.getAllByTestId("dress-skeleton").length).toBeGreaterThan(0);
    expect(await screen.findByRole("heading", { name: "Aurora" })).toBeInTheDocument();
    expect(screen.queryAllByTestId("dress-skeleton")).toHaveLength(0);
  });
  it("filtra por categoria e busca, e mostra estado vazio", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CatalogPage />, "/vestidos");
    await screen.findByRole("heading", { name: "Aurora" });
    await user.click(screen.getByRole("button", { name: "Festa" }));
    await waitFor(() =>
      expect(screen.queryByRole("heading", { name: "Aurora" })).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("heading", { name: "Noir" })).toBeInTheDocument();
    expect(screen.getByText("2 vestidos")).toBeInTheDocument();
    await user.type(screen.getByRole("searchbox"), "zzzz");
    expect(await screen.findByText(/Nenhum vestido encontrado/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(await screen.findByRole("heading", { name: "Aurora" })).toBeInTheDocument();
  });
  it("respeita ?categoria= na URL", async () => {
    renderWithRouter(<CatalogPage />, "/vestidos?categoria=festa");
    expect(await screen.findByRole("heading", { name: "Noir" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Aurora" })).not.toBeInTheDocument();
  });
});

describe("DressPage", () => {
  const ui = (
    <Routes>
      <Route path="/vestidos/:slug" element={<DressPage />} />
    </Routes>
  );
  it("carrega o detalhe com skeleton inicial", async () => {
    renderWithRouter(ui, "/vestidos/helena");
    expect(screen.getByRole("status", { name: "Carregando vestido" })).toBeInTheDocument();
    expect(await screen.findByRole("heading", { level: 1, name: "Helena" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Quero provar o Helena/ })).toHaveAttribute(
      "href",
      "/agendar?vestido=Helena",
    );
  });
  it("slug inexistente leva à página 404", async () => {
    renderWithRouter(ui, "/vestidos/nada");
    expect(
      await screen.findByRole("heading", { name: "Página não encontrada" }),
    ).toBeInTheDocument();
  });
});

describe("NotFoundPage", () => {
  it("oferece caminho de volta", () => {
    renderWithRouter(<NotFoundPage />);
    expect(screen.getByRole("link", { name: "Ver vestidos" })).toHaveAttribute("href", "/vestidos");
  });
});

describe("BookingPage (fluxo completo)", () => {
  it("valida, avança etapas, mostra revisão e abre o contato", async () => {
    const user = userEvent.setup();
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    renderWithRouter(<BookingPage />, "/agendar?vestido=Aurora");

    const bar = () => screen.getByRole("progressbar", { name: "Progresso do agendamento" });
    expect(bar()).toHaveAttribute("aria-valuenow", "33");

    // etapa 1: validação
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(await screen.findByText("Informe seu nome completo.")).toBeInTheDocument();
    expect(screen.getByText("Informe um telefone com DDD.")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Nome completo"), "Maria Silva");
    await user.type(screen.getByLabelText(/WhatsApp/), "21999998888");
    expect(screen.getByLabelText(/WhatsApp/)).toHaveValue("(21) 99999-8888");
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    // etapa 2
    expect(await screen.findByLabelText("Data do evento")).toBeInTheDocument();
    expect(bar()).toHaveAttribute("aria-valuenow", "67");
    expect(screen.getByLabelText(/Vestido de interesse/)).toHaveValue("Aurora");
    await user.click(screen.getByRole("button", { name: "Continuar" }));
    expect(await screen.findByText("Escolha a data do evento.")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Data do evento"), "2099-01-10");
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    // etapa 3: revisão — o clique em "Continuar" nunca deve enviar o formulário por engano
    expect(open).not.toHaveBeenCalled();
    expect(await screen.findByText("Maria Silva")).toBeInTheDocument();
    expect(screen.getByText(/10\/01\/2099/)).toBeInTheDocument();
    expect(bar()).toHaveAttribute("aria-valuenow", "100");

    // voltar mantém dados
    await user.click(screen.getByRole("button", { name: "Voltar" }));
    expect(await screen.findByLabelText("Data do evento")).toHaveValue("2099-01-10");
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.click(await screen.findByRole("button", { name: "Enviar pelo WhatsApp" }));
    expect(await screen.findByRole("button", { name: /Preparando mensagem/ })).toBeDisabled();
    const done = await screen.findByRole("status", {}, { timeout: 3000 });
    expect(within(done).getByText("Tudo pronto!")).toBeInTheDocument();
    expect(open).toHaveBeenCalledWith(
      "https://bit.ly/ContatoAnnalynoivas",
      "_blank",
      "noopener,noreferrer",
    );
  });
});
