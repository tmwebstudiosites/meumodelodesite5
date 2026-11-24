import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { fadeIn } from "@/shared/motion/variants";

type Props = {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  radius?: number | string;
  className?: string;
};

/** Placeholder com shimmer. Entra e sai com fade para não "piscar" na troca pelo conteúdo. */
export function Skeleton({ width = "100%", height = 16, radius = 8, className = "" }: Props) {
  return (
    <motion.span
      aria-hidden="true"
      data-testid="skeleton"
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="stack-sm" role="status" aria-label="Carregando">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} height={14} width={i === lines - 1 ? "62%" : "100%"} />
      ))}
    </div>
  );
}
