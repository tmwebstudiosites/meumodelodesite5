import { SITE } from "@/shared/config/site";

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Monta o link wa.me com mensagem pré-preenchida. */
export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${onlyDigits(number)}?text=${encodeURIComponent(message)}`;
}

/**
 * Se houver número configurado, abre o WhatsApp já com a mensagem.
 * Caso contrário, usa o link oficial de contato do Instagram (que não aceita texto pré-preenchido).
 */
export function resolveContact(number: string | undefined, message: string) {
  const digits = onlyDigits(number ?? "");
  if (digits.length >= 12) return { url: buildWhatsAppUrl(digits, message), prefilled: true };
  return { url: SITE.contactLink, prefilled: false };
}
