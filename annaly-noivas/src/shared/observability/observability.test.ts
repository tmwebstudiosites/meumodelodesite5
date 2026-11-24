import { afterEach, describe, expect, it, vi } from "vitest";
import { captureError, initObservability, registerProvider, resetProviders, track } from "./index";

afterEach(() => resetProviders());

const mk = (name: string) => ({ name, captureError: vi.fn(), track: vi.fn() });

describe("observability facade", () => {
  it("envia erros e eventos a todos os provedores", () => {
    const a = mk("a");
    const b = mk("b");
    registerProvider(a);
    registerProvider(b);
    const err = new Error("x");
    captureError(err, { k: 1 });
    track("click", { id: 2 });
    for (const p of [a, b]) {
      expect(p.captureError).toHaveBeenCalledWith(err, { k: 1 });
      expect(p.track).toHaveBeenCalledWith("click", { id: 2 });
    }
  });
  it("falha em um provedor não afeta os demais nem quebra o app", () => {
    const bad = {
      name: "bad",
      captureError: () => {
        throw new Error("boom");
      },
      track: () => {
        throw new Error("boom");
      },
    };
    const ok = mk("ok");
    registerProvider(bad);
    registerProvider(ok);
    expect(() => captureError("e")).not.toThrow();
    expect(() => track("t")).not.toThrow();
    expect(ok.captureError).toHaveBeenCalled();
    expect(ok.track).toHaveBeenCalled();
  });
  it("sem chaves configuradas, nenhum provedor é ativado", async () => {
    expect(await initObservability()).toEqual([]);
  });
  it("promessas rejeitadas sem tratamento são reportadas", async () => {
    const p = mk("p");
    await initObservability();
    registerProvider(p);
    const ev = new Event("unhandledrejection") as Event & { reason: unknown };
    ev.reason = new Error("rej");
    window.dispatchEvent(ev);
    expect(p.captureError).toHaveBeenCalledWith(ev.reason, { source: "unhandledrejection" });
  });
});
