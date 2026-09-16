"use client";

import { ArrowUpRight, Quote, Star } from "lucide-react";
import { approvedTestimonials, testimonialSection } from "@/lib/testimonials";
import { useLanguage } from "@/components/language/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Patient testimonials — verified Google reviews of the clinic.
 *
 * CONTENT SAFETY
 *  • Original review quotations are NEVER translated or altered — they render
 *    exactly as written by the patients, in the patients' own language.
 *  • Only the UI around the quotes (heading, pills, labels) is localized.
 *  • No patient photos, avatars, initials badges or "Verified" badges.
 *  • Desktop/tablet: balanced 2-column grid, no carousel. Mobile: clean
 *    single column. No auto-play or auto-scroll anywhere.
 */

function TestimonialCard({ item }: { item: (typeof approvedTestimonials)[number] }) {
  const { t } = useLanguage();

  const categoryPill =
    item.category === "Dental Care"
      ? t.testimonials.pillDental
      : t.testimonials.pillCataract;
  const dateLabel =
    t.testimonials.dateLabels[item.date] ?? item.date;

  return (
    <article className="flex h-full flex-col rounded-[24px] border border-line bg-white p-7 shadow-[0_18px_40px_-30px_rgba(11,43,64,0.35)] transition-transform duration-300 hover:-translate-y-1 sm:p-8">
      {/* 1 · Five-star rating */}
      <div className="flex items-center justify-between gap-4">
        <span
          className="inline-flex items-center gap-0.5"
          role="img"
          aria-label={t.testimonials.ratedAria}
        >
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star key={i} aria-hidden className="h-4 w-4 fill-sand text-sand" />
          ))}
        </span>
        {/* Decorative quotation mark */}
        <Quote aria-hidden className="h-6 w-6 shrink-0 text-sand/50" />
      </div>

      {/* 2 · Service category pill */}
      <span className="mt-4 self-start whitespace-nowrap rounded-full bg-aqua px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-navy">
        {categoryPill}
      </span>

      {/* 3 · Exact original review quotation — never translated */}
      <blockquote lang="en" className="mt-5 flex-1 text-[15px] leading-relaxed text-ink">
        {item.quote}
      </blockquote>

      {/* 4 · Reviewer name · 5 · Date · 6 · Source */}
      <footer className="mt-6 border-t border-line pt-5">
        <p className="text-sm font-bold text-navy">{item.reviewer}</p>
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-soft">
          <span>{dateLabel}</span>
          <span aria-hidden className="text-line">
            |
          </span>
          <span>{t.testimonials.sourceLabel}</span>
        </p>
      </footer>
    </article>
  );
}

export function Testimonials() {
  const { t } = useLanguage();
  return (
    <section
      id="testimonials"
      aria-label={t.testimonials.ariaLabel}
      className="scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeading
          index="06"
          eyebrow={t.testimonials.eyebrow}
          title={
            <>
              {t.testimonials.titleA}{" "}
              <span className="accent-italic">{t.testimonials.titleAccent}</span>
            </>
          }
          lede={t.testimonials.lede}
          align="center"
        />

        {approvedTestimonials.length > 0 && (
          /* Desktop/tablet: 2-column balanced grid · Mobile: single column */
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {approvedTestimonials.map((item, i) => (
              <Reveal
                key={item.reviewer}
                delay={(i % 2) * 80}
                className="h-full"
              >
                <TestimonialCard item={item} />
              </Reveal>
            ))}
          </div>
        )}

        {/* CTA — links to the clinic's own verified Google Business Profile. */}
        <Reveal delay={140}>
          <div className="mt-10 text-center">
            <a
              href={testimonialSection.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-navy/25 bg-white px-7 text-[15px] font-semibold text-navy transition hover:bg-navy hover:text-offwhite"
            >
              {t.testimonials.readMore}
              <ArrowUpRight className="h-4.5 w-4.5" aria-hidden />
            </a>
            <p className="mt-3 text-xs text-ink-soft/80">
              {t.testimonials.opensNote}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
