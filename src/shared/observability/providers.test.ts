import { beforeEach, describe, expect, it, vi } from "vitest";

const sentry = vi.hoisted(() => ({
  init: vi.fn(),
  captureException: vi.fn(),
  addBreadcrumb: vi.fn(),
  browserTracingIntegration: vi.fn(() => ({})),
}));
const dd = vi.hoisted(() => ({ init: vi.fn(), addError: vi.fn(), addAction: vi.fn() }));
const nr = vi.hoisted(() => ({ noticeError: vi.fn(), addPageAction: vi.fn(), ctor: vi.fn() }));
const span = vi.hoisted(() => ({
  recordException: vi.fn(),
  setAttributes: vi.fn(),
  setStatus: vi.fn(),
  end: vi.fn(),
}));
const otel = vi.hoisted(() => ({
  register: vi.fn(),
  registerInstrumentations: vi.fn(),
  exporter: vi.fn(),
}));

vi.mock("./env", () => ({
  obsEnv: {
    env: "test",
    version: "9.9.9",
    service: "svc",
    sentryDsn: "https://k@o.ingest.sentry.io/1",
    otelUrl: "https://otel/v1/traces",
    dd: { applicationId: "app", clientToken: "tok", site: "datadoghq.com" },
    nr: { accountID: "1", trustKey: "2", agentID: "3", licenseKey: "key", applicationID: "4" },
  },
}));
vi.mock("@sentry/react", () => sentry);
vi.mock("@datadog/browser-rum", () => ({ datadogRum: dd }));
vi.mock("@newrelic/browser-agent/loaders/browser-agent", () => ({
  BrowserAgent: class {
    constructor(o: unknown) {
      nr.ctor(o);
    }
    noticeError = nr.noticeError;
    addPageAction = nr.addPageAction;
  },
}));
vi.mock("@opentelemetry/sdk-trace-web", () => ({
  WebTracerProvider: class {
    register = otel.register;
  },
  BatchSpanProcessor: class {},
}));
vi.mock("@opentelemetry/exporter-trace-otlp-http", () => ({
  OTLPTraceExporter: class {
    constructor(o: unknown) {
      otel.exporter(o);
    }
  },
}));
vi.mock("@opentelemetry/resources", () => ({ resourceFromAttributes: (a: unknown) => a }));
vi.mock("@opentelemetry/context-zone", () => ({ ZoneContextManager: class {} }));
vi.mock("@opentelemetry/instrumentation", () => ({
  registerInstrumentations: otel.registerInstrumentations,
}));
vi.mock("@opentelemetry/instrumentation-document-load", () => ({
  DocumentLoadInstrumentation: class {},
}));
vi.mock("@opentelemetry/instrumentation-fetch", () => ({ FetchInstrumentation: class {} }));
vi.mock("@opentelemetry/api", () => ({
  trace: { getTracer: () => ({ startSpan: () => span }) },
  SpanStatusCode: { ERROR: 2 },
}));

import { initObservability, resetProviders } from "./index";
import { initDatadog, initNewRelic, initOpenTelemetry, initSentry } from "./providers";

beforeEach(() => {
  vi.clearAllMocks();
  resetProviders();
});

describe("provedores configurados", () => {
  it("Sentry inicializa com release/ambiente e encaminha erros e eventos", async () => {
    const p = await initSentry();
    expect(sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({ environment: "test", release: "9.9.9" }),
    );
    const err = new Error("x");
    p?.captureError(err, { a: 1 });
    p?.track("evt", { b: 2 });
    expect(sentry.captureException).toHaveBeenCalledWith(err, { extra: { a: 1 } });
    expect(sentry.addBreadcrumb).toHaveBeenCalledWith({
      category: "ui",
      message: "evt",
      data: { b: 2 },
    });
  });
  it("Datadog RUM mascara inputs e encaminha", async () => {
    const p = await initDatadog();
    expect(dd.init).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationId: "app",
        defaultPrivacyLevel: "mask-user-input",
        service: "svc",
      }),
    );
    p?.captureError("e", { c: 3 });
    p?.track("evt");
    expect(dd.addError).toHaveBeenCalledWith("e", { c: 3 });
    expect(dd.addAction).toHaveBeenCalledWith("evt", undefined);
  });
  it("New Relic recebe config e converte não-Error em Error", async () => {
    const p = await initNewRelic();
    expect(nr.ctor).toHaveBeenCalledWith(
      expect.objectContaining({
        info: expect.objectContaining({ licenseKey: "key", applicationID: "4" }),
      }),
    );
    p?.captureError("texto");
    expect(nr.noticeError).toHaveBeenCalledWith(expect.objectContaining({ message: "texto" }));
    const e = new Error("real");
    p?.captureError(e);
    expect(nr.noticeError).toHaveBeenLastCalledWith(e);
    p?.track("evt", { d: "4" });
    expect(nr.addPageAction).toHaveBeenCalledWith("evt", { d: "4" });
  });
  it("OpenTelemetry registra instrumentação e cria spans", async () => {
    const p = await initOpenTelemetry();
    expect(otel.exporter).toHaveBeenCalledWith({ url: "https://otel/v1/traces" });
    expect(otel.register).toHaveBeenCalled();
    expect(otel.registerInstrumentations).toHaveBeenCalled();
    p?.captureError(new Error("o"), { k: "v" });
    expect(span.recordException).toHaveBeenCalled();
    expect(span.setStatus).toHaveBeenCalledWith({ code: 2 });
    expect(span.end).toHaveBeenCalled();
    p?.captureError("str");
    p?.track("evt", { z: "1" });
    expect(span.setAttributes).toHaveBeenCalledWith({ z: "1" });
  });
  it("initObservability ativa os quatro", async () => {
    expect(await initObservability()).toEqual(["sentry", "datadog", "newrelic", "opentelemetry"]);
  });
});
