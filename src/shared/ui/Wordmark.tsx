export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className={`wordmark ${light ? "wordmark--light" : ""}`}>
      <span className="sr-only">Annaly Noivas</span>
      <span className="wordmark__top" aria-hidden="true">
        Annaly
      </span>
      <span className="wordmark__script" aria-hidden="true">
        Noivas
      </span>
    </span>
  );
}
