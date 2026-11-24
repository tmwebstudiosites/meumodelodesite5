import { formatDateBR } from "@/shared/lib/format";
import { onlyDigits } from "@/shared/lib/whatsapp";

export const EVENT_TYPES = [
  "Casamento (noiva)",
  "Madrinha",
  "Formatura",
  "Debutante",
  "Outro evento",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export type BookingData = {
  name: string;
  phone: string;
  eventType: EventType;
  eventDate: string;
  dress: string;
  notes: string;
};
export type BookingErrors = Partial<Record<keyof BookingData, string>>;
export const EMPTY_BOOKING: BookingData = {
  name: "",
  phone: "",
  eventType: "Casamento (noiva)",
  eventDate: "",
  dress: "",
  notes: "",
};

export type StepId = 0 | 1 | 2;
export const STEP_TITLES = ["Seus dados", "Seu evento", "Revisar e enviar"] as const;

/** Valida apenas os campos da etapa informada. `today` é injetável para testes. */
export function validateStep(
  step: StepId,
  data: BookingData,
  today: string = new Date().toISOString().slice(0, 10),
): BookingErrors {
  const errors: BookingErrors = {};
  if (step === 0) {
    if (data.name.trim().length < 3) errors.name = "Informe seu nome completo.";
    const len = onlyDigits(data.phone).length;
    if (len < 10 || len > 11) errors.phone = "Informe um telefone com DDD.";
  }
  if (step === 1) {
    if (!data.eventDate) errors.eventDate = "Escolha a data do evento.";
    else if (data.eventDate < today) errors.eventDate = "A data precisa ser futura.";
  }
  return errors;
}

export function buildMessage(d: BookingData): string {
  const lines = [
    "Olá, Annaly Noivas! Gostaria de agendar uma prova.",
    `Nome: ${d.name.trim()}`,
    `Telefone: ${d.phone}`,
    `Evento: ${d.eventType} em ${formatDateBR(d.eventDate)}`,
  ];
  if (d.dress) lines.push(`Vestido de interesse: ${d.dress}`);
  if (d.notes.trim()) lines.push(`Observações: ${d.notes.trim()}`);
  return lines.join("\n");
}

/** Progresso (0–100) conforme a etapa atual. */
export function stepProgress(step: StepId): number {
  return Math.round(((step + 1) / STEP_TITLES.length) * 100);
}
