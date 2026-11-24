import type { Category, Dress, Style } from "./types";

export type Filters = { category: Category | "todas"; style: Style | "todos"; query: string };
export const DEFAULT_FILTERS: Filters = { category: "todas", style: "todos", query: "" };

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export function filterDresses(dresses: Dress[], f: Filters): Dress[] {
  const q = norm(f.query);
  return dresses.filter(
    (d) =>
      (f.category === "todas" || d.category === f.category) &&
      (f.style === "todos" || d.style === f.style) &&
      (q === "" || norm(`${d.name} ${d.headline}`).includes(q)),
  );
}

export function availableStyles(dresses: Dress[], category: Filters["category"]): Style[] {
  const set = new Set<Style>();
  for (const d of dresses) if (category === "todas" || d.category === category) set.add(d.style);
  return [...set];
}
