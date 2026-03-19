"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { type Locale } from "./translations";

interface LanguageContextType {
  locale: Locale;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "es",
  toggleLocale: () => {},
});

export function LanguageProvider({
  children,
  initialLocale = "es",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "es" ? "en" : "es";
      // Persist preference in cookie for proxy
      document.cookie = `locale=${next};path=/;max-age=31536000`;
      // Update html lang attribute dynamically
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

/** Helper: pick the right string from a localized object */
export function useT() {
  const { locale } = useLanguage();
  return useCallback(
    (obj: Record<string, string> | string) => {
      if (typeof obj === "string") return obj;
      return obj[locale] ?? obj["en"] ?? "";
    },
    [locale]
  );
}
