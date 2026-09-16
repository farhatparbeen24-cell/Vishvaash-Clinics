"use client";

import { useLanguage } from "./LanguageProvider";
import { cn } from "@/lib/utils";

/**
 * Compact EN | हिंदी segmented switcher.
 * Used in the desktop header and inside the mobile menu.
 * Active option: navy pill (readable); hover: soft orange border accent.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  const base =
    "inline-flex min-h-[36px] items-center rounded-full px-3 text-[12px] font-bold tracking-wide transition";
  const idle = "text-ink-soft hover:text-navy hover:bg-aqua/50";
  const active = "bg-navy text-offwhite shadow-[0_6px_14px_-8px_rgba(11,43,64,0.6)]";

  return (
    <div
      role="group"
      aria-label={`${t.switcher.label}: English | हिंदी`}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-line bg-white p-1",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={cn(base, locale === "en" ? active : idle)}
      >
        {t.switcher.en}
      </button>
      <span aria-hidden className="h-4 w-px bg-line" />
      <button
        type="button"
        onClick={() => setLocale("hi")}
        aria-pressed={locale === "hi"}
        className={cn(base, locale === "hi" ? active : idle)}
      >
        {t.switcher.hi}
      </button>
    </div>
  );
}
