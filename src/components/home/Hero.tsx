"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  ArrowUpRight,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { heroSlides } from "@/lib/heroImages";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useAppointment } from "@/components/appointment/AppointmentProvider";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 48;

/**
 * Hero — cinematic 4-slide eye + dental introduction.
 *
 * IMAGERY
 *  • Generic licensed editorial/stock visuals only (see lib/heroImages.ts for
 *    source, creator and license of every file). They illustrate eye care and
 *    dental care and are NEVER presented as Vishvaas Clinic premises, staff
 *    or doctors — alt text describes the generic scene only. No doctor
 *    portraits: real doctor photos live in the Meet Our Doctors section.
 *  • Slide 1 is priority-loaded (LCP); slides 2–4 are lazy-loaded. Explicit
 *    fill + fixed section height = stable hero, no layout shift.
 *
 * DESIGN
 *  • Image-led: a navy gradient sits only behind the text area (bottom band
 *    on mobile, per-side on desktop mirroring each photo's composition), so
 *    the photo keeps its detail. White copy, orange restricted to the primary
 *    CTA and small accents; secondary CTA is a white outline button.
 *  • Fixed heights (560 / 620 / 640px) keep the hero identical across slides.
 *
 * INTERACTION
 *  • Exactly 4 slides: visible prev/next buttons, labelled dots + "Slide x of 4"
 *    counter, touch swipe, ArrowLeft/Right keys, strong focus-visible rings.
 *    AUTOPLAY: advances every 8 seconds with a subtle 500ms cross-fade and
 *    loops 4 → 1. It starts automatically after the first slide is displayed
 *    (unless the visitor prefers reduced motion — then it stays off until the
 *    visitor explicitly presses “Play slideshow”).
 *  • STRICT USER CONTROL (WCAG 2.2.2): a visible, labelled Pause/Play button
 *    sits with the other controls. Hovering the hero with a mouse, focusing
 *    ANY hero element, or navigating manually (arrows, dots, swipe, keys)
 *    stops rotation and it does NOT resume when hover/focus leaves — rotation
 *    resumes only when the visitor explicitly presses “Play slideshow”
 *    (resuming from the current slide with a fresh 8-second cycle).
 *  • Screen readers hear polite announcements for MANUALLY selected slides
 *    only — automatic rotation is silent.
 *  • The primary CTA opens the existing appointment popup preselected with
 *    the slide's doctor (Eye → Dr. Himanshu Arora, Dental → Dr. Shruti Beri
 *    Arora); the secondary CTA anchors to the existing service section. The
 *    popup never opens on its own.
 */
const AUTOPLAY_INTERVAL_MS = 8000;

/** Reactive prefers-reduced-motion (hydration-safe: server snapshot = false). */
function subscribePrefersReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export function Hero() {
  const { t } = useLanguage();
  const { openAppointmentModal } = useAppointment();
  const [index, setIndex] = useState(0);
  const [announce, setAnnounce] = useState("");
  // Autoplay mode: "auto" = default behaviour (rotate unless the visitor
  // prefers reduced motion), "off" = latched stop (hover/focus/manual nav/
  // Pause — resumes ONLY via an explicit Play press), "on" = explicit opt-in
  // (Play pressed, honouring a reduced-motion visitor's choice to start).
  const [mode, setMode] = useState<"auto" | "off" | "on">("auto");
  const prefersReducedMotion = useSyncExternalStore(
    subscribePrefersReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
  // Bumped when the tab becomes visible again so the cycle restarts cleanly
  // (a slide never changes the moment a visitor returns to the tab).
  const [cycleKey, setCycleKey] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const total = heroSlides.length;
  const slide = heroSlides[index];
  const text = t.hero.slides[slide.id];
  const isEye = slide.department === "Eye Care";
  const textRight = slide.align === "right";

  // Rotation actually runs from mount (initial slide fully displayed) unless
  // reduced motion is preferred; it loops 4 → 1 every 8 seconds.
  const playing = mode === "on" || (mode === "auto" && !prefersReducedMotion);

  // The 8-second rotation. Keyed on `index` so every slide — advanced
  // automatically or manually — gets a full, fresh 8-second cycle, and keyed
  // on `cycleKey` so a returning tab starts a fresh cycle too.
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      // Never advance while the tab is hidden — the visitor would miss it.
      if (document.hidden) return;
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [playing, index, cycleKey, total]);

  useEffect(() => {
    const onVisibility = () => {
      if (!document.hidden) setCycleKey((k) => k + 1);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () =>
      document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // STRICT LATCH: mouse hover over the hero, keyboard focus on any hero
  // element, or manual navigation stops rotation and it does NOT resume when
  // hover/focus leaves — only an explicit “Play slideshow” press resumes it.
  // Pointer events are used so a touch TAP does not count as hover — tapping
  // the Pause button on a phone must pause, not race the hover latch.
  const latchStop = () => setMode("off");

  // Manual navigation: updates the slide immediately, announces politely to
  // assistive tech, and stops autoplay (resumes only via “Play slideshow”).
  const goTo = (next: number) => {
    const clamped = ((next % total) + total) % total;
    setMode("off");
    setIndex(clamped);
    setAnnounce(
      t.hero.liveRegion(clamped + 1, total, t.hero.slides[heroSlides[clamped].id].navLabel)
    );
  };

  return (
    <section id="top" aria-label={t.hero.ariaLabel}>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={t.hero.ariaLabel}
        className="relative h-[600px] overflow-hidden bg-navy sm:h-[620px] lg:h-[640px]"
        onPointerEnter={(e) => {
          // Mouse hovering anywhere over the hero latches autoplay off
          // (a touch tap is not hover — the tap target keeps priority).
          if (e.pointerType === "mouse") latchStop();
        }}
        onFocus={latchStop}
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
      >
        {/* Slides — all mounted, cross-faded; height never changes */}
        {heroSlides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.id}
              aria-hidden={!active}
              inert={!active}
              className={cn(
                "absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none",
                active ? "opacity-100" : "pointer-events-none opacity-0"
              )}
            >
              <Image
                src={s.image}
                alt={active ? s.alt : ""}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : "lazy"}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: s.objectPosition }}
              />
            </div>
          );
        })}

        {/* Navy gradient behind the text area only — photo detail preserved
            everywhere else. Bottom band on mobile; per-side on desktop,
            mirroring each slide's composition. */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/55 to-transparent",
            textRight ? "lg:bg-gradient-to-l" : "lg:bg-gradient-to-r"
          )}
        />

        {/* Copy + CTAs + controls — bottom-anchored, above the gradient */}
        <div className="absolute inset-x-0 bottom-0">
          <div
            className={cn(
              "mx-auto flex w-full max-w-6xl px-4 pb-7 sm:px-6 sm:pb-9 lg:pb-12",
              textRight ? "lg:justify-end" : "lg:justify-start"
            )}
          >
            <div className="max-w-xl">
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-offwhite/85">
                <span aria-hidden className="h-px w-8 bg-sand" />
                {text.eyebrow}
              </p>

              <h1 className="font-display mt-3 text-balance text-[1.9rem] leading-[1.12] tracking-[-0.01em] text-white sm:text-4xl lg:text-[2.9rem]">
                {text.heading}
              </h1>

              <p className="mt-3 max-w-lg text-pretty text-[15px] leading-relaxed text-white/85 sm:text-base">
                {text.copy}
              </p>

              {/* CTAs — primary opens the existing popup preselected with this
                  slide's doctor; secondary anchors to the existing section. */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => openAppointmentModal({ doctorId: slide.doctorId })}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-sand px-6 text-[15px] font-bold text-navy-deep shadow-[0_14px_28px_-14px_rgba(217,119,42,0.9)] transition hover:bg-[#e08a3c] focus:outline-none focus-visible:ring-2 focus-visible:ring-offwhite focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                >
                  <CalendarCheck className="h-4.5 w-4.5" aria-hidden />
                  {text.primary}
                </button>
                <a
                  href={isEye ? "#eye-care" : "#dental-care"}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/45 px-6 text-[15px] font-semibold text-white transition hover:border-white hover:bg-white hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-offwhite focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                >
                  {text.secondary}
                  <ArrowUpRight className="h-4.5 w-4.5" aria-hidden />
                </a>
              </div>

              {/* Controls — labelled dots + counter, visible prev/next, and
                  the autoplay Pause/Play control. Dots carry ≥44px-tall hit
                  areas (32px wide, WCAG 2.5.8); on phones the counter +
                  swipe + arrows take over. */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 sm:mt-6 sm:justify-start sm:gap-6">
                <div className="flex items-center gap-3">
                  <div
                    role="tablist"
                    aria-label={t.hero.ariaLabel}
                    className="hidden items-center sm:flex"
                  >
                    {heroSlides.map((s, i) => (
                      <button
                        key={s.id}
                        type="button"
                        role="tab"
                        aria-selected={i === index}
                        aria-label={t.hero.dotLabel(t.hero.slides[s.id].navLabel)}
                        onClick={() => goTo(i)}
                        className="inline-flex h-11 w-8 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "rounded-full transition-all duration-300",
                            i === index ? "h-2.5 w-7 bg-sand" : "h-2.5 w-2.5 bg-white/40"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <span
                    aria-hidden
                    className="text-[11px] font-bold tabular-nums tracking-[0.14em] text-white/70"
                  >
                    {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Autoplay Pause/Play — a real, labelled, keyboard-
                      accessible button (never a decorative icon alone). The
                      visible text IS the accessible name; it sits with the
                      other controls, covering no headline, CTA or focal
                      content. ≥44px touch target. */}
                  <button
                    type="button"
                    onClick={() => setMode(playing ? "off" : "on")}
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/35 bg-navy/25 px-3.5 text-[12px] font-semibold text-white transition hover:border-white hover:bg-white hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                  >
                    {playing ? (
                      <Pause className="h-3.5 w-3.5" aria-hidden />
                    ) : (
                      <Play className="h-3.5 w-3.5" aria-hidden />
                    )}
                    <span className="whitespace-nowrap">
                      {playing ? t.hero.pause : t.hero.play}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(index - 1)}
                    aria-label={t.hero.prev}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/35 text-white transition hover:border-white hover:bg-white hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(index + 1)}
                    aria-label={t.hero.next}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/35 text-white transition hover:border-white hover:bg-white hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide change announcement for screen readers */}
        <p aria-live="polite" className="sr-only">
          {announce || t.hero.liveRegion(1, total, t.hero.slides[heroSlides[0].id].navLabel)}
        </p>
      </div>
    </section>
  );
}
