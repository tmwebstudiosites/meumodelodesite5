import { describe, expect, it } from "vitest";
import {
  type BookingData,
  buildMessage,
  EMPTY_BOOKING,
  stepProgress,
  validateStep,
} from "./booking";

const TODAY = "2026-11-24";
const valid: BookingData = {
  ...EMPTY_BOOKING,
  name: "Maria Silva",
  phone: "(21) 99999-9999",
  eventDate: "2027-01-10",
};

describe("validateStep", () => {
  it("etapa 0 exige nome e telefone válidos", () => {
    expect(validateStep(0, EMPTY_BOOKING, TODAY)).toEqual({
      name: expect.any(String),
      phone: expect.any(String),
    });
    expect(validateStep(0, valid, TODAY)).toEqual({});
  });
  it("nome precisa de ao menos 3 caracteres (limite)", () => {
    expect(validateStep(0, { ...valid, name: "Ana" }, TODAY).name).toBeUndefined();
    expect(validateStep(0, { ...valid, name: "An" }, TODAY).name).toBeDefined();
    expect(validateStep(0, { ...valid, name: "  A  " }, TODAY).name).toBeDefined();
  });
  it("telefone aceita 10 ou 11 dígitos", () => {
    expect(validateStep(0, { ...valid, phone: "2133334444" }, TODAY).phone).toBeUndefined();
    expect(validateStep(0, { ...valid, phone: "21999999999" }, TODAY).phone).toBeUndefined();
    expect(validateStep(0, { ...valid, phone: "213333444" }, TODAY).phone).toBeDefined();
    expect(validateStep(0, { ...valid, phone: "219999999999" }, TODAY).phone).toBeDefined();
  });
  it("etapa 1 exige data futura (hoje é aceito)", () => {
    expect(validateStep(1, { ...valid, eventDate: "" }, TODAY).eventDate).toBe(
      "Escolha a data do evento.",
    );
    expect(validateStep(1, { ...valid, eventDate: "2026-11-23" }, TODAY).eventDate).toBe(
      "A data precisa ser futura.",
    );
    expect(validateStep(1, { ...valid, eventDate: TODAY }, TODAY)).toEqual({});
  });
  it("etapa 1 não valida nome e etapa 0 não valida data", () => {
    expect(validateStep(1, EMPTY_BOOKING, TODAY).name).toBeUndefined();
    expect(validateStep(0, valid, TODAY).eventDate).toBeUndefined();
  });
  it("etapa 2 não tem validações", () => {
    expect(validateStep(2, EMPTY_BOOKING, TODAY)).toEqual({});
  });
});

describe("buildMessage", () => {
  it("monta a mensagem completa", () => {
    const msg = buildMessage({ ...valid, dress: "Aurora", notes: " Prova no sábado " });
    expect(msg).toBe(
      [
        "Olá, Annaly Noivas! Gostaria de agendar uma prova.",
        "Nome: Maria Silva",
        "Telefone: (21) 99999-9999",
        "Evento: Casamento (noiva) em 10/01/2027",
        "Vestido de interesse: Aurora",
        "Observações: Prova no sábado",
      ].join("\n"),
    );
  });
  it("omite vestido e observações vazios", () => {
    const msg = buildMessage(valid);
    expect(msg).not.toContain("Vestido de interesse");
    expect(msg).not.toContain("Observações");
    expect(buildMessage({ ...valid, notes: "   " })).not.toContain("Observações");
  });
});

describe("stepProgress", () => {
  it("avança de 33% a 100%", () => {
    expect([0, 1, 2].map((s) => stepProgress(s as 0 | 1 | 2))).toEqual([33, 67, 100]);
  });
});
