import { obsEnv } from "./env";

/** Contrato comum a todos os provedores de observabilidade. */
export interface Provider {
  name: string;
  captureError(error: unknown, context?: Record<string, unknown>): void;
  track(event: string, props?: Record<string, unknown>): void;
}

/** Cada init é carregado sob demanda (import dinâmico): sem chave, nada entra no bundle inicial. */
export async function initSentry(): Promise<Provider | null> {
  if (!obsEnv.sentryDsn) return null;
  const Sentry = await import("@sentry/react");
  Sentry.init({
    dsn: obsEnv.sentryDsn,
    environment: obsEnv.env,
    release: obsEnv.version,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.2,
  });
  return {
    name: "sentry",
    captureError: (error, context) => Sentry.captureException(error, { extra: context }),
    track: (event, props) => Sentry.addBreadcrumb({ category: "ui", message: event, data: props }),
  };
}

export async function initDatadog(): Promise<Provider | null> {
  const { applicationId, clientToken, site } = obsEnv.dd;
  if (!applicationId || !clientToken) return null;
  const { datadogRum } = await import("@datadog/browser-rum");
  datadogRum.init({
    applicationId,
    clientToken,
    site,
    service: obsEnv.service,
    env: obsEnv.env,
    version: obsEnv.version,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: "mask-user-input",
  });
  return {
    name: "datadog",
    captureError: (error, context) => datadogRum.addError(error, context),
    track: (event, props) => datadogRum.addAction(event, props),
  };
}

export async function initNewRelic(): Promise<Provider | null> {
  const { accountID, trustKey, agentID, licenseKey, applicationID } = obsEnv.nr;
  if (!accountID || !licenseKey || !applicationID) return null;
  const { BrowserAgent } = await import("@newrelic/browser-agent/loaders/browser-agent");
  const agent = new BrowserAgent({
    init: {
      distributed_tracing: { enabled: true },
      privacy: { cookies_enabled: true },
      ajax: { deny_list: ["bam.nr-data.net"] },
    },
    info: {
      beacon: "bam.nr-data.net",
      errorBeacon: "bam.nr-data.net",
      licenseKey,
      applicationID,
      sa: 1,
    },
    loader_config: {
      accountID,
      trustKey: trustKey ?? accountID,
      agentID: agentID ?? applicationID,
      licenseKey,
      applicationID,
    },
  });
  return {
    name: "newrelic",
    captureError: (error) =>
      agent.noticeError(error instanceof Error ? error : new Error(String(error))),
    track: (event, props) => agent.addPageAction(event, props as Record<string, string>),
  };
}

export async function initOpenTelemetry(): Promise<Provider | null> {
  if (!obsEnv.otelUrl) return null;
  const [
    { WebTracerProvider, BatchSpanProcessor },
    { OTLPTraceExporter },
    { resourceFromAttributes },
    { ZoneContextManager },
    { registerInstrumentations },
    { DocumentLoadInstrumentation },
    { FetchInstrumentation },
    api,
  ] = await Promise.all([
    import("@opentelemetry/sdk-trace-web"),
    import("@opentelemetry/exporter-trace-otlp-http"),
    import("@opentelemetry/resources"),
    import("@opentelemetry/context-zone"),
    import("@opentelemetry/instrumentation"),
    import("@opentelemetry/instrumentation-document-load"),
    import("@opentelemetry/instrumentation-fetch"),
    import("@opentelemetry/api"),
  ]);
  const provider = new WebTracerProvider({
    resource: resourceFromAttributes({
      "service.name": obsEnv.service,
      "service.version": obsEnv.version,
      "deployment.environment": obsEnv.env,
    }),
    spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter({ url: obsEnv.otelUrl }))],
  });
  provider.register({ contextManager: new ZoneContextManager() });
  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [new DocumentLoadInstrumentation(), new FetchInstrumentation()],
  });
  const tracer = api.trace.getTracer(obsEnv.service);
  return {
    name: "opentelemetry",
    captureError: (error, context) => {
      const span = tracer.startSpan("error");
      span.recordException(error instanceof Error ? error : new Error(String(error)));
      if (context) span.setAttributes(context as Record<string, string>);
      span.setStatus({ code: api.SpanStatusCode.ERROR });
      span.end();
    },
    track: (event, props) => {
      const span = tracer.startSpan(`ui.${event}`);
      if (props) span.setAttributes(props as Record<string, string>);
      span.end();
    },
  };
}
