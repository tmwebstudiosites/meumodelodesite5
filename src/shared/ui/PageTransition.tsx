import { motion } from "motion/react";
import { type ReactNode, useEffect } from "react";
import { pageTransition } from "@/shared/motion/variants";

/** Envolve cada página: entrada/saída animadas + volta ao topo. */
export function PageTransition({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
  return (
    <motion.main
      id="conteudo"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.main>
  );
}
