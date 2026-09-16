"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Loader2,
  MessageSquareWarning,
  Phone,
  Send,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { clinic } from "@/lib/clinic";
import { appointmentWhatsAppUrl, openWhatsApp } from "@/lib/whatsapp";
import { useLanguage } from "@/components/language/LanguageProvider";
import type { ClinicDoctor } from "@/lib/doctors";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";

type FormData = {
  name: string;
  phone: string;
  date: string;
  time: string; // canonical English value
  service: string; // canonical English value
  message: string;
  consent: boolean;
};

type Errors = Partial<Record<keyof FormData, string>>;
type Status = "idle" | "opening" | "sent";

const emptyForm: FormData = {
  name: "",
  phone: "",
  date: "",
  time: "",
  service: "",
  message: "",
  consent: false,
};

/** Local yyyy-mm-dd for today (blocks past dates in the picker + validation). */
function todayLocalISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 10);
}

/**
 * Doctor-aware appointment request form (rendered inside AppointmentModal).
 *
 * • The service dropdown lists ONLY the selected doctor's own serviceOptions.
 * • The pre-filled WhatsApp request names the selected doctor + department.
 * • When the doctor is switched inside the popup, only the doctor-specific
 *   field (service) is reset — patient-entered data is kept intact.
 */
export function AppointmentForm({
  doctor,
  initialService = null,
}: {
  doctor: ClinicDoctor;
  /** Canonical English service value to pre-select when the popup opens. */
  initialService?: string | null;
}) {
  const { t, locale } = useLanguage();
  const [form, setForm] = useState<FormData>({
    ...emptyForm,
    service: initialService ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [showFallback, setShowFallback] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string>("");
  const [minDate, setMinDate] = useState<string>("");
  const nameRef = useRef<HTMLInputElement>(null);

  // Compute "today" on the client so the picker always blocks past dates in
  // the visitor's own timezone (server-rendered dates can be stale by a day).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMinDate(todayLocalISO()));
    return () => cancelAnimationFrame(raf);
  }, []);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (f: FormData): Errors => {
    const e: Errors = {};
    if (!f.name.trim()) e.name = t.form.errors.name;
    else if (f.name.trim().length < 2) e.name = t.form.errors.nameShort;

    const digits = f.phone.replace(/\D/g, "");
    if (!f.phone.trim()) e.phone = t.form.errors.phone;
    else if (
      !((digits.length === 10 || digits.length === 12) && /^(91)?[6-9]\d{9}$/.test(digits))
    )
      e.phone = t.form.errors.phoneInvalid;

    if (!f.date) e.date = t.form.errors.date;
    else if (f.date < todayLocalISO()) e.date = t.form.errors.datePast;

    if (!f.time) e.time = t.form.errors.time;
    if (!f.service) e.service = t.form.errors.service;
    if (!f.consent) e.consent = t.form.errors.consent;
    return e;
  };

  // Service options are filtered per doctor — one doctor's photo can never
  // end up next to another doctor's services.
  const doctorServiceOptions = clinic.form.serviceOptions.filter((o) =>
    doctor.serviceOptions.includes(o.value)
  );

  // Doctor switched inside the popup → clear only the doctor-specific field.
  // (Render-phase state adjustment — the React-recommended pattern for
  // "reset part of the state when a prop changes".)
  const [prevDoctorId, setPrevDoctorId] = useState(doctor.id);
  if (prevDoctorId !== doctor.id) {
    setPrevDoctorId(doctor.id);
    setForm((f) => ({ ...f, service: "" }));
    setErrors((e) => ({ ...e, service: undefined }));
  }

  /** Friendly front-desk date, localized (e.g. "Thu, 12 Mar 2026"). */
  const formatForFrontDesk = (iso: string): string => {
    const [y, m, day] = iso.split("-").map(Number);
    const d = new Date(y, (m ?? 1) - 1, day);
    return d.toLocaleDateString(t.form.dateLocale, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const timeLabel = (key: string) =>
    t.form.timeOptions[key as keyof typeof t.form.timeOptions] ?? key;
  const serviceLabel = (key: string) =>
    t.form.serviceOptionLabels[
      key as keyof typeof t.form.serviceOptionLabels
    ] ?? key;

  const handleAppointmentSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      // Move focus to the first invalid field for keyboard / screen readers
      const order: Array<keyof FormData> = [
        "name",
        "phone",
        "date",
        "time",
        "service",
        "message",
        "consent",
      ];
      const first = order.find((k) => nextErrors[k]);
      if (first) {
        const el = document.getElementById(`field-${first}`);
        el?.focus();
      }
      return;
    }

    // Locale-aware pre-filled message incl. the selected doctor + department;
    // same number, same routing, same patient-entered data.
    const url = appointmentWhatsAppUrl(
      {
        doctorName: doctor.name,
        department: doctor.whatsappLabel,
        name: form.name.trim(),
        phone: form.phone.trim(),
        date: formatForFrontDesk(form.date),
        time: form.time,
        service: form.service,
        message: form.message.trim(),
      },
      locale
    );

    setStatus("opening");
    setShowFallback(false);
    setFallbackUrl(url);

    // Attempt to open WhatsApp; detect blockage both via the return value
    // and a window-blur heuristic (noopener makes the return value null in
    // some browsers, so the heuristic avoids false "blocked" states).
    let opened = false;
    const markOpened = () => {
      opened = true;
    };
    window.addEventListener("blur", markOpened, { once: true });

    const handle = openWhatsApp(url);

    window.setTimeout(() => {
      window.removeEventListener("blur", markOpened);
      const blocked = handle === null && !opened;
      setStatus("sent");
      setShowFallback(blocked || handle === null ? true : false);
    }, 1200);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setErrors({});
    setStatus("idle");
    setShowFallback(false);
    nameRef.current?.focus();
  };

  const inputBase =
    "min-h-[52px] w-full rounded-xl border bg-white px-4 text-[15px] text-ink placeholder:text-ink-soft/50 transition focus:outline-none focus:ring-2 focus:ring-sand/60";
  const inputOk = "border-line hover:border-sand/40";
  const inputErr = "border-destructive/70 bg-destructive/5 focus:ring-destructive/40";

  return (
    <form
      onSubmit={handleAppointmentSubmit}
      noValidate
      aria-label={t.form.ariaLabel}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div className="sm:col-span-1">
          <label htmlFor="field-name" className="mb-1.5 block text-sm font-bold text-navy">
            {t.form.labels.name} <span className="text-destructive" aria-hidden>*</span>
          </label>
          <input
            ref={nameRef}
            id="field-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t.form.placeholders.name}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "error-name" : undefined}
            className={cn(inputBase, errors.name ? inputErr : inputOk)}
          />
          {errors.name && (
            <p id="error-name" role="alert" className="mt-1.5 text-[13px] font-medium text-destructive">
              {errors.name}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="sm:col-span-1">
          <label htmlFor="field-phone" className="mb-1.5 block text-sm font-bold text-navy">
            {t.form.labels.phone} <span className="text-destructive" aria-hidden>*</span>
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/60" aria-hidden />
            <input
              id="field-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t.form.placeholders.phone}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "error-phone" : undefined}
              className={cn(inputBase, "pl-11", errors.phone ? inputErr : inputOk)}
            />
          </div>
          {errors.phone && (
            <p id="error-phone" role="alert" className="mt-1.5 text-[13px] font-medium text-destructive">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="field-date" className="mb-1.5 block text-sm font-bold text-navy">
            {t.form.labels.date} <span className="text-destructive" aria-hidden>*</span>
          </label>
          <input
            id="field-date"
            name="date"
            type="date"
            min={minDate || undefined}
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? "error-date" : "hint-date"}
            className={cn(inputBase, errors.date ? inputErr : inputOk)}
          />
          {errors.date ? (
            <p id="error-date" role="alert" className="mt-1.5 text-[13px] font-medium text-destructive">
              {errors.date}
            </p>
          ) : (
            <p id="hint-date" className="mt-1.5 text-[12px] text-ink-soft/80">
              {t.form.hintDate}
            </p>
          )}
        </div>

        {/* Time */}
        <div>
          <label htmlFor="field-time" className="mb-1.5 block text-sm font-bold text-navy">
            {t.form.labels.time} <span className="text-destructive" aria-hidden>*</span>
          </label>
          <div className="relative">
            <select
              id="field-time"
              name="time"
              value={form.time}
              onChange={(e) => set("time", e.target.value)}
              aria-invalid={!!errors.time}
              aria-describedby={errors.time ? "error-time" : undefined}
              className={cn(
                inputBase,
                "appearance-none pr-10",
                errors.time ? inputErr : inputOk,
                !form.time && "text-ink-soft/60"
              )}
            >
              <option value="" disabled>
                {t.form.placeholders.time}
              </option>
              {clinic.form.timeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {timeLabel(o.key)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/60" aria-hidden />
          </div>
          {errors.time && (
            <p id="error-time" role="alert" className="mt-1.5 text-[13px] font-medium text-destructive">
              {errors.time}
            </p>
          )}
        </div>

        {/* Service */}
        <div className="sm:col-span-2">
          <label htmlFor="field-service" className="mb-1.5 block text-sm font-bold text-navy">
            {t.form.labels.service} <span className="text-destructive" aria-hidden>*</span>
          </label>
          <div className="relative">
            <select
              id="field-service"
              name="service"
              value={form.service}
              onChange={(e) => set("service", e.target.value)}
              aria-invalid={!!errors.service}
              aria-describedby={errors.service ? "error-service" : undefined}
              className={cn(
                inputBase,
                "appearance-none pr-10",
                errors.service ? inputErr : inputOk,
                !form.service && "text-ink-soft/60"
              )}
            >
              <option value="" disabled>
                {t.form.placeholders.service}
              </option>
              {doctorServiceOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {serviceLabel(o.key)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/60" aria-hidden />
          </div>
          {errors.service && (
            <p id="error-service" role="alert" className="mt-1.5 text-[13px] font-medium text-destructive">
              {errors.service}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="sm:col-span-2">
          <label htmlFor="field-message" className="mb-1.5 block text-sm font-bold text-navy">
            {t.form.labels.message}{" "}
            <span className="font-medium text-ink-soft/70">{t.form.optional}</span>
          </label>
          <textarea
            id="field-message"
            name="message"
            rows={3}
            placeholder={t.form.placeholders.message}
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            className={cn(inputBase, "min-h-[96px] resize-y py-3.5", inputOk)}
          />
        </div>
      </div>

      {/* Consent */}
      <div className="mt-5">
        <div className="flex items-start gap-3 rounded-xl border border-line bg-offwhite p-4">
          <input
            id="field-consent"
            name="consent"
            type="checkbox"
            checked={form.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "error-consent" : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-[#0b2b40]"
          />
          <label htmlFor="field-consent" className="cursor-pointer text-sm leading-relaxed text-ink">
            {t.form.consent}{" "}
            <span className="text-destructive" aria-hidden>*</span>
          </label>
        </div>
        {errors.consent && (
          <p id="error-consent" role="alert" className="mt-1.5 text-[13px] font-medium text-destructive">
            {errors.consent}
          </p>
        )}
      </div>

      {/* Privacy note */}
      <p className="mt-4 flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-soft">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sand-deep" aria-hidden />
        {t.form.privacyNote}
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "opening"}
        className={cn(
          "mt-6 inline-flex min-h-[56px] w-full items-center justify-center gap-2.5 rounded-full bg-wa text-base font-bold text-white",
          "shadow-[0_16px_32px_-16px_rgba(14,122,74,0.7)] transition hover:bg-wa-deep active:scale-[0.99]",
          status === "opening" && "cursor-wait opacity-80"
        )}
      >
        {status === "opening" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            {t.form.submitting}
          </>
        ) : (
          <>
            <Send className="h-5 w-5" aria-hidden />
            {t.form.submit}
          </>
        )}
      </button>
      <p className="mt-3 text-center text-[12.5px] leading-relaxed text-ink-soft">
        {t.form.underButton}
      </p>

      {/* Post-submit status (never says "confirmed") */}
      {status === "sent" && (
        <div
          role="status"
          className="mt-5 rounded-2xl border border-aqua-deep bg-aqua/40 p-4"
        >
          <p className="flex items-start gap-2.5 text-sm leading-relaxed text-navy">
            <WhatsAppIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-wa" />
            <span>{t.form.afterSubmit}</span>
          </p>
          {showFallback && (
            <p className="mt-3 flex items-start gap-2.5 border-t border-aqua-deep/70 pt-3 text-sm leading-relaxed text-navy">
              <MessageSquareWarning className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sand-deep" aria-hidden />
              <span>
                {t.form.popupProblem}{" "}
                <a
                  href={fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-wa underline underline-offset-2 hover:text-wa-deep"
                >
                  {t.form.popupLink}
                </a>
                .
              </span>
            </p>
          )}
          <button
            type="button"
            onClick={resetForm}
            className="mt-3 text-[13px] font-bold text-sand-deep underline-offset-4 hover:underline"
          >
            {t.form.sendAnother}
          </button>
        </div>
      )}

      {/* Emergency note */}
      <p className="mt-6 flex items-start gap-2.5 rounded-2xl border border-sand/50 bg-sand/10 p-4 text-[12.5px] leading-relaxed text-ink">
        <ShieldAlert className="mt-0.5 h-4.5 w-4.5 shrink-0 text-sand-deep" aria-hidden />
        {t.form.emergencyNote}
      </p>

      {/* Screen-reader live region announcing the form purpose */}
      <p className="sr-only">{t.form.srNote}</p>
    </form>
  );
}
