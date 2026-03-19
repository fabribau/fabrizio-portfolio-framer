"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import { motion } from "framer-motion";

export default function LanguageToggle() {
  const { locale, toggleLocale } = useLanguage();
  const label = translations.ui.langToggle[locale];

  return (
    <motion.button
      onClick={toggleLocale}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/[0.06] border border-white/[0.12] text-sm font-medium text-white/80 hover:bg-white/[0.12] hover:border-white/[0.2] hover:text-white transition-all duration-300 cursor-pointer shadow-lg"
      aria-label="Toggle language"
    >
      <span className="text-base leading-none">🌐</span>
      <span className="tracking-wider font-mono">{label}</span>
    </motion.button>
  );
}
