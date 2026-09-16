"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { galleryImages } from "@/lib/galleryImages";
import { cn } from "@/lib/utils";

const LIGHTBOX_Z_BACKDROP = 9994;
const LIGHTBOX_Z_DIALOG = 9995;

/**
 * "Inside Vishvaas Clinic" — compact editorial gallery of owner-supplied
 * clinic photographs (the ONLY imagery allowed here per the production
 * brief; no generic stock, no other clinics' interiors).
 *
 * • Desktop: 3-column grid with a larger lead image. Mobile: 2-column grid.
 * • Consistent 4:3 tiles with object-cover → no masonry misalignment, no CLS.
 * • Every tile opens an accessible lightbox (click / tap / Enter): close
 *   button, Escape, ←/→ navigation, focus trap, focus restore, labelled
 *   controls. No autoplay, no carousel motion.
 * • Reduced motion: transitions collapse to near-instant.
 */
export function ClinicGallery() {
  const { t, locale } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const total = galleryImages.length;
  const isOpen = openIndex !== null;
  const current = isOpen ? galleryImages[openIndex] : null;

  const close = useCallback(() => {
    setOpenIndex(null);
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((idx) =>
        idx === null ? idx : ((idx + delta) % total + total) % total
      );
    },
    [total]
  );

  /* Focus management + scroll lock + key handling while the lightbox is open */
  useEffect(() => {
    if (!isOpen) return;
    const raf = requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPadding = document.body.style.paddingRight;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.paddingRight = prevBodyPadding;
      document.documentElement.style.overflow = prevHtmlOverflow;
      /* Focus returns to the tile that opened the lightbox */
      triggerRef.current?.focus();
    };
  }, [isOpen, close, step]);

  const openLightbox = (i: number) => (trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setOpenIndex(i);
  };

  return (
    <section
      id="gallery"
      aria-label={t.gallery.ariaLabel}
      className="scroll-mt-24 border-y border-line bg-offwhite"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <SectionHeading
          eyebrow={t.gallery.eyebrow}
          title={t.gallery.title}
          lede={t.gallery.lede}
        />

        <Reveal delay={100}>
          <ul
            className={cn(
              "mt-10 grid grid-cols-2 gap-3 sm:gap-4",
              "md:grid-cols-3"
            )}
          >
            {galleryImages.map((img, i) => {
              const isLead = i === 0;
              return (
                <li
                  key={img.id}
                  className={cn(isLead && "col-span-2 md:col-span-2")}
                >
                  <button
                    type="button"
                    onClick={(e) => openLightbox(i)(e.currentTarget)}
                    aria-label={`${t.gallery.openImage}: ${img.alt[locale]}`}
                    className="group relative block w-full overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_40px_-30px_rgba(11,43,64,0.55)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite"
                  >
                    <span className="relative block aspect-[4/3] w-full">
                      <Image
                        src={img.src}
                        alt={img.alt[locale]}
                        width={img.width}
                        height={img.height}
                        sizes={
                          isLead
                            ? "(max-width: 767px) 100vw, (max-width: 1151px) 66vw, 720px"
                            : "(max-width: 767px) 50vw, (max-width: 1151px) 33vw, 350px"
                        }
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none group-hover:scale-[1.03] motion-reduce:group-hover:scale-none"
                      />
                      {/* Subtle zoom affordance chip — restrained, no clutter */}
                      <span
                        aria-hidden
                        className="absolute bottom-2.5 right-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy-deep/70 text-white opacity-90 transition group-hover:opacity-100"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>

      {/* ── Accessible lightbox (portal; opens ONLY on user interaction) ── */}
      {isOpen &&
        current &&
        createPortal(
          <>
            <div
              aria-hidden
              onClick={close}
              className="fixed inset-0 bg-navy-deep/85 z-[9994]"
              style={{ zIndex: LIGHTBOX_Z_BACKDROP }}
            />
            <div
              className="pointer-events-none fixed inset-0 flex items-center justify-center p-4 sm:p-8"
              style={{ zIndex: LIGHTBOX_Z_DIALOG }}
            >
              <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label={t.gallery.lightbox.ariaLabel}
                className="pointer-events-auto relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-navy-deep shadow-[0_40px_90px_-30px_rgba(8,31,48,0.8)] outline-none"
              >
                {/* Close — first in tab order, always visible */}
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  aria-label={t.gallery.lightbox.close}
                  className="absolute right-3 top-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-navy shadow-md transition hover:bg-aqua focus:outline-none focus-visible:ring-2 focus-visible:ring-sand"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>

                <div className="relative flex min-h-0 items-center justify-center bg-navy-deep p-2 sm:p-4">
                  <Image
                    src={current.src}
                    alt={current.alt[locale]}
                    width={current.width}
                    height={current.height}
                    sizes="(max-width: 767px) 92vw, 800px"
                    className="max-h-[62dvh] w-auto max-w-full rounded-lg object-contain"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 sm:px-5">
                  <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-white/85">
                    {current.alt[locale]}
                  </p>
                  <p
                    aria-live="polite"
                    className="shrink-0 text-[12px] font-semibold tabular-nums text-white/60"
                  >
                    {t.gallery.lightbox.counter(
                      (openIndex ?? 0) + 1,
                      total
                    )}
                  </p>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label={t.gallery.lightbox.prev}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sand"
                    >
                      <ChevronLeft className="h-5 w-5" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label={t.gallery.lightbox.next}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sand"
                    >
                      <ChevronRight className="h-5 w-5" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body,
          "vishvaas-gallery-lightbox"
        )}
    </section>
  );
}
