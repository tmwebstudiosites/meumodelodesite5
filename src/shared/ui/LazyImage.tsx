import { motion } from "motion/react";
import { useState } from "react";
import { IMAGES, type ImageKey } from "@/shared/lib/images.generated";
import { duration, ease } from "@/shared/motion/tokens";

type Props = {
  name: ImageKey;
  alt: string;
  /** Imagens acima da dobra (LCP) carregam imediatamente. */
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * Lazy loading nativo + placeholder borrado (LQIP) + shimmer.
 * Ao carregar, a imagem faz fade/scale-in suave sobre o placeholder.
 */
export function LazyImage({
  name,
  alt,
  priority = false,
  sizes = "(min-width: 900px) 33vw, 90vw",
  className = "",
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const meta = IMAGES[name];
  return (
    <div
      className={`lazy-image ${loaded ? "is-loaded" : ""} ${className}`}
      style={{ aspectRatio: `${meta.w} / ${meta.h}`, backgroundImage: `url(${meta.lqip})` }}
      data-testid="lazy-image"
    >
      {!loaded && (
        <span className="skeleton skeleton--cover" aria-hidden="true" data-testid="skeleton" />
      )}
      <motion.img
        src={`/images/${name}.webp`}
        width={meta.w}
        height={meta.h}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={loaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
        transition={{ duration: duration.slow, ease: ease.out }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
