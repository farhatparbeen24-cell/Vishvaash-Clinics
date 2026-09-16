"use client";

import { Facebook, Instagram, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { clinic, navLinks, type NavLinkKey } from "@/lib/clinic";
import { waLink } from "@/lib/whatsapp";
import { useLanguage } from "@/components/language/LanguageProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Logo } from "./Logo";
import { LegalDialog } from "@/components/legal/LegalDialog";

/** Site footer with navigation, verified address, WhatsApp CTA and disclaimer. */
export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  /**
   * Official clinic social profiles — URLs are supplied by the clinic owner
   * (lib/clinic.ts). Lucide brand icons from the project's existing icon
   * library only; localized accessible names; new tab + noopener.
   */
  const socials = [
    {
      key: "instagram" as const,
      href: clinic.social.instagram,
      icon: Instagram,
      label: t.footer.socialInstagram,
      visible: "Instagram",
    },
    {
      key: "facebook" as const,
      href: clinic.social.facebook,
      icon: Facebook,
      label: t.footer.socialFacebook,
      visible: "Facebook",
    },
  ].filter((s) => s.href);

  return (
    <footer className="mt-auto bg-navy text-aqua/85 band-grid">
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Logo tone="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-aqua/70">
              {t.footer.tagline}
            </p>
            {/* Official social profiles (renders only configured URLs) */}
            {socials.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.key}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-aqua/30 px-4 text-sm font-semibold text-aqua transition hover:border-white hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                    >
                      <Icon className="h-4.5 w-4.5" aria-hidden />
                      {s.visible}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Explore */}
          <nav aria-label={t.footer.explore}>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-sand">
              {t.footer.explore}
            </h2>
            <ul className="mt-4 grid gap-1">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="inline-flex min-h-[36px] items-center text-sm text-aqua/80 transition hover:text-white"
                  >
                    {t.nav[l.key as NavLinkKey]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Visit / contact */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-sand">
              {t.footer.visitUs}
            </h2>
            <address className="mt-4 flex items-start gap-2.5 not-italic text-sm leading-relaxed text-aqua/80">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sand" aria-hidden />
              <span>
                {clinic.name} – {t.brand.descriptor}
                <br />
                {clinic.address.line1}, {clinic.address.line2},
                <br />
                {clinic.address.city}, {clinic.address.state}{" "}
                {clinic.address.postalCode}, {clinic.address.country}
              </span>
            </address>
            <div className="mt-4 flex flex-col gap-2.5">
              <a
                href={clinic.phoneHref}
                className="inline-flex min-h-[44px] w-fit items-center gap-2 text-sm font-semibold text-aqua transition hover:text-white"
              >
                <Phone className="h-4 w-4" aria-hidden />
                {clinic.phoneDisplay}
              </a>
              <a
                href={waLink(t.wa.quick.general)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] w-fit items-center gap-2 rounded-full bg-wa px-5 text-sm font-semibold text-white transition hover:bg-[#0c6a40]"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t.cta.whatsappUs}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href={clinic.maps.directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] w-fit items-center gap-2 text-sm font-semibold text-aqua underline-offset-4 transition hover:text-white hover:underline"
              >
                <MapPin className="h-4 w-4" aria-hidden />
                {t.footer.directionsLink}
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer + legal */}
        <div className="mt-12 border-t border-aqua/15 pt-6">
          <p className="max-w-3xl text-xs leading-relaxed text-aqua/55">
            {t.footer.disclaimer}
          </p>
          <div className="mt-5 flex flex-col gap-3 text-xs text-aqua/60 sm:flex-row sm:items-center sm:justify-between">
            <p suppressHydrationWarning>
              © {year} {clinic.name} – {t.brand.descriptor}. {t.footer.rights}
            </p>
            <p className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <LegalDialog kind="privacy" />
              <LegalDialog kind="terms" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
