import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { scaleIn } from "@/shared/motion/variants";
import { LazyImage } from "@/shared/ui/LazyImage";
import { CATEGORY_LABEL, type Dress, STYLE_LABEL } from "./types";

export function DressCard({ dress }: { dress: Dress }) {
  return (
    <motion.li
      layout
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="card"
    >
      <Link to={`/vestidos/${dress.slug}`} className="card__link" aria-label={`Ver ${dress.name}`}>
        <div className="card__media">
          <LazyImage name={dress.image} alt={`Vestido ${dress.name}`} />
        </div>
        <div className="card__body">
          <span className="eyebrow">
            {CATEGORY_LABEL[dress.category]} · {STYLE_LABEL[dress.style]}
          </span>
          <h3>{dress.name}</h3>
          <p>{dress.headline}</p>
          <span className="card__cta">Ver detalhes →</span>
        </div>
      </Link>
    </motion.li>
  );
}

export function DressCardSkeleton() {
  return (
    <li className="card card--skeleton" aria-hidden="true" data-testid="dress-skeleton">
      <span
        className="skeleton"
        style={{ aspectRatio: "4 / 5", width: "100%", borderRadius: 18 }}
      />
      <span className="skeleton" style={{ height: 12, width: "40%", marginTop: 16 }} />
      <span className="skeleton" style={{ height: 22, width: "60%", marginTop: 10 }} />
      <span className="skeleton" style={{ height: 14, width: "90%", marginTop: 10 }} />
    </li>
  );
}
