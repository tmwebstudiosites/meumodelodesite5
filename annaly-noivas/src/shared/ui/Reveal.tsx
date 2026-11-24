import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { container, fadeUp } from "@/shared/motion/variants";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  as?: "div" | "section" | "li";
};

/** Revela o conteúdo quando entra na viewport (uma única vez). */
export function Reveal({ children, className, delay = 0, variants = fadeUp, as = "div" }: Props) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}

/** Grupo cujos filhos (use <Item/>) entram em cascata. */
export function Stagger({ children, className, delay = 0, as = "div" }: Omit<Props, "variants">) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={container(delay)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </Tag>
  );
}

export function Item({ children, className, as = "div" }: Omit<Props, "variants" | "delay">) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={fadeUp}>
      {children}
    </Tag>
  );
}
