"use client";

import Image from "next/image";
import {
  Award,
  BadgeCheck,
  Building2,
  CalendarCheck,
  CalendarClock,
  Clock,
  GraduationCap,
} from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useAppointment } from "@/components/appointment/AppointmentProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import {
  CORE_DOCTORS,
  VISITING_DOCTORS,
  doctorImageSize,
  type ClinicDoctor,
} from "@/lib/doctors";
import { cn } from "@/lib/utils";

/**
 * Homepage "Meet the Doctors" section — Phase 3 rebuild.
 *
 * Two subsections in a single section, in this exact order:
 *   A. Core Doctors        — Dr. Himanshu Arora, Dr. Shruti Beri Arora
 *   B. Visiting Specialists — Dr. Shalabh Aggarwal, Dr. Akshay Rawat
 *
 * • One shared card design for all four doctors: same portrait framing
 *   (aspect-ratio-stable, face-safe object-position), same typography,
 *   spacing, hover behaviour and CTA. Two cards per row on desktop,
 *   clean stack on mobile (no clipping, no horizontal scroll).
 * • The section keeps its existing main heading and carries NO section
 *   number (the numbered scheme covers the seven content sections only).
 * • Every card CTA opens the shared appointment popup with THAT doctor
 *   pre-selected; requests go only to the clinic's common WhatsApp number.
 * • Portraits are the clinic's approved Phase 3 photographs (lib/doctors.ts
 *   rule 2) — real, owner-supplied, non-destructively transcoded; never
 *   AI-generated, never stock.
 */

/** Department/visiting pill label for a doctor, per language. */
function useDoctorBadgeLabel() {
  const { t } = useLanguage();
  return (d: ClinicDoctor) => {
    if (d.department === "Eye Care") return t.doctors.departments.eye;
    if (d.department === "Dental Care") return t.doctors.departments.dental;
    return t.doctors.departments.visiting;
  };
}

function DoctorCard({
  doctor,
  delay,
}: {
  doctor: ClinicDoctor;
  delay: number;
}) {
  const { t } = useLanguage();
  const { openAppointmentModal } = useAppointment();
  const badgeLabel = useDoctorBadgeLabel()(doctor);
  const text = t.doctors.people[doctor.id];
  const size = doctorImageSize[doctor.id];
  const isVisiting = doctor.group === "visiting";

  return (
    <Reveal as="li" delay={delay} className="h-full">
      <article
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-white",
          "transition-all duration-300 hover:-translate-y-1 hover:border-sand/40",
          "hover:shadow-[0_24px_48px_-28px_rgba(11,43,64,0.35)]"
        )}
      >
        {/* Portrait — approved Phase 3 photograph, uniform face-safe framing.
            Fixed aspect ratio keeps every card equal-height and undistorted;
            object-cover with object-position ≈ 50% 20% never crops a face. */}
        <figure className="relative aspect-[4/5] overflow-hidden bg-navy sm:aspect-[5/4] lg:aspect-[4/5]">
          <Image
            src={doctor.image}
            alt={doctor.alt}
            width={size.width}
            height={size.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 576px"
            loading="lazy"
            className="h-full w-full object-cover object-[50%_20%]"
          />
          {/* Badge — department for core doctors, "Visiting Specialist" for
              visiting specialists; same pill style across all four cards. */}
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy-deep shadow-sm">
            {badgeLabel}
          </span>
        </figure>

        {/* Content — identical structure and rhythm on all four cards */}
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <h4 className="font-display text-2xl leading-tight text-navy">
            {doctor.name}
          </h4>
          <p className="mt-1.5 text-[13px] font-bold uppercase tracking-[0.12em] text-sand-deep">
            {text.role}
          </p>
          {text.focus && (
            <p className="mt-1 text-sm font-medium text-ink-soft">
              {text.focus}
            </p>
          )}

          {/* Credentials — verbatim approved facts only */}
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink">
            <li className="flex items-start gap-2.5">
              <GraduationCap
                className="mt-0.5 h-4 w-4 shrink-0 text-sand-deep"
                aria-hidden
              />
              <span>
                <span className="sr-only">{t.doctors.cardLabels.qualifications}: </span>
                {doctor.qualifications}
              </span>
            </li>
            {text.credentialLine && (
              <li className="flex items-start gap-2.5">
                <Award className="mt-0.5 h-4 w-4 shrink-0 text-sand-deep" aria-hidden />
                <span>{text.credentialLine}</span>
              </li>
            )}
            {doctor.registration && (
              <li className="flex items-start gap-2.5">
                <BadgeCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-sand-deep"
                  aria-hidden
                />
                <span>
                  <span className="sr-only">{t.doctors.cardLabels.registration}: </span>
                  {t.doctors.regPrefix} {doctor.registration}
                </span>
              </li>
            )}
            {doctor.clinic && (
              <li className="flex items-start gap-2.5">
                <Building2
                  className="mt-0.5 h-4 w-4 shrink-0 text-sand-deep"
                  aria-hidden
                />
                <span>
                  <span className="sr-only">{t.doctors.cardLabels.clinic}: </span>
                  {doctor.clinic}
                </span>
              </li>
            )}
          </ul>

          {/* Visiting hours — labelled rows, same styling on both specialists */}
          {(text.hours || text.saturday) && (
            <dl className="mt-4 space-y-2 rounded-xl bg-offwhite p-4 text-sm">
              {text.hours && (
                <div className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sand-deep" aria-hidden />
                  <div>
                    <dt className="sr-only">{t.doctors.cardLabels.consultingHours}</dt>
                    <dd>
                      <span className="font-bold text-navy">
                        {t.doctors.cardLabels.consultingHours}:{" "}
                      </span>
                      <span className="text-ink">{text.hours}</span>
                    </dd>
                  </div>
                </div>
              )}
              {text.saturday && (
                <div className="flex items-start gap-2.5">
                  <CalendarClock
                    className="mt-0.5 h-4 w-4 shrink-0 text-sand-deep"
                    aria-hidden
                  />
                  <div>
                    <dt className="sr-only">{t.doctors.cardLabels.availability}</dt>
                    <dd>
                      <span className="font-bold text-navy">
                        {t.doctors.cardLabels.availability}:{" "}
                      </span>
                      <span className="text-ink">{text.saturday}</span>
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          )}

          {/* CTA — same style as the existing doctor-card CTA; opens the
              shared booking popup with THIS doctor pre-selected */}
          <div className="mt-auto pt-6">
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => openAppointmentModal(doctor.id)}
              aria-label={`${t.cta.scheduleVisit}: ${doctor.name}`}
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-sand px-6 text-[15px] font-bold text-navy-deep shadow-[0_14px_28px_-14px_rgba(217,119,42,0.9)] transition hover:bg-[#e08a3c] focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-deep focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <CalendarCheck className="h-4.5 w-4.5" aria-hidden />
              {t.cta.scheduleVisit}
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function SubsectionHeading({ label }: { label: string }) {
  return (
    <h3
      aria-hidden
      className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-trust"
    >
      <span className="h-px w-8 bg-trust/40" />
      {label}
    </h3>
  );
}

export function DoctorSlider() {
  const { t } = useLanguage();

  return (
    <section
      id="doctor"
      aria-label={t.doctors.ariaLabel}
      className="scroll-mt-24 border-y border-line bg-white"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        {/* Existing main heading — unchanged; no section number */}
        <SectionHeading
          eyebrow={t.doctors.eyebrow}
          title={
            <>
              {t.doctors.titleA}{" "}
              <span className="accent-italic">{t.doctors.titleAccent}</span>
            </>
          }
        />

        {/* A. Core Doctors */}
        <div className="mt-12">
          <Reveal>
            <SubsectionHeading label={t.doctors.coreLabel} />
          </Reveal>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {CORE_DOCTORS.map((d, i) => (
              <DoctorCard key={d.id} doctor={d} delay={i * 90} />
            ))}
          </ul>
        </div>

        {/* B. Visiting Specialists — visually distinct via its own heading
            and extra spacing, same section and card system */}
        <div className="mt-14">
          <Reveal>
            <SubsectionHeading label={t.doctors.visitingLabel} />
          </Reveal>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {VISITING_DOCTORS.map((d, i) => (
              <DoctorCard key={d.id} doctor={d} delay={i * 90} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
