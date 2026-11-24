import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { registerProvider, resetProviders } from "@/shared/observability";
import { renderWithRouter } from "@/test/utils";
import { Button } from "./Button";
import { ErrorBoundary } from "./ErrorBoundary";
import { LazyImage } from "./LazyImage";
import { ProgressBar } from "./Progress";
import { Skeleton, SkeletonText } from "./Skeleton";

describe("Skeleton", () => {
  it("fica escondido de leitores de tela", () => {
    renderWithRouter(<Skeleton />);
    expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-hidden", "true");
  });
  it("SkeletonText renderiza N linhas e anuncia carregamento", () => {
    renderWithRouter(<SkeletonText lines={4} />);
    expect(screen.getAllByTestId("skeleton")).toHaveLength(4);
    expect(screen.getByRole("status", { name: "Carregando" })).toBeInTheDocument();
  });
});

describe("LazyImage", () => {
  it("mostra skeleton até a imagem carregar e usa lazy loading", () => {
    renderWithRouter(<LazyImage name="noiva-renda" alt="Noiva" />);
    const img = screen.getByAltText("Noiva");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    fireEvent.load(img);
    expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    expect(screen.getByTestId("lazy-image")).toHaveClass("is-loaded");
  });
  it("priority carrega imediatamente", () => {
    renderWithRouter(<LazyImage name="logo" alt="Logo" priority />);
    expect(screen.getByAltText("Logo")).toHaveAttribute("loading", "eager");
  });
});

describe("ProgressBar", () => {
  it.each([
    [-10, 0],
    [42.4, 42],
    [250, 100],
  ])("limita %s a %s", (v, expected) => {
    renderWithRouter(<ProgressBar value={v} label="p" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(expected));
  });
});

describe("Button", () => {
  it("em loading fica desabilitado e ocupado", () => {
    renderWithRouter(<Button loading>Enviar</Button>);
    const b = screen.getByRole("button", { name: "Enviar" });
    expect(b).toBeDisabled();
    expect(b).toHaveAttribute("aria-busy", "true");
  });
});

describe("ErrorBoundary", () => {
  it("mostra fallback e reporta o erro à observabilidade", () => {
    const spy = vi.fn();
    registerProvider({ name: "t", captureError: spy, track: vi.fn() });
    const Boom = () => {
      throw new Error("falhou");
    };
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    act(() => {
      renderWithRouter(
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>,
      );
    });
    expect(screen.getByRole("alert")).toHaveTextContent("Algo saiu do esperado");
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ message: "falhou" }),
      expect.any(Object),
    );
    resetProviders();
  });
});
