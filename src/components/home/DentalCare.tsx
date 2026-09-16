"use client";

import { Smile, MessageCircleQuestion } from "lucide-react";
import { waLink } from "@/lib/whatsapp";
import { useLanguage } from "@/components/language/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Dental Care — deliberately restrained.
 * Only the verified fact (dental care is offered at Vishvaas Clinic) is
 * stated; treatment lists, claims and timings are NOT invented.
 */
export function DentalCare() {
  const { t } = useLanguage();
  return (
    <section id="dental-care" aria-label={t.dental.ariaLabel} className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:py-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[26px] border border-line bg-navy band-grid">
            {/* Warm corner glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-sand/15 blur-3xl"
            />
            <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-10">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-aqua/10 text-aqua ring-1 ring-aqua/25">
                <Smile className="h-8 w-8" aria-hidden />
              </span>
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sand">
                  {t.dental.eyebrow}
                </p>
                <h2 className="font-display mt-3 text-2xl leading-snug text-offwhite sm:text-3xl">
                  {t.dental.titleA}{" "}
                  <span className="accent-italic text-aqua">{t.dental.titleAccent}</span>
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-aqua/75">
                  {t.dental.body}
                </p>
              </div>
              <a
                href={waLink(t.wa.quick.dental)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-full bg-aqua px-6 text-center text-[15px] font-bold text-navy transition hover:bg-white"
              >
                <MessageCircleQuestion className="h-5 w-5 shrink-0" aria-hidden />
                {t.cta.askDental}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
