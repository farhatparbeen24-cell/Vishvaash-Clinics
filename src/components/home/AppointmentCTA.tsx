"use client";

import Image from "next/image";
import { CalendarCheck, MapPin, MessagesSquare } from "lucide-react";
import { clinic } from "@/lib/clinic";
import { waLink } from "@/lib/whatsapp";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useAppointment } from "@/components/appointment/AppointmentProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Reveal } from "@/components/ui/Reveal";
import { clinicDoctors, doctorImageSize } from "@/lib/doctors";

/**
 * High-conversion appointment band: copy + steps on the left, a doctor-aware
 * "Schedule Your Visit" card on the right that opens the shared appointment
 * popup (correct doctor preselected). Positioning copy stays honest —
 * request, never confirmation.
 */
export function AppointmentCTA() {
  const { t } = useLanguage();
  const { openAppointmentModal } = useAppointment();
  const stepIcons = [MessagesSquare, WhatsAppIcon, CalendarCheck];

  return (
    <section
      id="appointment"
      aria-label={t.appointment.ariaLabel}
      className="relative scroll-mt-24 overflow-hidden bg-navy band-grid"
    >
      {/* Aqua + orange glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-aqua/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sand/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-14">
          {/* Left copy */}
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-aqua/80">
                <span aria-hidden className="h-px w-8 bg-aqua/40" />
                {t.appointment.eyebrow}
              </p>
              <h2 className="font-display mt-4 text-3xl leading-[1.12] text-offwhite sm:text-4xl lg:text-[2.75rem]">
                {t.appointment.titleA}{" "}
                <span className="accent-italic text-aqua">
                  {t.appointment.titleAccent}
                </span>
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-aqua/75 sm:text-base">
                {t.appointment.sub}
              </p>
            </Reveal>

            <ol className="mt-10 space-y-6">
              {t.appointment.steps.map((step, i) => {
                const Icon = stepIcons[i] ?? CalendarCheck;
                return (
                  <Reveal as="li" key={step.title} delay={i * 100}>
                    <div className="flex gap-4">
                      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/8 text-aqua ring-1 ring-aqua/25">
                        <Icon className="h-5.5 w-5.5" aria-hidden />
                        <span
                          aria-hidden
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-sand font-display text-[11px] font-bold text-navy-deep"
                        >
                          {i + 1}
                        </span>
                      </span>
                      <div>
                        <h3 className="text-[15px] font-bold text-offwhite">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-aqua/70">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ol>

            <Reveal delay={140}>
              <div className="mt-10 rounded-2xl border border-aqua/20 bg-white/5 p-5">
                <p className="text-sm font-bold text-offwhite">
                  {t.appointment.preferTitle}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-aqua/70">
                  {t.appointment.preferBody}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={waLink(t.wa.quick.general)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-wa px-5 text-sm font-bold text-white transition hover:bg-[#0c6a40]"
                  >
                    <WhatsAppIcon className="h-4.5 w-4.5" />
                    {t.appointment.requestOnWhatsApp}
                  </a>
                  <a
                    href={clinic.phoneHref}
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-aqua/35 px-5 text-sm font-semibold text-aqua transition hover:bg-aqua/10"
                  >
                    {t.cta.callClinic}
                  </a>
                </div>
                <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-relaxed text-aqua/60">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sand" aria-hidden />
                  {clinic.address.full}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right: doctor-aware popup launcher card */}
          <Reveal delay={120}>
            <div className="rounded-[26px] border border-aqua/20 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-8">
              <h3 className="font-display text-2xl leading-tight text-offwhite sm:text-[1.7rem]">
                {t.popup.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-aqua/75">
                {t.popup.sub}
              </p>

              <button
                type="button"
                onClick={() => openAppointmentModal()}
                className="mt-5 inline-flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-full bg-sand px-6 text-base font-bold text-navy-deep shadow-[0_16px_32px_-16px_rgba(217,119,42,0.9)] transition hover:bg-[#e08a3c] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                <CalendarCheck className="h-5 w-5" aria-hidden />
                {t.cta.requestAnAppointment}
              </button>

              <div className="mt-6">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-aqua/70">
                  {t.popup.chooseDoctor}
                </p>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {clinicDoctors.map((d) => {
                    const dLabel =
                      d.department === "Eye Care"
                        ? t.doctors.departments.eye
                        : d.department === "Dental Care"
                          ? t.doctors.departments.dental
                          : t.doctors.departments.visiting;
                    const size = doctorImageSize[d.id];
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => openAppointmentModal({ doctorId: d.id })}
                        className="flex min-h-[64px] items-center gap-3 rounded-2xl border border-aqua/25 bg-white/5 p-3 text-left transition hover:border-sand/60 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sand"
                      >
                        {/* The clinic's original owner-verified portrait */}
                        <span
                          aria-hidden
                          className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-sand/70"
                        >
                          <Image
                            src={d.image}
                            alt=""
                            width={size.width}
                            height={size.height}
                            sizes="44px"
                            className="h-full w-full object-cover object-[50%_18%]"
                          />
                        </span>
                        <span className="min-w-0 leading-tight">
                          <span className="block truncate text-sm font-bold text-offwhite">
                            {d.name}
                          </span>
                          <span className="block text-xs font-semibold text-aqua/70">
                            {dLabel}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="mt-5 text-[12.5px] leading-relaxed text-aqua/60">
                {t.form.underButton}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
