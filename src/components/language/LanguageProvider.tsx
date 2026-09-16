"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  translations,
  type Dictionary,
  type Locale,
} from "@/lib/translations";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const STORAGE_KEY = "vishvaas-lang";

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
});

/**
 * Lightweight client-side language switching.
 * English is the default (server-rendered); a saved preference from
 * localStorage is applied after mount. No duplicate routes, no page reload.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Restore saved preference once on mount (deferred to keep the initial
  // paint stable and satisfy the set-state-in-effect lint rule)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === "hi" || saved === "en") setLocaleState(saved);
      } catch {
        /* storage unavailable — keep English */
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Keep <html lang> and the Devanagari font class in sync
  useEffect(() => {
    document.documentElement.lang = locale === "hi" ? "hi-IN" : "en-IN";
    document.body.classList.toggle("lang-hi", locale === "hi");
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — session-only switch */
    }
  }, []);

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, t: translations[locale] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
