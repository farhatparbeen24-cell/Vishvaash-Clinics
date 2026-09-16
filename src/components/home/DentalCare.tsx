"use client";

import {
  Smile,
  MessageCircleQuestion,
  Syringe,
  Anchor,
  Sparkles,
  Layers,
  AlignCenter,
  ShieldPlus,
} from "lucide-react";
import { clinic } from "@/lib/clinic";
import { DEFAULT_DOCTOR_ID } from "@/lib/doctors";
import { waLink } from "@/lib/whatsapp";
import { useLanguage } from "@/components/language/LanguageProvider";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCta } from "./ServiceCta";

const dentalIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Syringe,
  Anchor,
  Sparkles,
  Layers,
  AlignCenter,
  ShieldPlus,
};

/**
 * Dental Care — restrained banner + six dental service cards (Phase 2).
 *
 * • The banner keeps the verified, claim-free section copy (unchanged).
 * • The card grid mirrors the Eye Care card style exactly (same tile, icon
 *   treatment, typography and "Request Consultation" CTA) with the six
 *   owner-supplied dental services rendered verbatim.
 * • Card CTAs open the same appointment popup with the clinic's default
 *   doctor (Dr. Himanshu Arora) pre-selected, per owner instruction — the
 *   in-popup switcher lets the visitor choose Dr. Shruti Beri Arora in one
 *   tap; booking fields and WhatsApp message structure are untouched.
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
                <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-sand">
                  {/* Section number — editorial index (02) matching SectionHeading */}
                  <span aria-hidden className="font-display text-sm tracking-normal">
                    02
                  </span>
                  <span aria-hidden className="h-px w-8 bg-sand/40" />
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

        {/* Six dental service cards — same tile style as the Eye Care grid */}
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clinic.dentalServices.map((service, i) => {
            const Icon = dentalIconMap[service.icon] ?? Smile;
            const copy = t.dental.items[i] ?? {
              title: service.title,
              blurb: service.blurb,
            };
            return (
              <Reveal as="li" key={service.slug} delay={i * 90}>
                <article className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sand/40 hover:shadow-[0_24px_48px_-28px_rgba(11,43,64,0.35)]">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-aqua text-sand-deep transition-colors duration-300 group-hover:bg-navy group-hover:text-sand">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display mt-5 text-xl leading-snug text-navy">
                    {copy.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {copy.blurb}
                  </p>
                  <div className="mt-5">
                    <ServiceCta
                      canonical={service.title}
                      label={t.cta.requestConsultation}
                      doctorId={DEFAULT_DOCTOR_ID}
                    />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
