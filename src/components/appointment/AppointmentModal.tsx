"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import {
  clinicDoctors,
  doctorImageSize,
  type ClinicDoctor,
  type DoctorId,
} from "@/lib/doctors";
import { AppointmentForm } from "./AppointmentForm";
import { cn } from "@/lib/utils";

/**
 * Doctor-aware appointment popup — dialog heading "Book an Appointment".
 *
 * Desktop: left panel = the selected doctor's portrait (the clinic's original
 * owner-verified photo, face-safe crop) + verified profile label (department
 * pill, name, specialty); right panel = the request form. Mobile: compact
 * photo header above the form, close button always visible, only the form
 * column scrolls (so the on-screen keyboard never hides fields).
 *
 * Stacking: the dialog is rendered through a React portal directly into
 * `document.body`, so NO parent container (overflow, transform, filter,
 * sticky headers, slider tracks) can clip it or create a stacking context
 * above it. Documented layers — backdrop z-index 9998, dialog z-index 9999 —
 * sit above every page layer, including the sticky header (z-50) and the
 * mobile bottom bar (z-50).
 *
 * Every doctor-specific element (image, name, specialty, department, service
 * options, WhatsApp message) is derived from the single `doctor` object —
 * one doctor's photo can never appear with another doctor's name.
 */
export function AppointmentModal({
  doctor,
  prefillService,
  onSwitchDoctor,
  onClose,
}: {
  doctor: ClinicDoctor;
  prefillService: string | null;
  onSwitchDoctor: (id: DoctorId) => void;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const size = doctorImageSize[doctor.id];

  // Focus management: focus the close button on open, restore focus to the
  // trigger on close, trap Tab inside the dialog, close on Escape.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

    document.addEventListener("keydown", onKeyDown, true);

    // Scroll lock — applied to BOTH <html> and <body>. Chrome does not
    // propagate body overflow to the viewport, so locking the body alone
    // leaves the page scrollable behind the dialog. Compensate for the
    // disappearing scrollbar so the layout does not shift.
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

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.paddingRight = prevBodyPadding;
      document.documentElement.style.overflow = prevHtmlOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const departmentLabel =
    doctor.department === "Eye Care"
      ? t.doctors.departments.eye
      : doctor.department === "Dental Care"
        ? t.doctors.departments.dental
        : t.doctors.departments.visiting;
  const doctorText = t.doctors.people[doctor.id];

  return createPortal(
    <>
      {/* Backdrop — documented layer z-index: 9998. Click to close. */}
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-navy-deep/75 backdrop-blur-[3px]"
      />

      {/* Dialog layer — documented layer z-index: 9999. Pointer events pass
          through the empty area to the backdrop; the dialog itself captures
          clicks, so background page controls are unreachable while open. */}
      <div className="pointer-events-none fixed inset-0 z-[9999] flex items-end justify-center sm:items-center sm:p-6">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="appointment-modal-title"
          className="pointer-events-auto relative flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[26px] bg-white shadow-[0_40px_90px_-30px_rgba(8,31,48,0.7)] outline-none max-480:max-h-[85dvh] sm:max-h-[min(760px,92dvh)] sm:rounded-[26px]"
        >
          {/* Mobile bottom-sheet drag handle — visual affordance only (≤480px).
              Desktop/tablet (sm: panel layout) never shows it. */}
          <div
            aria-hidden
            className="mx-auto mt-2.5 hidden h-1.5 w-11 shrink-0 rounded-full bg-navy/20 max-480:block"
          />
          {/* Close — always visible, never scrolls away */}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.popup.close}
            className="absolute right-3 top-3 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-navy shadow-md ring-1 ring-line transition hover:bg-aqua focus:outline-none focus-visible:ring-2 focus-visible:ring-sand"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>

          <div className="grid min-h-0 flex-1 sm:grid-cols-[0.88fr_1.12fr]">
            {/* ── Doctor panel (selected doctor ONLY) ─────────────────── */}
            <figure className="relative h-44 shrink-0 overflow-hidden bg-navy sm:h-auto sm:min-h-[540px] max-480:hidden">
              {/* The clinic's original owner-verified portrait — face-safe
                  crop, same doctor as the name/specialty below */}
              <Image
                src={doctor.image}
                alt={doctor.alt}
                width={size.width}
                height={size.height}
                sizes="(max-width: 640px) 100vw, 40vw"
                className="h-44 w-full object-cover object-[50%_22%] sm:absolute sm:inset-0 sm:h-full sm:w-full sm:object-cover"
                priority
              />
              {/* Controlled bottom gradient for text legibility */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-deep via-navy/72 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy-deep">
                  {departmentLabel}
                </span>
                <p className="font-display mt-2 text-xl leading-tight text-white sm:text-2xl">
                  {doctor.name}
                </p>
                <p className="mt-0.5 text-[13px] font-medium text-white/85">
                  {doctorText.role}
                </p>
              </figcaption>
            </figure>

            {/* ── Form column ─────────────────────────────────────────── */}
            <div className="flex min-h-0 min-w-0 flex-col">
              <div className="border-b border-line bg-offwhite px-5 pb-4 pt-5 max-480:px-4 max-480:pb-3 max-480:pt-4 sm:px-8 sm:pb-5 sm:pt-7">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-sand-deep">
                  {t.popup.eyebrow}
                </p>
                <h2
                  id="appointment-modal-title"
                  className="font-display mt-1.5 text-2xl leading-tight text-navy max-480:mt-1 max-480:text-[1.35rem] sm:text-[1.75rem]"
                >
                  {t.popup.heading}
                </h2>
                <p className="mt-1.5 text-sm font-semibold leading-relaxed text-navy max-480:mt-1 max-480:text-[13.5px]">
                  {t.popup.support}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft max-480:mt-1 max-480:text-[12.5px]">
                  {t.popup.sub}
                </p>

                {/* Doctor switcher — global opens can always change doctor */}
                <div
                  role="group"
                  aria-label={t.popup.chooseDoctor}
                  className="mt-4 max-480:mt-3"
                >
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-soft">
                    {t.popup.chooseDoctor}
                  </p>
                  {/* ≤480px: compact two-column selector grid — same four
                      doctors, same photos, same onSwitchDoctor/preselection.
                      >480px: original wrap layout, untouched. */}
                  <div className="mt-2 flex flex-wrap gap-2 max-480:mt-1.5 max-480:grid max-480:grid-cols-2 max-480:gap-2">
                    {clinicDoctors.map((d) => {
                      const active = d.id === doctor.id;
                      const dLabel =
                        d.department === "Eye Care"
                          ? t.doctors.departments.eye
                          : d.department === "Dental Care"
                            ? t.doctors.departments.dental
                            : t.doctors.departments.visiting;
                      const dSize = doctorImageSize[d.id];
                      return (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => onSwitchDoctor(d.id)}
                          aria-pressed={active}
                          className={cn(
                            "inline-flex min-h-[48px] items-center gap-2.5 rounded-2xl border px-3 py-1.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sand",
                            active
                              ? "border-sand bg-sand/10 shadow-[0_6px_16px_-10px_rgba(217,119,42,0.8)]"
                              : "border-line bg-white hover:border-sand/50 hover:bg-aqua/50"
                          )}
                        >
                          <span
                            aria-hidden
                            className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white"
                          >
                            <Image
                              src={d.image}
                              alt=""
                              width={dSize.width}
                              height={dSize.height}
                              sizes="36px"
                              className="h-full w-full object-cover object-[50%_20%]"
                            />
                          </span>
                          <span className="leading-tight">
                            <span
                              className={cn(
                                "block text-[13px] font-bold",
                                active ? "text-navy" : "text-ink"
                              )}
                            >
                              {d.name}
                            </span>
                            <span className="block text-[11px] font-semibold text-ink-soft">
                              {dLabel}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Scrollable form area — the on-screen keyboard scrolls fields
                  into view inside this container, never off-screen.
                  ≤480px bottom sheet: independent momentum scrolling with
                  overscroll containment (page stays locked behind); bottom
                  padding is zeroed so the pinned submit bar sits flush with
                  the sheet edge (in-flow end-spacing lives on the form's
                  last block instead). */}
              <div className="nice-scroll min-h-0 flex-1 overflow-y-auto px-5 py-5 [-webkit-overflow-scrolling:touch] max-480:overscroll-contain max-480:px-4 max-480:pt-4 max-480:pb-0 sm:px-8 sm:py-6">
                <AppointmentForm
                  doctor={doctor}
                  initialService={prefillService}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
    "vishvaas-appointment-modal"
  );
}
