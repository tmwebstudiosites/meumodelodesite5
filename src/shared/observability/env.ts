const e = import.meta.env;

export const obsEnv = {
  env: (e.VITE_APP_ENV as string | undefined) ?? e.MODE,
  version: (e.VITE_APP_VERSION as string | undefined) ?? "0.0.0",
  service: "annaly-noivas-web",
  sentryDsn: e.VITE_SENTRY_DSN as string | undefined,
  otelUrl: e.VITE_OTEL_EXPORTER_URL as string | undefined,
  dd: {
    applicationId: e.VITE_DD_APPLICATION_ID as string | undefined,
    clientToken: e.VITE_DD_CLIENT_TOKEN as string | undefined,
    site: (e.VITE_DD_SITE as string | undefined) ?? "datadoghq.com",
  },
  nr: {
    accountID: e.VITE_NR_ACCOUNT_ID as string | undefined,
    trustKey: e.VITE_NR_TRUST_KEY as string | undefined,
    agentID: e.VITE_NR_AGENT_ID as string | undefined,
    licenseKey: e.VITE_NR_LICENSE_KEY as string | undefined,
    applicationID: e.VITE_NR_APPLICATION_ID as string | undefined,
  },
};
