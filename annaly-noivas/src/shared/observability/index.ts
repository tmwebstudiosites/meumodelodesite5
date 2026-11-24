import {
  initDatadog,
  initNewRelic,
  initOpenTelemetry,
  initSentry,
  type Provider,
} from "./providers";

const providers: Provider[] = [];

/** Registra um provedor (usado no init e nos testes). */
export function registerProvider(provider: Provider): void {
  providers.push(provider);
}

export function resetProviders(): void {
  providers.length = 0;
}

/** Erros e eventos são enviados a todos os provedores ativos; falha de um nunca derruba o app. */
export function captureError(error: unknown, context?: Record<string, unknown>): void {
  for (const p of providers) {
    try {
      p.captureError(error, context);
    } catch {
      /* observabilidade nunca pode quebrar a aplicação */
    }
  }
}

export function track(event: string, props?: Record<string, unknown>): void {
  for (const p of providers) {
    try {
      p.track(event, props);
    } catch {
      /* idem */
    }
  }
}

/** Inicia, em paralelo e sem bloquear a renderização, todos os provedores configurados. */
export async function initObservability(): Promise<string[]> {
  const results = await Promise.allSettled([
    initSentry(),
    initDatadog(),
    initNewRelic(),
    initOpenTelemetry(),
  ]);
  for (const r of results) {
    if (r.status === "fulfilled" && r.value) registerProvider(r.value);
  }
  window.addEventListener("unhandledrejection", (e) =>
    captureError(e.reason, { source: "unhandledrejection" }),
  );
  return providers.map((p) => p.name);
}
