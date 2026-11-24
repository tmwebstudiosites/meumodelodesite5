import type { Dress } from "./types";

/**
 * Catálogo de demonstração: nomes e textos são ilustrativos.
 * Substitua pelas peças reais (ou por uma API) mantendo o mesmo formato.
 */
export const DRESSES: Dress[] = [
  {
    slug: "aurora",
    name: "Aurora",
    category: "noiva",
    style: "princesa",
    image: "noiva-renda",
    headline: "Manga longa em renda e saia ampla de tule.",
    details: [
      "Renda bordada à mão",
      "Manga longa translúcida",
      "Saia volumosa de tule",
      "Acompanha véu e tiara (sob consulta)",
    ],
  },
  {
    slug: "helena",
    name: "Helena",
    category: "noiva",
    style: "princesa",
    image: "noiva-jardim",
    headline: "Cetim encorpado, saia ampla e cauda para o grande dia.",
    details: [
      "Tomara que caia",
      "Saia ampla com cauda",
      "Cetim estruturado",
      "Combina com véu longo",
    ],
  },
  {
    slug: "isadora",
    name: "Isadora",
    category: "noiva",
    style: "minimalista",
    image: "noiva-buque",
    headline: "Cetim liso, fenda lateral e leveza em cada movimento.",
    details: [
      "Tomara que caia",
      "Fenda lateral",
      "Cetim acetinado",
      "Véu com pérolas (sob consulta)",
    ],
  },
  {
    slug: "valentina",
    name: "Valentina",
    category: "noiva",
    style: "romantico",
    image: "noiva-noturna",
    headline: "Decote em V com renda bordada e saia fluida.",
    details: [
      "Decote em V",
      "Bordados aplicados à mão",
      "Saia evasê",
      "Ótimo para cerimônias ao ar livre",
    ],
  },
  {
    slug: "serena",
    name: "Serena",
    category: "noiva",
    style: "romantico",
    image: "corpete-renda",
    headline: "Corpete com flores em 3D, pérolas e alças de renda.",
    details: [
      "Flores 3D e pérolas",
      "Alças bordadas",
      "Tule com brilho sutil",
      "Corpete estruturado",
    ],
  },
  {
    slug: "ambar",
    name: "Âmbar",
    category: "festa",
    style: "sereia",
    image: "festa-terracota",
    headline: "Cetim terracota com corpete estruturado e amarração.",
    details: [
      "Tomara que caia",
      "Amarração nas costas",
      "Cetim fluido",
      "Ideal para madrinhas e formaturas",
    ],
  },
  {
    slug: "noir",
    name: "Noir",
    category: "festa",
    style: "sereia",
    image: "festa-preto",
    headline: "Paetês pretos em arabescos e costas à mostra.",
    details: [
      "Paetês em arabescos",
      "Decote nas costas",
      "Modelagem sereia",
      "Perfeito para eventos à noite",
    ],
  },
];
