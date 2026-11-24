import { describe, expect, it } from "vitest";
import { SITE } from "@/shared/config/site";
import { formatDateBR, formatPhone } from "./format";
import { buildWhatsAppUrl, onlyDigits, resolveContact } from "./whatsapp";

describe("formatPhone", () => {
  it.each([
    ["", ""],
    ["2", "2"],
    ["21", "21"],
    ["219", "(21) 9"],
    ["212222", "(21) 2222"],
    ["2133334444", "(21) 3333-4444"],
    ["21999998888", "(21) 99999-8888"],
    ["2199999888877", "(21) 99999-8888"],
    ["(21) 99999-8888", "(21) 99999-8888"],
  ])("%s → %s", (input, out) => expect(formatPhone(input)).toBe(out));
});

describe("formatDateBR", () => {
  it("inverte ISO para dd/mm/aaaa", () => expect(formatDateBR("2026-12-05")).toBe("05/12/2026"));
  it("devolve o original se for inválido", () => expect(formatDateBR("xx")).toBe("xx"));
});

describe("whatsapp", () => {
  it("onlyDigits", () => expect(onlyDigits("+55 (21) 9-9999")).toBe("5521" + "99999"));
  it("buildWhatsAppUrl codifica a mensagem", () => {
    expect(buildWhatsAppUrl("+55 21 99999-9999", "Olá & tudo")).toBe(
      "https://wa.me/5521999999999?text=Ol%C3%A1%20%26%20tudo",
    );
  });
  it("com número válido, abre wa.me pré-preenchido", () => {
    expect(resolveContact("5521999999999", "oi")).toEqual({
      url: "https://wa.me/5521999999999?text=oi",
      prefilled: true,
    });
  });
  it("sem número (ou inválido), usa o link bit.ly", () => {
    expect(resolveContact(undefined, "oi")).toEqual({ url: SITE.contactLink, prefilled: false });
    expect(resolveContact("2199", "oi")).toEqual({ url: SITE.contactLink, prefilled: false });
    expect(resolveContact("552199999999", "oi").prefilled).toBe(true);
  });
});
