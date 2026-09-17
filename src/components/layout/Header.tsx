"use client";

import { useEffect, useState } from "react";
import { Menu, X, CalendarCheck } from "lucide-react";
import { clinic, navLinks, type NavLinkKey } from "@/lib/clinic";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useAppointment } from "@/components/appointment/AppointmentProvider";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

/**
 * Premium sticky header: wordmark, anchored navigation, EN | हिंदी switcher,
 * Book Appointment CTA and an accessible mobile menu.
 */
export function Header() {
  const { t } = useLanguage();
  const { openAppointmentModal } = useAppointment();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Lock body scroll when the mobile menu is open + close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const navLabel = (key: NavLinkKey) => t.nav[key];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled || menuOpen
          ? "border-white/15 bg-royal shadow-[0_8px_30px_-18px_rgba(8,15,60,0.55)]"
          : "border-transparent bg-royal"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="#top"
          className="flex shrink-0 items-center rounded-lg"
          aria-label={`${clinic.name} — back to top`}
        >
          <Logo tone="light" variant="header" />
        </a>

        {/* Desktop nav */}
        <nav aria-label={t.nav.ariaPrimary} className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-[14px] font-semibold text-offwhite/90 transition hover:bg-white/15 hover:text-white"
            >
              {navLabel(link.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Language switcher — desktop */}
          <div className="hidden lg:inline-flex">
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            onClick={() => openAppointmentModal()}
            className="hidden min-h-[44px] items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-royal shadow-[0_10px_24px_-12px_rgba(8,15,60,0.65)] transition hover:bg-offwhite focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-royal sm:inline-flex"
          >
            <CalendarCheck className="h-4 w-4 text-sand" aria-hidden />
            {t.cta.bookAppointment}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t.nav.menuClose : t.nav.menuOpen}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden border-line bg-offwhite/98 backdrop-blur-md transition-[max-height,opacity] duration-300 lg:hidden",
          menuOpen ? "max-h-[520px] border-t opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav aria-label={t.nav.ariaMobile} className="px-4 py-4 sm:px-6">
          <ul className="grid gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-[48px] items-center rounded-xl px-4 text-[15px] font-semibold text-ink transition hover:bg-aqua/60 hover:text-navy"
                >
                  {navLabel(link.key)}
                </a>
              </li>
            ))}
          </ul>

          {/* Language switcher — inside the mobile menu */}
          <div className="mt-3 flex justify-center">
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              openAppointmentModal();
            }}
            className="mt-3 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-navy px-6 text-[15px] font-semibold text-offwhite transition hover:bg-navy-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-sand"
          >
            <CalendarCheck className="h-4 w-4 text-sand" aria-hidden />
            {t.cta.bookAppointment}
          </button>
        </nav>
      </div>
    </header>
  );
}
