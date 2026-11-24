import { motion } from "motion/react";
import { SITE } from "@/shared/config/site";
import { spring } from "@/shared/motion/tokens";

export function ContactFab() {
  return (
    <motion.a
      className="fab"
      href={SITE.contactLink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ...spring, delay: 1.2 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      <span className="sr-only">Falar com a Annaly Noivas</span>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9.5L5 22v-4H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      </svg>
    </motion.a>
  );
}
