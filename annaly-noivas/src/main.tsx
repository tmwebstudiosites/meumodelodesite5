import "@fontsource-variable/cormorant";
import "@fontsource-variable/inter";
import "@fontsource/pinyon-script";
import "./styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import { initObservability } from "./shared/observability";

const root = document.getElementById("root");
if (!root) throw new Error("Elemento #root não encontrado");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Observabilidade inicia depois da primeira renderização, sem bloquear o LCP.
void initObservability();
