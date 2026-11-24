import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { DressGrid, fetchDresses, useAsync } from "@/features/catalog";
import { SITE } from "@/shared/config/site";
import { collapse } from "@/shared/motion/variants";
import { LinkButton } from "@/shared/ui/Button";
import { LazyImage } from "@/shared/ui/LazyImage";
import { Item, Reveal, Stagger } from "@/shared/ui/Reveal";
import { Skeleton } from "@/shared/ui/Skeleton";

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <Reveal className="section-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text && <p className="lead">{text}</p>}
    </Reveal>
  );
}

export function Featured() {
  const state = useAsync("dresses", () => fetchDresses());
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="Destaques"
          title="Peças que encantam"
          text="Bordados feitos à mão e modelagens para cada estilo de noiva e de convidada."
        />
        <DressGrid
          dresses={state.status === "ready" ? state.data.slice(0, 3) : null}
          skeletons={3}
        />
        <Reveal className="center">
          <LinkButton to="/vestidos" variant="ghost">
            Ver todos os vestidos
          </LinkButton>
        </Reveal>
      </div>
    </section>
  );
}

export function Collections() {
  const items = [
    {
      to: "/vestidos?categoria=noiva",
      img: "noiva-jardim",
      title: "Noivas",
      text: "Do clássico ao romântico, com véus e cauda.",
    },
    {
      to: "/vestidos?categoria=festa",
      img: "festa-preto",
      title: "Festa",
      text: "Madrinhas, formaturas e eventos à noite.",
    },
  ] as const;
  return (
    <section className="section section--tint">
      <div className="container">
        <SectionHead eyebrow="Coleções" title="Encontre o seu momento" />
        <Stagger className="collections">
          {items.map((c) => (
            <Item key={c.title}>
              <Link to={c.to} className="collection">
                <LazyImage
                  name={c.img}
                  alt={`Coleção ${c.title}`}
                  sizes="(min-width: 900px) 45vw, 90vw"
                />
                <div className="collection__label">
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              </Link>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function Differentials() {
  const stats = [
    { n: "10+", t: "anos vestindo sonhos" },
    { n: "11,4 mil", t: "seguidoras no Instagram" },
    { n: "2.655", t: "publicações de noivas e festas" },
  ];
  return (
    <section className="section">
      <div className="container split">
        <Reveal>
          <LazyImage
            name="corpete-renda"
            alt="Detalhe de bordado em renda com flores 3D e pérolas"
            sizes="(min-width: 900px) 40vw, 90vw"
            className="rounded"
          />
        </Reveal>
        <div>
          <SectionHead
            eyebrow="Nosso atelier"
            title="Bordados feitos à mão, um a um"
            text="Transformamos sonhos em vestidos únicos. Cada peça passa por cuidado artesanal para chegar perfeita ao seu grande dia."
          />
          <Stagger className="stats">
            {stats.map((s) => (
              <Item key={s.t} className="stat">
                <strong>{s.n}</strong>
                <span>{s.t}</span>
              </Item>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

export function Steps() {
  const steps = [
    { t: "Agende", d: "Escolha o melhor dia pelo site ou WhatsApp." },
    {
      t: "Prove e escolha",
      d: "Venha à nossa sobreloja no Centro de Niterói e experimente as peças.",
    },
    { t: "Combine a retirada", d: "Alinhamos a data do seu evento, a retirada e a devolução." },
  ];
  return (
    <section className="section section--tint">
      <div className="container">
        <SectionHead eyebrow="Como funciona" title="Do primeiro contato ao grande dia" />
        <Stagger className="steps" as="div">
          {steps.map((s, i) => (
            <Item key={s.t} className="step">
              <span className="step__n">{i + 1}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

const FAQ = [
  {
    q: "Vocês alugam ou vendem os vestidos?",
    a: "Trabalhamos com aluguel de roupas de festa e de noiva. Para valores e condições de cada peça, fale com a gente pelo WhatsApp.",
  },
  {
    q: "Preciso agendar para provar?",
    a: "Recomendamos agendar para receber você com calma e deixar as peças separadas. É rápido: pelo site ou pelo WhatsApp.",
  },
  {
    q: "Quais tipos de roupa vocês têm?",
    a: "Vestidos de noiva e de festa — madrinhas, formaturas e eventos à noite — com bordados feitos à mão.",
  },
  {
    q: "Onde fica a loja?",
    a: `${SITE.address.line1}, ${SITE.address.line2}. Subindo a sobreloja, você encontra a gente.`,
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section">
      <div className="container container--narrow">
        <SectionHead eyebrow="Dúvidas" title="Perguntas frequentes" />
        <Stagger className="faq">
          {FAQ.map((f, i) => {
            const isOpen = open === i;
            return (
              <Item key={f.q} className="faq__item">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {f.q}
                    <motion.span aria-hidden="true" animate={{ rotate: isOpen ? 45 : 0 }}>
                      +
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      className="faq__panel"
                      variants={collapse}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Item>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

export function Location() {
  const [loaded, setLoaded] = useState(false);
  return (
    <section className="section section--tint">
      <div className="container split">
        <div>
          <SectionHead
            eyebrow="Visite"
            title="Estamos no Centro de Niterói"
            text={`${SITE.address.line1}. ${SITE.address.line2}.`}
          />
          <Reveal className="hero__actions">
            <LinkButton to="/agendar">Agendar prova</LinkButton>
            <LinkButton
              variant="ghost"
              href={SITE.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver no Instagram
            </LinkButton>
          </Reveal>
        </div>
        <Reveal className="map">
          {!loaded && <Skeleton height="100%" radius={18} className="map__skeleton" />}
          <motion.iframe
            title="Mapa da Annaly Noivas"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.address.mapsQuery)}&output=embed`}
            initial={{ opacity: 0 }}
            animate={{ opacity: loaded ? 1 : 0 }}
            onLoad={() => setLoaded(true)}
          />
        </Reveal>
      </div>
    </section>
  );
}
