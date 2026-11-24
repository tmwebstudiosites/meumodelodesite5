import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { spring } from "@/shared/motion/tokens";
import { drawer } from "@/shared/motion/variants";
import { LinkButton } from "@/shared/ui/Button";
import { Wordmark } from "@/shared/ui/Wordmark";

const LINKS = [
  { to: "/", label: "Início", end: true },
  { to: "/vestidos", label: "Vestidos" },
  { to: "/agendar", label: "Agendar prova" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <motion.header
      className={`header ${scrolled ? "is-scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...spring, delay: 0.1 }}
    >
      <div className="container header__inner">
        <Link to="/" aria-label="Annaly Noivas — início">
          <Wordmark />
        </Link>
        <nav className="nav" aria-label="Principal">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="nav__link">
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="nav__underline"
                      transition={spring}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <LinkButton to="/agendar" className="header__cta">
          Agendar
        </LinkButton>
        <button
          type="button"
          className="burger"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          <motion.span animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} />
          <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} />
          <motion.span animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-mobile"
            className="mobile-menu"
            aria-label="Mobile"
            variants={drawer}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to}>
                {l.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
