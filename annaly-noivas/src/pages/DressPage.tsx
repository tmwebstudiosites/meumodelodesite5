import { motion } from "motion/react";
import { Link, useParams } from "react-router-dom";
import { CATEGORY_LABEL, fetchDress, STYLE_LABEL, useAsync } from "@/features/catalog";
import { container, fadeUp } from "@/shared/motion/variants";
import { LinkButton } from "@/shared/ui/Button";
import { LazyImage } from "@/shared/ui/LazyImage";
import { Skeleton, SkeletonText } from "@/shared/ui/Skeleton";
import NotFoundPage from "./NotFoundPage";

export default function DressPage() {
  const { slug = "" } = useParams();
  const state = useAsync(slug, (s) => fetchDress(s));

  if (state.status === "ready" && !state.data) return <NotFoundPage />;
  const dress = state.status === "ready" ? state.data : undefined;

  return (
    <section className="section">
      <div className="container">
        <Link to="/vestidos" className="back">
          ← Voltar ao catálogo
        </Link>
        <div className="detail">
          {dress ? (
            <LazyImage
              name={dress.image}
              alt={`Vestido ${dress.name}`}
              priority
              sizes="(min-width: 900px) 45vw, 90vw"
              className="rounded"
            />
          ) : (
            <Skeleton height={520} radius={18} />
          )}
          {dress ? (
            <motion.div
              className="detail__info"
              variants={container(0.1)}
              initial="hidden"
              animate="visible"
            >
              <motion.p className="eyebrow" variants={fadeUp}>
                {CATEGORY_LABEL[dress.category]} · {STYLE_LABEL[dress.style]}
              </motion.p>
              <motion.h1 variants={fadeUp}>{dress.name}</motion.h1>
              <motion.p className="lead" variants={fadeUp}>
                {dress.headline}
              </motion.p>
              <motion.ul className="checks" variants={fadeUp}>
                {dress.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </motion.ul>
              <motion.p className="muted" variants={fadeUp}>
                Valor e disponibilidade sob consulta, conforme a data do seu evento.
              </motion.p>
              <motion.div variants={fadeUp} className="hero__actions">
                <LinkButton to={`/agendar?vestido=${dress.name}`}>
                  Quero provar o {dress.name}
                </LinkButton>
              </motion.div>
            </motion.div>
          ) : (
            <div className="detail__info" role="status" aria-label="Carregando vestido">
              <Skeleton height={12} width={140} />
              <Skeleton height={44} width="55%" radius={12} />
              <SkeletonText lines={3} />
              <Skeleton height={48} width={220} radius={999} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
