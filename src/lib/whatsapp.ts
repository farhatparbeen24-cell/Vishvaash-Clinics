/**
 * WhatsApp routing helpers.
 *
 * ⚠️ The routing number below is the clinic-verified WhatsApp front desk
 * number. It must always be exactly "917252991991" (country code + number,
 * no "+", no spaces) for wa.me links.
 *
 * Message TEMPLATES are locale-aware (see lib/translations.ts → wa) so the
 * pre-filled message follows the visitor's selected language. Patient-entered
 * data and the front-desk number are never altered.
 */

import { translations, type Locale } from "@/lib/translations";

export const clinicWhatsAppNumber = "917252991991";

/** Base wa.me link, optionally with a pre-filled (URL-encoded) message. */
export function waLink(text?: string): string {
  const base = `https://wa.me/${clinicWhatsAppNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export type AppointmentRequestData = {
  /** Selected doctor's exact name, e.g. "Dr. Himanshu Arora" (never translated). */
  doctorName: string;
  /** Canonical English department label: "Eye Care" | "Dental Care". */
  department: string;
  name: string;
  phone: string;
  date: string; // formatted for the front desk, e.g. "Thu, 12 Mar 2026"
  time: string;
  service: string;
  message?: string;
};

/** Fully-encoded wa.me URL for an appointment request in the selected language. */
export function appointmentWhatsAppUrl(
  d: AppointmentRequestData,
  locale: Locale = "en"
): string {
  return waLink(translations[locale].wa.appointment(d));
}

/**
 * Opens WhatsApp in a new tab/window.
 * Returns `null` when the popup was blocked — the caller must then show a
 * manual fallback link so the patient is never left stranded.
 */
export function openWhatsApp(url: string): Window | null {
  // noopener is required for security; note that some browsers return null
  // when noopener is passed, so callers should ALSO use a fallback timer.
  try {
    return window.open(url, "_blank", "noopener,noreferrer");
  } catch {
    return null;
  }
}
