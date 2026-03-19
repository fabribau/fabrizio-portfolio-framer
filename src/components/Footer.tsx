"use client";

import { useT } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";

export default function Footer() {
  const t = useT();
  const f = translations.footer;

  return (
    <footer className="relative z-20 bg-[#050505] border-t border-white/[0.06] text-white/50 py-16 px-8 md:px-16">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Contact links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <span className="text-white/30 uppercase tracking-[0.2em] font-mono text-xs">{t(f.contact)}</span>
          <a
            href="https://linkedin.com/in/fabrizio-bauer"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300"
          >
            LinkedIn
          </a>
          <a
            href="mailto:fabriziojriera@gmail.com"
            className="hover:text-white transition-colors duration-300"
          >
            fabriziojriera@gmail.com
          </a>
          <a
            href="tel:+5492664024353"
            className="hover:text-white transition-colors duration-300"
          >
            +54 9 2664 02-4353
          </a>
        </div>

        {/* Built with */}
        <p className="text-xs text-white/25 font-light">
          {t(f.builtWith)}
        </p>

      </div>
    </footer>
  );
}
