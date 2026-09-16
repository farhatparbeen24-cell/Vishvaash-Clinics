"use client";

import {
  Smile,
  Syringe,
  Anchor,
  Sparkles,
  Layers,
  AlignCenter,
  ShieldPlus,
  PhoneCall,
} from "lucide-react";
import { clinic } from "@/lib/clinic";
import { DEFAULT_DOCTOR_ID } from "@/lib/doctors";
import { waLink } from "@/lib/whatsapp";
import { useLanguage } from "@/components/language/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCta } from "./ServiceCta";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const dentalIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Syringe,
  Anchor,
  Sparkles,
  Layers,
  AlignCenter,
  ShieldPlus,
};

/**
 * Dental Care — six dental service cards in the same light editorial system
 * as the Eye Care section (Section 01).
 *
 * • The previous dark banner panel is removed; the section heading uses the
 *   same SectionHeading pattern as Section 01 (same index/eyebrow treatment,
 *   typography hierarchy, spacing and alignment) with the existing verified
 *   dental copy presented unchanged.
 * • The card grid keeps the Eye Care tile style exactly (same borders,
 *   radius, padding, icon treatment, typography and "Request Consultation"
 *   CTA) with the six owner-supplied dental services rendered verbatim.
 * • Below the cards sits the same front-desk guidance strip used by the Eye
 *   Care section — shared strip copy (t.services.stripQ/stripA) so the
 *   wording applies to BOTH eye-care and dental-care visitors — with the
 *   same WhatsApp Us / Call Clinic buttons and icon treatment.
 * • Card CTAs open the same appointment popup with the clinic's default
 *   doctor (Dr. Himanshu Arora) pre-selected, per owner instruction — the
 *   in-popup switcher lets the visitor choose Dr. Shruti Beri Arora in one
 *   tap; booking fields and WhatsApp message structure are untouched.
 */
export function DentalCare() {
  const { t } = useLanguage();
  return (
    <section id="dental-care" aria-label={t.dental.ariaLabel} className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        {/* Section heading — same pattern as Section 01 (Eye Care) */}
        <SectionHeading
          index="02"
          eyebrow={t.dental.eyebrow}
          title={
            <>
              {t.dental.titleA}{" "}
              <span className="accent-italic">{t.dental.titleAccent}</span>
            </>
          }
          lede={t.dental.body}
        />

        {/* Six dental service cards — same tile style as the Eye Care grid */}
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* Post-services front-desk strip — same as the Eye Care section */}
        <Reveal delay={120}>
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-aqua-deep/60 bg-aqua/45 px-6 py-5 sm:flex-row sm:items-center">
            <p className="text-[15px] font-medium text-navy">
              {t.services.stripQ}{" "}
              <span className="text-ink-soft">{t.services.stripA}</span>
            </p>
            <div className="flex shrink-0 flex-wrap gap-3">
              <a
                href={waLink(t.wa.quick.notSure)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-wa px-5 text-sm font-semibold text-white transition hover:bg-wa-deep"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {t.cta.whatsappUs}
              </a>
              <a
                href={clinic.phoneHref}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-navy/25 bg-white px-5 text-sm font-semibold text-navy transition hover:bg-navy hover:text-offwhite"
              >
                <PhoneCall className="h-4 w-4" aria-hidden />
                {t.cta.callClinic}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
