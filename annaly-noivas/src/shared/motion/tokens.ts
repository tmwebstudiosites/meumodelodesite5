/**
 * Motion Principles — tokens únicos de movimento para todo o site.
 *  1. Propósito: todo movimento orienta, confirma ou dá continuidade.
 *  2. Rápido para responder (≤200ms), calmo para narrar (400–700ms).
 *  3. Entrar desacelerando (ease-out), sair acelerando (ease-in) e mais rápido que a entrada.
 *  4. Hierarquia por stagger curto (50–80ms), nunca por atraso longo.
 *  5. Só animamos transform e opacity (barato para a GPU).
 *  6. `prefers-reduced-motion` é respeitado via <MotionConfig reducedMotion="user">.
 */
export const duration = { instant: 0.12, fast: 0.2, base: 0.35, slow: 0.6, page: 0.45 } as const;

export const ease = {
  out: [0.22, 1, 0.36, 1],
  in: [0.64, 0, 0.78, 0],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const spring = { type: "spring", stiffness: 380, damping: 30, mass: 0.8 } as const;

export const stagger = { tight: 0.05, base: 0.08 } as const;
