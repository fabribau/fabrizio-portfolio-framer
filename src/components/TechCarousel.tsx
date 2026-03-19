"use client";

import { motion } from "framer-motion";
import { useT } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

const techs = [
  "Java", "JavaScript", "TypeScript", "Python", "Go", "C", "SQL",
  "Next.js", "React", "Node.js", "Spring Boot", "FastAPI", "Gin",
  "PostgreSQL", "MySQL", "Supabase", "Neon",
  "Git", "Vercel", "Postman",
  "LLM / RAG", "Vercel AI SDK", "Google AI",
];

export default function TechCarousel() {
  const t = useT();
  const heading = translations.techCarousel.heading;

  // Duplicate for seamless infinite loop
  const doubled = [...techs, ...techs];

  return (
    <section className="relative z-20 bg-[#050505] text-white py-24 overflow-hidden">
      <div className="container mx-auto px-8 md:px-16 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg"
        >
          {t(heading)}
        </motion.h2>
      </div>

      {/* Infinite scroll strip */}
      <div className="group relative">
        {/* Gradient fades on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-6 w-max group-hover:[animation-play-state:paused]"
          style={{ animation: "scroll-left 40s linear infinite" }}
        >
          {doubled.map((tech, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-6 py-3 rounded-full backdrop-blur-xl bg-white/[0.04] border border-white/[0.1] text-white/70 text-sm font-mono tracking-wide hover:bg-white/[0.08] hover:text-white hover:border-white/[0.2] transition-all duration-300"
            >
              {tech}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
