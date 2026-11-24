import { AnimatePresence, motion } from "motion/react";
import { fadeIn } from "@/shared/motion/variants";
import { DressCard, DressCardSkeleton } from "./DressCard";
import type { Dress } from "./types";

type Props = { dresses: Dress[] | null; skeletons?: number };

/** `dresses === null` significa carregando: exibe skeletons que saem com fade ao chegar o conteúdo. */
export function DressGrid({ dresses, skeletons = 6 }: Props) {
  if (dresses === null) {
    return (
      <ul className="grid" aria-busy="true" aria-label="Carregando vestidos">
        {Array.from({ length: skeletons }, (_, i) => (
          <DressCardSkeleton key={i} />
        ))}
      </ul>
    );
  }
  return (
    <>
      <ul className="grid">
        <AnimatePresence mode="popLayout">
          {dresses.map((d) => (
            <DressCard key={d.slug} dress={d} />
          ))}
        </AnimatePresence>
      </ul>
      <AnimatePresence>
        {dresses.length === 0 && (
          <motion.p
            className="empty"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            Nenhum vestido encontrado com esses filtros. Que tal limpar a busca?
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}
