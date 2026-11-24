import { DRESSES } from "./data";
import type { Dress } from "./types";

const LATENCY_MS = 450;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Camada de acesso a dados assíncrona. Hoje lê do arquivo local;
 * trocar por fetch() de uma API não altera nenhum componente (skeletons já cobrem a espera).
 */
export async function fetchDresses(latency = LATENCY_MS): Promise<Dress[]> {
  await wait(latency);
  return DRESSES;
}

export async function fetchDress(slug: string, latency = LATENCY_MS): Promise<Dress | undefined> {
  await wait(latency);
  return DRESSES.find((d) => d.slug === slug);
}
