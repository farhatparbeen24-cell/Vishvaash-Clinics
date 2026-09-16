"use client";

import { HeartHandshake, MapPin, MessageSquareText, Stethoscope, CalendarCheck } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useAppointment } from "@/components/appointment/AppointmentProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Why Choose Us — factual trust points only.
 * (The former entrance-photo card — "Look for the VC sign at the clinic
 * entrance" — was removed on clinic instruction; the layout was rebalanced
 * to a full-width point grid: 4 columns on desktop, 2 on tablet, stacked on
 * mobile. Heading, copy, points and CTA are unchanged.)
 */
export function TrustSection() {
  const { t } = useLanguage();
  const { openAppointmentModal } = useAppointment();
  const icons = [HeartHandshake, MapPin, MessageSquareText, Stethoscope];
  return (
    <section id="why-us" aria-label={t.trust.ariaLabel} className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeading
          index="03"
          eyebrow={t.trust.eyebrow}
          title={
            <>
              {t.trust.titleA}{" "}
              <span className="accent-italic">{t.trust.titleAccent}</span>
            </>
          }
          lede={t.trust.lede}
        />

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.trust.points.map((point, i) => {
            const Icon = icons[i] ?? HeartHandshake;
            return (
              <Reveal as="li" key={point.title} delay={i * 90}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-sand/40">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-aqua text-sand-deep">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-[15px] font-bold leading-snug text-navy">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {point.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={140}>
          <button
            type="button"
            onClick={() => openAppointmentModal()}
            className="mt-8 inline-flex min-h-[50px] items-center gap-2 rounded-full bg-navy px-6 text-[15px] font-semibold text-offwhite shadow-[0_12px_26px_-14px_rgba(11,43,64,0.55)] transition hover:bg-navy-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2"
          >
            <CalendarCheck className="h-4.5 w-4.5 text-sand" aria-hidden />
            {t.cta.requestAnAppointment}
          </button>
        </Reveal>
      </div>
    </section>
  );
}
