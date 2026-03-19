"use client";

import { motion } from "framer-motion";
import { useT } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

export default function Experience() {
  const t = useT();
  const e = translations.experience;

  return (
    <section className="relative z-20 bg-[#050505] text-white py-32 px-8 md:px-16">
      <div className="container mx-auto">

        {/* ── Professional Experience ── */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold mb-16 tracking-tight drop-shadow-lg"
        >
          {t(e.heading)}
        </motion.h2>

        <div className="space-y-8 mb-24">
          {e.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
              className="relative pl-8 border-l-2 border-white/[0.1]"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-white/30 ring-4 ring-[#050505]" />

              <span className="text-xs uppercase tracking-[0.25em] text-white/40 font-mono block mb-1">
                {t(item.period)}
              </span>
              <h3 className="text-2xl font-semibold mb-1">{t(item.role)}</h3>
              <p className="text-white/50 text-sm font-medium mb-3">
                {typeof item.org === "string" ? item.org : t(item.org)}
              </p>
              <p className="text-white/60 text-base leading-relaxed font-light">
                {t(item.desc)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Education ── */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold mb-16 tracking-tight drop-shadow-lg"
        >
          {t(e.educationHeading)}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative pl-8 border-l-2 border-white/[0.1]"
        >
          <div className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-white/30 ring-4 ring-[#050505]" />

          <span className="text-xs uppercase tracking-[0.25em] text-white/40 font-mono block mb-1">
            {e.education.period}
          </span>
          <h3 className="text-2xl font-semibold mb-1">{t(e.education.degree)}</h3>
          <p className="text-white/50 text-sm font-medium mb-3">
            {e.education.org}
          </p>
          <p className="text-white/60 text-base leading-relaxed font-light mb-1">
            {t(e.education.gpa)}
          </p>
          <p className="text-white/60 text-base leading-relaxed font-light italic">
            {t(e.education.thesis)}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
