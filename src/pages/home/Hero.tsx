import { motion } from "motion/react";
import { SITE } from "@/shared/config/site";
import { container, fadeUp, scaleIn } from "@/shared/motion/variants";
import { LinkButton } from "@/shared/ui/Button";
import { LazyImage } from "@/shared/ui/LazyImage";

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero__grid">
        <motion.div
          className="hero__text"
          variants={container(0.1)}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="script" variants={fadeUp}>
            {SITE.tagline}
          </motion.p>
          <motion.h1 variants={fadeUp}>Vestidos de noiva e festa para o seu grande dia</motion.h1>
          <motion.p className="lead" variants={fadeUp}>
            {SITE.description}
          </motion.p>
          <motion.div className="hero__actions" variants={fadeUp}>
            <LinkButton to="/agendar">Agendar minha prova</LinkButton>
            <LinkButton to="/vestidos" variant="ghost">
              Ver vestidos
            </LinkButton>
          </motion.div>
          <motion.p className="muted" variants={fadeUp}>
            Sobreloja · Rua da Conceição, 181 · Centro de Niterói
          </motion.p>
        </motion.div>
        <motion.div
          className="hero__art"
          variants={container(0.25, 0.12)}
          initial="hidden"
          animate="visible"
          aria-hidden={false}
        >
          <motion.div className="hero__img hero__img--main" variants={scaleIn}>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <LazyImage
                name="noiva-renda"
                alt="Noiva sorrindo com vestido de renda e manga longa"
                priority
                sizes="(min-width: 900px) 30vw, 70vw"
              />
            </motion.div>
          </motion.div>
          <motion.div className="hero__img hero__img--side" variants={scaleIn}>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <LazyImage
                name="festa-terracota"
                alt="Vestido de festa em cetim terracota"
                priority
                sizes="(min-width: 900px) 18vw, 40vw"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
