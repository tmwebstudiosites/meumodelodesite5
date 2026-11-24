import { Component, type ErrorInfo, type ReactNode } from "react";
import { captureError } from "@/shared/observability";

type State = { failed: boolean };

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    captureError(error, { componentStack: info.componentStack });
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="container fallback" role="alert">
        <h1>Algo saiu do esperado</h1>
        <p>Já fomos avisados. Recarregue a página ou fale conosco pelo WhatsApp.</p>
        <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
          Recarregar
        </button>
      </div>
    );
  }
}
