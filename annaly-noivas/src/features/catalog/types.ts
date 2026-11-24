import type { ImageKey } from "@/shared/lib/images.generated";

export type Category = "noiva" | "festa";
export type Style = "princesa" | "minimalista" | "romantico" | "sereia";

export type Dress = {
  slug: string;
  name: string;
  category: Category;
  style: Style;
  image: ImageKey;
  headline: string;
  details: string[];
};

export const CATEGORY_LABEL: Record<Category, string> = { noiva: "Noivas", festa: "Festa" };
export const STYLE_LABEL: Record<Style, string> = {
  princesa: "Princesa",
  minimalista: "Minimalista",
  romantico: "Romântico",
  sereia: "Sereia",
};
