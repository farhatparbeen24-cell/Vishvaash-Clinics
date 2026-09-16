"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { CalendarCheck, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { clinic } from "@/lib/clinic";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useAppointment } from "@/components/appointment/AppointmentProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import {
  clinicDoctors,
  doctorImageSize,
  type ClinicDoctor,
} from "@/lib/doctors";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 48;

/**
 * Homepage doctor slider — two synchronized slides, one shared source of
 * truth. The active doctor lives in AppointmentProvider (`activeDoctorId`);
 * navigating the slider updates it, so the appointment popup always opens
 * with the doctor currently on screen.
 *
 * • Doctor surfaces show the clinic's original owner-verified portraits
 *   (lib/doctors.ts) — never in the generic service hero, never stock or
 *   AI-generated stand-ins. Face-safe object-position, stable aspect ratio.
 * • Manual controls: arrows, accessible dots, touch swipe, arrow keys.
 *   No autoplay — the visitor stays in control.
 * • Captions sit on a controlled gradient at the panel's bottom edge.
 *   Works in English and हिंदी.
 */
export function DoctorSlider() {
  const { t } = useLanguage();
  const { activeDoctorId, setActiveDoctor, openAppointmentModal } =
    useAppointment();
  const touchStartX = useRef<number | null>(null);
  const [announce, setAnnounce] = useState("");

  const total = clinicDoctors.length;
  const index = Math.max(
    0,
    clinicDoctors.findIndex((d) => d.id === activeDoctorId)
  );
  const doctor: ClinicDoctor = clinicDoctors[index] ?? clinicDoctors[0];
  const doctorText = t.doctors.people[doctor.id];

  const goTo = (next: number) => {
    const clamped = ((next % total) + total) % total;
    const target = clinicDoctors[clamped];
    setActiveDoctor(target.id);
    setAnnounce(t.doctors.liveRegion(clamped + 1, total, target.name));
  };

  const departmentLabel =
    doctor.department === "Eye Care"
      ? t.doctors.departments.eye
      : t.doctors.departments.dental;

  return (
    <section
      id="doctor"
      aria-label={t.doctors.ariaLabel}
      className="scroll-mt-24 border-y border-line bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeading
          eyebrow={t.doctors.eyebrow}
          title={
            <>
              {t.doctors.titleA}{" "}
              <span className="accent-italic">{t.doctors.titleAccent}</span>
            </>
          }
        />

        <Reveal delay={100}>
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label={t.doctors.ariaLabel}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                goTo(index - 1);
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                goTo(index + 1);
              }
            }}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(dx) >= SWIPE_THRESHOLD) {
                goTo(dx < 0 ? index + 1 : index - 1);
              }
            }}
            className="mt-10 outline-none"
          >
            {/* Track — both slides always rendered: stable height, no CLS */}
            <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_30px_60px_-38px_rgba(11,43,64,0.5)]">
              <div
                className={cn(
                  "flex transition-transform duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] touch-pan-y"
                )}
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {clinicDoctors.map((d, i) => {
                  const text = t.doctors.people[d.id];
                  const dLabel =
                    d.department === "Eye Care"
                      ? t.doctors.departments.eye
                      : t.doctors.departments.dental;
                  const size = doctorImageSize[d.id];
                  const active = i === index;
                  return (
                    <article
                      key={d.id}
                      aria-hidden={!active}
                      inert={!active}
                      className="grid w-full shrink-0 sm:grid-cols-[0.88fr_1.12fr]"
                    >
                      {/* Portrait — the clinic's original owner-verified photo.
                          Fixed aspect ratios keep layout stable; object-cover
                          with a face-safe position (never crops the face). */}
                      <figure className="relative h-72 overflow-hidden bg-navy sm:h-auto sm:min-h-[500px]">
                        <Image
                          src={d.image}
                          alt={d.alt}
                          width={size.width}
                          height={size.height}
                          sizes="(max-width: 640px) 100vw, 40vw"
                          loading={i === 0 ? "eager" : "lazy"}
                          className="h-72 w-full object-cover object-[50%_18%] sm:absolute sm:inset-0 sm:h-full sm:w-full"
                        />
                        {/* Controlled caption scrim — legible text over the
                            lower gradient band only */}
                        <div
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-navy-deep via-navy/72 to-transparent"
                        />
                        {/* Caption — bottom edge only */}
                        <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy-deep">
                            {dLabel}
                          </span>
                          <p className="font-display mt-2 text-2xl leading-tight text-white sm:text-[1.7rem]">
                            {d.name}
                          </p>
                          <p className="mt-0.5 text-[13px] font-medium text-white/85">
                            {text.specialty}
                          </p>
                        </figcaption>
                      </figure>

                      {/* Content */}
                      <div className="flex flex-col justify-center p-6 sm:p-10">
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-sand-deep">
                          {dLabel} · {clinic.shortName}
                        </p>
                        <p className="mt-4 text-[15px] leading-relaxed text-ink-soft sm:text-base">
                          {text.shortDescription}
                        </p>

                        {/* The same options the popup dropdown will show */}
                        <ul className="mt-5 flex flex-wrap gap-2" aria-label={t.form.labels.service}>
                          {d.serviceOptions.map((s) => {
                            const key =
                              clinic.form.serviceOptions.find(
                                (o) => o.value === s
                              )?.key ?? "other";
                            return (
                              <li
                                key={s}
                                className="rounded-full border border-line bg-offwhite px-3 py-1.5 text-[12px] font-semibold text-ink-soft"
                              >
                                {t.form.serviceOptionLabels[key]}
                              </li>
                            );
                          })}
                        </ul>

                        <div className="mt-7 flex flex-wrap items-center gap-4">
                          {/* Primary slide CTA — clinic-approved exact wording,
                              identical on BOTH slides. Orange #D9772A with
                              navy-deep text (5.3:1 contrast, WCAG AA); hover
                              lightens the orange and keeps navy-deep text
                              (6.3:1). Opens the popup for THIS slide's doctor. */}
                          <button
                            type="button"
                            aria-haspopup="dialog"
                            onClick={() => openAppointmentModal(d.id)}
                            className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-sand px-6 text-[15px] font-bold text-navy-deep shadow-[0_14px_28px_-14px_rgba(217,119,42,0.9)] transition hover:bg-[#e08a3c] focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-deep focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                          >
                            <CalendarCheck className="h-4.5 w-4.5" aria-hidden />
                            {t.cta.scheduleVisit}
                          </button>
                          <p className="inline-flex items-center gap-2 text-sm text-ink-soft">
                            <GraduationCap
                              className="h-4.5 w-4.5 text-sand-deep"
                              aria-hidden
                            />
                            {t.doctor.credentialsNote}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Controls: dots + arrows (manual only) */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5" role="tablist" aria-label={t.doctors.ariaLabel}>
                {clinicDoctors.map((d, i) => (
                  <button
                    key={d.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={t.doctors.dotLabel(d.name)}
                    onClick={() => goTo(i)}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2",
                      i === index
                        ? "w-7 bg-sand"
                        : "w-2.5 bg-line hover:bg-aqua-deep"
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  aria-label={t.doctors.prev}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition hover:bg-navy hover:text-offwhite focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  aria-label={t.doctors.next}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition hover:bg-navy hover:text-offwhite focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </div>

            {/* Slide change announcement for screen readers */}
            <p aria-live="polite" className="sr-only">
              {announce || t.doctors.liveRegion(1, total, clinicDoctors[0].name)}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
