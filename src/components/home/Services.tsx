"use client";

import Image from "next/image";
import { Eye, Droplets, ScanEye, Siren, PhoneCall } from "lucide-react";
import { clinic } from "@/lib/clinic";
import { doctorIdByDepartment } from "@/lib/doctors";
import { useLanguage } from "@/components/language/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCta } from "./ServiceCta";
import { waLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye,
  Droplets,
  ScanEye,
  Siren,
};

/**
 * Eye-care services — exactly the four verified categories, each with a
 * patient-friendly, claim-free description and a consultation CTA.
 */
export function Services() {
  const { t } = useLanguage();
  return (
    <section id="eye-care" aria-label={t.services.ariaLabel} className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="01"
            eyebrow={t.services.eyebrow}
            title={
              <>
                {t.services.titleA}{" "}
                <span className="accent-italic">{t.services.titleAccent}</span>
                {t.services.titleB}
              </>
            }
            lede={t.services.lede}
          />
          {/* Decorative equipment visual — clearly labelled stock, never passed off as the clinic */}
          <Reveal delay={120} className="hidden lg:block">
            <figure className="relative w-44 shrink-0">
              <div className="absolute -left-3 -top-3 h-full w-full rounded-2xl bg-aqua" aria-hidden />
              <Image
                src={clinic.images.decorative.slitLamp.src}
                alt={clinic.images.decorative.slitLamp.alt}
                width={352}
                height={352}
                sizes="176px"
                loading="lazy"
                className="photo-grade relative aspect-square w-full rounded-2xl border border-line object-cover"
              />
              <figcaption className="mt-2 text-right text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-soft/70">
                {t.services.illustrativeTag}
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {clinic.services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Eye;
            const copy = t.services.items[i] ?? {
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
                      doctorId={doctorIdByDepartment["Eye Care"]}
                    />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

        {/* Post-services CTA strip */}
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
