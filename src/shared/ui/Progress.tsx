import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { duration, ease } from "@/shared/motion/tokens";

/** Barra de progresso de leitura da página. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

/** Barra no topo que corre a cada navegação entre páginas. */
export function RouteProgress() {
  const { pathname } = useLocation();
  const [key, setKey] = useState(pathname);
  const [active, setActive] = useState(false);
  useEffect(() => {
    setKey(pathname);
    setActive(true);
    const t = setTimeout(() => setActive(false), 700);
    return () => clearTimeout(t);
  }, [pathname]);
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={key}
          className="route-progress"
          role="progressbar"
          aria-label="Carregando página"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, transition: { duration: 0.6, ease: ease.out } }}
          exit={{ opacity: 0, transition: { duration: duration.fast } }}
        />
      )}
    </AnimatePresence>
  );
}

/** Progresso determinado (ex.: etapas do formulário). */
export function ProgressBar({ value, label }: { value: number; label: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <motion.div
        className="progress__bar"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: duration.base, ease: ease.inOut }}
      />
    </div>
  );
}
