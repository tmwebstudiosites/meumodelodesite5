import { describe, expect, it } from "vitest";
import { DRESSES } from "./data";
import { availableStyles, DEFAULT_FILTERS, filterDresses } from "./filters";

describe("filterDresses", () => {
  it("sem filtros devolve tudo", () => {
    expect(filterDresses(DRESSES, DEFAULT_FILTERS)).toHaveLength(DRESSES.length);
  });
  it("filtra por categoria", () => {
    const r = filterDresses(DRESSES, { ...DEFAULT_FILTERS, category: "festa" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((d) => d.category === "festa")).toBe(true);
  });
  it("filtra por estilo", () => {
    const r = filterDresses(DRESSES, { ...DEFAULT_FILTERS, style: "sereia" });
    expect(r.every((d) => d.style === "sereia")).toBe(true);
  });
  it("busca ignora acentos, caixa e espaços", () => {
    expect(
      filterDresses(DRESSES, { ...DEFAULT_FILTERS, query: "  âMBAR " }).map((d) => d.slug),
    ).toEqual(["ambar"]);
    expect(filterDresses(DRESSES, { ...DEFAULT_FILTERS, query: "ambar" })).toHaveLength(1);
  });
  it("busca também olha o texto de destaque", () => {
    expect(
      filterDresses(DRESSES, { ...DEFAULT_FILTERS, query: "paetês" }).map((d) => d.slug),
    ).toEqual(["noir"]);
  });
  it("combina filtros (E lógico)", () => {
    expect(filterDresses(DRESSES, { category: "noiva", style: "sereia", query: "" })).toEqual([]);
  });
  it("retorna vazio quando nada casa", () => {
    expect(filterDresses(DRESSES, { ...DEFAULT_FILTERS, query: "zzzz" })).toEqual([]);
  });
});

describe("availableStyles", () => {
  it("lista estilos sem repetição da categoria", () => {
    expect(availableStyles(DRESSES, "festa")).toEqual(["sereia"]);
    expect(new Set(availableStyles(DRESSES, "todas")).size).toBe(
      availableStyles(DRESSES, "todas").length,
    );
  });
});

describe("catálogo", () => {
  it("slugs são únicos", () => {
    expect(new Set(DRESSES.map((d) => d.slug)).size).toBe(DRESSES.length);
  });
});
