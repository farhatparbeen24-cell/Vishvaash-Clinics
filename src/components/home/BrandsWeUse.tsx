"use client";

import { Eye, Stethoscope, Pill, Info, type LucideIcon } from "lucide-react";
import { brandGroups, type BrandGroupId } from "@/lib/brands";
import { useLanguage } from "@/components/language/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "Brands We Use" — credibility section.
 *
 * CONTENT SAFETY
 *  • Brand data comes from lib/brands.ts (clinic-confirmed "brands we use"
 *    listing). It NEVER states or implies partnership, authorisation,
 *    exclusivity or endorsement. The identification note below the panels
 *    states this explicitly in EN + HI.
 *  • Until official, clinic-approved logo files exist, every brand renders as
 *    a neutral TEXT wordmark in the site's own typography — an internal
 *    preview placeholder, not an imitation of any company's official logo.
 *  • No product/equipment photos, no badges ("Certified"/"Authorised"/
 *    "Partner"), no carousel or ticker, no external brand links, no animation
 *    beyond the site's standard reduced-motion-aware scroll reveal.
 *
 * DESIGN
 *  • Soft blue-grey surface (#F3F8FA) replaces the old white-on-white band:
 *    subtle navy top edge, one low-contrast decorative dot-grid corner
 *    (aria-hidden, pointer-events-none), soft-white category panels with
 *    1px navy-tinted borders and a very gentle shadow.
 *  • Each panel: small navy category icon (lucide — the site's icon library)
 *    with a tiny orange dot accent + uppercase category label, then a clean
 *    hairline-separated logo grid. Orange appears only as the tiny icon dot
 *    and the panel hover border.
 *  • Logo grid: fixed optical height per row, natural text width, generous
 *    whitespace, no individual logo cards, horizontal hairline separators
 *    between rows only. Desktop 3 category columns, tablet 2, mobile stacked
 *    — no horizontal scrolling at any width.
 *  • The identification note sits below the panels as a subdued line with a
 *    small info icon — deliberately NOT styled as a legal warning box.
 */

const groupIcons: Record<BrandGroupId, LucideIcon> = {
  lenses: Eye,
  equipment: Stethoscope,
  pharmaceuticals: Pill,
};

export function BrandsWeUse() {
  const { t, locale } = useLanguage();

  return (
    <section
      id="brands"
      aria-label={t.brands.ariaLabel}
      className="relative scroll-mt-24 overflow-hidden border-b border-line border-t-2 border-t-navy/15 bg-[#f3f8fa]"
    >
      {/* Decorative dot-grid — top-right corner only. Non-interactive,
          low-contrast, hidden from assistive technology. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-8 right-0 h-48 w-48 opacity-[0.55] sm:h-64 sm:w-64"
        style={{
          backgroundImage:
            "radial-gradient(rgba(11,43,64,0.16) 1px, transparent 1.4px)",
          backgroundSize: "18px 18px",
          maskImage:
            "radial-gradient(circle at 80% 20%, black 0%, transparent 68%)",
          WebkitMaskImage:
            "radial-gradient(circle at 80% 20%, black 0%, transparent 68%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <SectionHeading
          align="center"
          eyebrow={t.brands.eyebrow}
          title={t.brands.title}
          lede={t.brands.lede}
        />

        {/* Category panels — desktop 3 columns, tablet 2 (third panel wraps
            cleanly below), mobile stacked. Panels stretch to equal height. */}
        <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {brandGroups.map((group, gi) => {
            const Icon = groupIcons[group.id];
            return (
              <Reveal key={group.id} delay={gi * 90} className="h-full">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_8px_24px_rgba(11,43,64,0.05)] transition-colors duration-300 hover:border-sand/40">
                  {/* Category header: navy icon (tiny orange dot accent) + label */}
                  <div className="flex items-center gap-3 px-5 pb-4 pt-5 sm:px-6">
                    <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-aqua/70 text-navy">
                      <Icon className="h-[17px] w-[17px]" aria-hidden />
                      <span
                        aria-hidden
                        className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-sand"
                      />
                    </span>
                    <h3 className="text-[12px] font-bold uppercase tracking-[0.16em] text-navy">
                      {group.label[locale]}
                    </h3>
                  </div>

                  {/* Neutral text wordmarks — swapped for approved official
                      logo files only after written clinic confirmation.
                      Full-width hairline row separators (last row's own rule
                      is clipped by the panel edge); no individual logo cards. */}
                  <ul className="-mb-px grid grid-cols-2 border-t border-line/70 sm:grid-cols-3">
                    {group.brands.map((brand) => (
                      <li
                        key={brand.name}
                        className="flex h-14 items-center justify-center border-b border-line/60 px-2.5 sm:h-16 sm:px-3"
                      >
                        <span className="text-center text-[12.5px] font-bold leading-snug tracking-[0.04em] text-ink-soft sm:text-[13px]">
                          {brand.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Identification note — subdued, always visible in EN + HI. */}
        <Reveal delay={200}>
          <p className="mx-auto mt-8 flex max-w-xl items-start justify-center gap-2 text-center sm:mt-10">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-soft" aria-hidden />
            <span className="text-[12px] font-medium leading-relaxed text-ink-soft sm:text-[12.5px]">
              {t.brands.note}
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
