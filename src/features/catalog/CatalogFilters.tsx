import { motion } from "motion/react";
import { spring } from "@/shared/motion/tokens";
import { availableStyles, DEFAULT_FILTERS, type Filters } from "./filters";
import { CATEGORY_LABEL, type Dress, STYLE_LABEL } from "./types";

type Props = { filters: Filters; onChange: (f: Filters) => void; dresses: Dress[]; total: number };

export function CatalogFilters({ filters, onChange, dresses, total }: Props) {
  const categories: Filters["category"][] = ["todas", "noiva", "festa"];
  const styles = availableStyles(dresses, filters.category);
  return (
    <search className="filters">
      <fieldset className="chips">
        <legend className="sr-only">Categoria</legend>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className="chip"
            aria-pressed={filters.category === c}
            onClick={() => onChange({ ...filters, category: c, style: "todos" })}
          >
            {filters.category === c && (
              <motion.span layoutId="chip-bg" className="chip__bg" transition={spring} />
            )}
            <span className="chip__label">{c === "todas" ? "Todas" : CATEGORY_LABEL[c]}</span>
          </button>
        ))}
      </fieldset>
      <fieldset className="chips">
        <legend className="sr-only">Estilo</legend>
        {(["todos", ...styles] as const).map((s) => (
          <button
            key={s}
            type="button"
            className="chip chip--soft"
            aria-pressed={filters.style === s}
            onClick={() => onChange({ ...filters, style: s })}
          >
            {filters.style === s && (
              <motion.span layoutId="style-bg" className="chip__bg" transition={spring} />
            )}
            <span className="chip__label">
              {s === "todos" ? "Todos os estilos" : STYLE_LABEL[s]}
            </span>
          </button>
        ))}
      </fieldset>
      <div className="filters__row">
        <label className="search">
          <span className="sr-only">Buscar vestido</span>
          <input
            type="search"
            placeholder="Buscar pelo nome ou detalhe…"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
          />
        </label>
        <p className="muted" aria-live="polite">
          {total} {total === 1 ? "vestido" : "vestidos"}
        </p>
        <button type="button" className="link-btn" onClick={() => onChange(DEFAULT_FILTERS)}>
          Limpar filtros
        </button>
      </div>
    </search>
  );
}
