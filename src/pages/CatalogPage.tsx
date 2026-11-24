import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CatalogFilters,
  DEFAULT_FILTERS,
  DressGrid,
  type Filters,
  fetchDresses,
  filterDresses,
  useAsync,
} from "@/features/catalog";
import { Reveal } from "@/shared/ui/Reveal";
import { Skeleton } from "@/shared/ui/Skeleton";

export default function CatalogPage() {
  const [params] = useSearchParams();
  const initialCategory = params.get("categoria");
  const [filters, setFilters] = useState<Filters>({
    ...DEFAULT_FILTERS,
    category:
      initialCategory === "noiva" || initialCategory === "festa" ? initialCategory : "todas",
  });
  const state = useAsync("dresses", () => fetchDresses());
  const ready = state.status === "ready";
  const visible = useMemo(
    () => (ready ? filterDresses(state.data, filters) : null),
    [ready, state, filters],
  );

  return (
    <section className="section">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Catálogo</p>
          <h1 className="h2">Vestidos de noiva e festa</h1>
          <p className="lead">
            Escolha por categoria ou estilo. Os valores variam por peça e data — consulte-nos.
          </p>
        </Reveal>
        {ready ? (
          <CatalogFilters
            filters={filters}
            onChange={setFilters}
            dresses={state.data}
            total={visible?.length ?? 0}
          />
        ) : (
          <div className="filters" aria-hidden="true">
            <Skeleton height={44} width={320} radius={999} />
            <Skeleton height={44} width="100%" radius={999} />
          </div>
        )}
        {state.status === "error" ? (
          <p role="alert">Não foi possível carregar o catálogo. Tente novamente.</p>
        ) : (
          <DressGrid dresses={visible} skeletons={6} />
        )}
      </div>
    </section>
  );
}
