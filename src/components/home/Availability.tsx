"use client";

import { CalendarDays, Clock, MapPin, Info } from "lucide-react";
import { clinic } from "@/lib/clinic";
import { useLanguage } from "@/components/language/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Availability — confirmed clinic timings.
 * Regular hours (Mon–Sat, two daily slots) + the visually distinct Visiting
 * Glaucoma Consultation exception (1st & 3rd Thursday at Ramrati Eye Care,
 * Prem Nagar) with an honest notice that the doctor is unavailable at
 * Vishvaas Clinic during those hours.
 */
export function Availability() {
  const { t } = useLanguage();
  const a = t.availability;

  return (
    <section
      id="availability"
      aria-label={a.ariaLabel}
      className="scroll-mt-24 border-t border-line bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeading
          index={a.index}
          eyebrow={a.eyebrow}
          title={
            <>
              {a.titlePrefix} {clinic.name}
            </>
          }
          align="center"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Regular timings */}
          <Reveal>
            <div className="flex h-full flex-col rounded-[26px] border border-line bg-offwhite p-7 sm:p-9">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-sand">
                  <CalendarDays className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="font-display text-xl leading-snug text-navy sm:text-2xl">
                  {a.regularHeading}
                </h3>
              </div>

              <p className="mt-6 text-[15px] font-bold text-navy">{a.days}</p>
              <ul className="mt-4 grid gap-3">
                <li className="flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4">
                  <Clock className="h-5 w-5 shrink-0 text-sand-deep" aria-hidden />
                  <span className="text-[15px] font-semibold text-ink">{a.slot1}</span>
                </li>
                <li className="flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4">
                  <Clock className="h-5 w-5 shrink-0 text-sand-deep" aria-hidden />
                  <span className="text-[15px] font-semibold text-ink">{a.slot2}</span>
                </li>
              </ul>
            </div>
          </Reveal>

          {/* Visiting Glaucoma Consultation — distinct orange accent */}
          <Reveal delay={100}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[26px] border border-sand/40 bg-offwhite p-7 sm:p-9">
              {/* Orange edge accent */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1.5 bg-sand"
              />
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sand/15 text-sand-deep ring-1 ring-sand/40">
                  <CalendarDays className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="font-display text-xl leading-snug text-navy sm:text-2xl">
                  {a.exceptionHeading}
                </h3>
              </div>

              <ul className="mt-6 grid gap-3">
                <li className="flex items-center gap-3 rounded-2xl border border-sand/30 bg-white px-5 py-4">
                  <CalendarDays className="h-5 w-5 shrink-0 text-sand-deep" aria-hidden />
                  <span className="text-[15px] font-semibold text-ink">{a.exceptionWhen}</span>
                </li>
                <li className="flex items-center gap-3 rounded-2xl border border-sand/30 bg-white px-5 py-4">
                  <Clock className="h-5 w-5 shrink-0 text-sand-deep" aria-hidden />
                  <span className="text-[15px] font-semibold text-ink">{a.exceptionTime}</span>
                </li>
                <li className="flex items-center gap-3 rounded-2xl border border-sand/30 bg-white px-5 py-4">
                  <MapPin className="h-5 w-5 shrink-0 text-sand-deep" aria-hidden />
                  <span className="text-[15px] font-semibold text-ink">{a.exceptionWhere}</span>
                </li>
              </ul>

              {/* Honest availability notice */}
              <p className="mt-6 flex items-start gap-2.5 rounded-2xl border border-sand/40 bg-sand/10 px-4 py-3.5 text-[13.5px] font-medium leading-relaxed text-navy">
                <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sand-deep" aria-hidden />
                {a.notice}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Helper text */}
        <Reveal delay={160}>
          <p className="mt-8 text-center text-sm leading-relaxed text-ink-soft">
            {a.helper}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
