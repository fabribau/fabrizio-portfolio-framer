"use client";

import { motion } from "framer-motion";
import { useT } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

export default function Projects() {
  const t = useT();
  const p = translations.projects;

  return (
    <section id="projects" className="relative z-20 min-h-screen bg-[#050505] text-white py-32 px-8 md:px-16">
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold mb-16 tracking-tight drop-shadow-lg"
        >
          {t(p.heading)}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {p.items.map((proj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              className="group relative rounded-3xl p-8 lg:p-12 overflow-hidden backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-700 ease-out"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full bg-transparent">
                <span className="text-xs uppercase tracking-[0.25em] text-white/40 font-mono mb-6 block drop-shadow-sm">
                  {proj.tech}
                </span>
                <h3 className="text-3xl font-semibold mb-6 group-hover:text-white transition-colors duration-500">
                  {t(proj.title)}
                </h3>
                <p className="text-white/60 text-lg leading-relaxed font-light mt-auto">
                  {t(proj.desc)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
