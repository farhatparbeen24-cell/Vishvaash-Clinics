"use client";

import { MapPin, Navigation, Phone, Clock, CalendarCheck } from "lucide-react";
import { clinic } from "@/lib/clinic";
import { waLink } from "@/lib/whatsapp";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useAppointment } from "@/components/appointment/AppointmentProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Contact & Location — verified address, click-to-call, WhatsApp and
 * Google Maps embed. (The former entrance-landmark photo figure — captioned
 * "Entrance landmark · VC wall sign" — was removed on clinic instruction;
 * the two-column card/map grid is unchanged.)
 */
export function ContactLocation() {
  const { t } = useLanguage();
  const { openAppointmentModal } = useAppointment();
  return (
    <section id="contact" aria-label={t.contact.ariaLabel} className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeading
          index="05"
          eyebrow={t.contact.eyebrow}
          title={
            <>
              {t.contact.titleA}{" "}
              <span className="accent-italic">{t.contact.titleAccent}</span>
            </>
          }
          lede={t.contact.lede}
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* Contact card */}
          <Reveal>
            <div className="flex h-full flex-col gap-6 rounded-[26px] border border-line bg-white p-6 sm:p-8">
              <div className="flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-aqua text-sand-deep">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-xl text-navy">
                    {clinic.name} – {t.brand.descriptor}
                  </h3>
                  <address className="mt-1.5 not-italic text-[15px] leading-relaxed text-ink-soft">
                    {clinic.address.line1}, {clinic.address.line2},
                    <br />
                    {clinic.address.city}, {clinic.address.state}{" "}
                    {clinic.address.postalCode}, {clinic.address.country}
                  </address>
                </div>
              </div>

              {/* Confirmed hours — summary; full details in the Availability section */}
              <p className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sand-deep" aria-hidden />
                <span>
                  <span className="font-bold text-navy">{t.contact.hoursLabel} </span>
                  {t.availability.days} · {t.availability.slot1} &{" "}
                  {t.availability.slot2}
                  <br />
                  <a
                    href="#availability"
                    className="mt-1 inline-block text-[13px] font-bold text-sand-deep underline-offset-4 hover:underline"
                  >
                    {t.contact.seeTimings} →
                  </a>
                </span>
              </p>

              <div className="mt-auto grid gap-3">
                {/* Primary contact CTA — opens the appointment popup (defaults
                    to Dr. Himanshu Arora; the in-popup doctor switcher lets the
                    visitor choose Dr. Shruti Beri Arora in one tap). */}
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => openAppointmentModal()}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-sand px-6 text-[15px] font-bold text-navy-deep shadow-[0_14px_28px_-14px_rgba(217,119,42,0.9)] transition hover:bg-[#e08a3c] focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-deep focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <CalendarCheck className="h-4.5 w-4.5" aria-hidden />
                  {t.cta.scheduleVisit}
                </button>
                <a
                  href={clinic.phoneHref}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-navy px-6 text-[15px] font-semibold text-offwhite transition hover:bg-navy-hover"
                >
                  <Phone className="h-4.5 w-4.5 text-sand" aria-hidden />
                  {t.contact.callBtn} {clinic.phoneDisplay}
                </a>
                <a
                  href={waLink(t.wa.quick.general)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full bg-wa px-6 text-[15px] font-semibold text-white transition hover:bg-wa-deep"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  {t.cta.whatsappUs}
                </a>
                <a
                  href={clinic.maps.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full border border-navy/25 bg-white px-6 text-[15px] font-semibold text-navy transition hover:bg-aqua"
                >
                  <Navigation className="h-4.5 w-4.5 text-sand-deep" aria-hidden />
                  {t.contact.directionsBtn}
                </a>
              </div>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal delay={120}>
            <div className="h-full min-h-[420px] overflow-hidden rounded-[26px] border border-line bg-aqua/30 shadow-[0_30px_60px_-35px_rgba(11,43,64,0.35)]">
              <iframe
                title={t.contact.mapTitle}
                src={clinic.maps.embed}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[420px] w-full border-0"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
