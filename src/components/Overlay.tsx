"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { useT } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

interface OverlayProps {
  scrollYProgress: MotionValue<number>;
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
  const t = useT();
  const o = translations.overlay;

  // 0% → 33%: Name + Title (center)
  const opacity1 = useTransform(scrollYProgress, [0, 0.33, 0.34, 1], [1, 1, 0, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.34], [0, -30]);
  const scale1 = useTransform(scrollYProgress, [0, 0.34], [1, 0.97]);

  // 34% → 66%: Mission (left)
  const opacity2 = useTransform(
    scrollYProgress,
    [0, 0.33, 0.34, 0.66, 0.67, 1],
    [0, 0, 1, 1, 0, 0]
  );
  const y2 = useTransform(scrollYProgress, [0.34, 0.67], [20, -20]);

  // 67% → 100%: Approach (right)
  const opacity3 = useTransform(scrollYProgress, [0, 0.66, 0.67, 1], [0, 0, 1, 1]);
  const y3 = useTransform(scrollYProgress, [0.67, 1], [20, 0]);

  return (
    <div className="relative w-full h-full px-8 md:px-16 container mx-auto">

      {/* SECTION 1: 0% — Name */}
      <motion.div
        style={{ opacity: opacity1, y: y1, scale: scale1 }}
        className="absolute inset-x-0 top-[40%] flex flex-col items-center justify-center text-center will-change-transform"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight drop-shadow-2xl">
          {t(o.name)}
        </h1>
        <p className="mt-4 text-xl md:text-3xl font-medium text-white/80 tracking-wide drop-shadow-xl">
          {t(o.title)}
        </p>
      </motion.div>

      {/* SECTION 2: 20% — Mission */}
      <motion.div
        style={{ opacity: opacity2, y: y2 }}
        className="absolute left-8 md:left-24 top-[45%] flex flex-col items-start justify-center max-w-xl will-change-transform text-left"
      >
        <span className="block text-sm md:text-lg uppercase tracking-[0.3em] font-semibold text-white/50 mb-4">
          {t(o.missionLabel)}
        </span>
        <h2 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-2xl whitespace-pre-line">
          {t(o.mission)}
        </h2>
      </motion.div>

      {/* SECTION 3: 40% — Approach */}
      <motion.div
        style={{ opacity: opacity3, y: y3 }}
        className="absolute right-8 md:right-24 top-[45%] flex flex-col items-end justify-center max-w-xl will-change-transform text-right"
      >
        <span className="block text-sm md:text-lg uppercase tracking-[0.3em] font-semibold text-white/50 mb-4">
          {t(o.approachLabel)}
        </span>
        <h2 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-2xl whitespace-pre-line">
          {t(o.approach)}
        </h2>
      </motion.div>

    </div>
  );
}
