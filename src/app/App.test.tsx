import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";

const go = (path: string) => window.history.pushState({}, "", path);
beforeEach(() => go("/"));

describe("App (integração completa)", () => {
  it("carrega a home com skeleton de rota e depois o conteúdo", async () => {
    render(<App />);
    expect(
      await screen.findByRole("heading", { level: 1, name: /Vestidos de noiva e festa/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pular para o conteúdo" })).toHaveAttribute(
      "href",
      "#conteudo",
    );
    expect(await screen.findByRole("heading", { name: "Peças que encantam" })).toBeInTheDocument();
  });

  it("navega entre páginas pelo menu e anima a troca", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { level: 1, name: /Vestidos de noiva e festa/ });
    const nav = screen.getByRole("navigation", { name: "Principal" });
    await user.click(within(nav).getByRole("link", { name: "Vestidos" }));
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: "Vestidos de noiva e festa" },
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/vestidos");
    expect(screen.getByRole("progressbar", { name: "Carregando página" })).toBeInTheDocument();
  });

  it("abre o menu mobile e fecha ao navegar", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { level: 1, name: /Vestidos de noiva e festa/ });
    const burger = screen.getByRole("button", { name: "Menu" });
    await user.click(burger);
    expect(burger).toHaveAttribute("aria-expanded", "true");
    const mobile = await screen.findByRole("navigation", { name: "Mobile" });
    await user.click(within(mobile).getByRole("link", { name: "Agendar prova" }));
    await waitFor(() =>
      expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument(),
    );
    expect(
      await screen.findByRole("heading", { name: "Agende a sua prova" }, { timeout: 3000 }),
    ).toBeInTheDocument();
  });

  it("FAQ expande e recolhe", async () => {
    const user = userEvent.setup();
    render(<App />);
    const q = await screen.findByRole("button", { name: /Preciso agendar para provar/ });
    expect(q).toHaveAttribute("aria-expanded", "false");
    await user.click(q);
    expect(q).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByText(/receber você com calma/)).toBeInTheDocument();
    await user.click(q);
    await waitFor(() =>
      expect(screen.queryByText(/receber você com calma/)).not.toBeInTheDocument(),
    );
  });

  it("rota desconhecida mostra 404", async () => {
    go("/nao-existe");
    render(<App />);
    expect(
      await screen.findByRole("heading", { name: "Página não encontrada" }),
    ).toBeInTheDocument();
  });

  it("rodapé traz endereço e links externos seguros", async () => {
    render(<App />);
    await screen.findByRole("heading", { level: 1, name: /Vestidos de noiva e festa/ });
    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText(/Rua da Conceição, 181/)).toBeInTheDocument();
    const insta = within(footer).getByRole("link", { name: /Instagram/ });
    expect(insta).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
