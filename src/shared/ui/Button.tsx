import { motion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router-dom";
import { spring } from "@/shared/motion/tokens";

type Variant = "primary" | "ghost" | "light";
type Common = { variant?: Variant; children: ReactNode; className?: string };

const MotionLink = motion.create(Link);
const press = { whileHover: { y: -2 }, whileTap: { scale: 0.97 }, transition: spring };

export function Button({
  variant = "primary",
  loading = false,
  children,
  className = "",
  disabled,
  ...rest
}: Common & { loading?: boolean } & Omit<
    ComponentProps<"button">,
    "children" | "onDrag" | "onAnimationStart" | "onDragStart" | "onDragEnd"
  >) {
  return (
    <motion.button
      className={`btn btn--${variant} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...press}
      {...rest}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      {children}
    </motion.button>
  );
}

export function LinkButton({
  variant = "primary",
  children,
  className = "",
  to,
  href,
  ...rest
}: Common & { to?: string; href?: string; target?: string; rel?: string; onClick?: () => void }) {
  const cls = `btn btn--${variant} ${className}`;
  if (to)
    return (
      <MotionLink to={to} className={cls} {...press} {...rest}>
        {children}
      </MotionLink>
    );
  return (
    <motion.a href={href} className={cls} {...press} {...rest}>
      {children}
    </motion.a>
  );
}
