import { useEffect, useRef, useState } from "react";
import { captureError } from "@/shared/observability";

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error"; error: unknown };

/** Carrega dados assíncronos identificados por `key`; recarrega (com estado "loading") quando a chave muda. */
export function useAsync<T>(key: string, load: (key: string) => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });
  const loadRef = useRef(load);
  loadRef.current = load;
  useEffect(() => {
    let alive = true;
    setState({ status: "loading" });
    loadRef.current(key).then(
      (data) => alive && setState({ status: "ready", data }),
      (error) => {
        captureError(error, { source: "useAsync", key });
        if (alive) setState({ status: "error", error });
      },
    );
    return () => {
      alive = false;
    };
  }, [key]);
  return state;
}
