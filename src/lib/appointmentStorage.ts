/**
 * ─────────────────────────────────────────────────────────────────────────────
 * VISHVAAS CLINIC — auto-popup suppression storage (client-only)
 * ─────────────────────────────────────────────────────────────────────────────
 * Drives the ONE-TIME automatic "Book an Appointment" popup on the homepage:
 *
 *  • Session suppression — after the popup has auto-opened once (i.e. the
 *    visitor has seen, closed or dismissed it), it never auto-opens again in
 *    the same browser session (sessionStorage).
 *  • 30-day suppression — after a visitor SUCCESSFULLY submits an appointment
 *    request (WhatsApp deep link opened), the popup is not auto-opened again
 *    for at least 30 days, across sessions (localStorage timestamp).
 *
 * Manual opens (header / hero / service cards / doctor cards / launcher card)
 * are never suppressed and never write the session flag — they must always
 * work normally.
 *
 * All access is guarded: privacy modes that block storage simply degrade to
 * "no memory", which is the safe, least-surprising behaviour.
 */

const AUTO_SHOWN_KEY = "vishvaas:auto-appointment:shown-at";
const SUBMITTED_KEY = "vishvaas:appointment:submitted-at";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/** Record that the automatic popup has fired this browser session. */
export function markAutoPopupShown(): void {
  try {
    sessionStorage.setItem(AUTO_SHOWN_KEY, String(Date.now()));
  } catch {
    /* storage unavailable — popup simply may re-show next session */
  }
}

/** True if the automatic popup already fired in this browser session. */
export function wasAutoPopupShownThisSession(): boolean {
  try {
    return sessionStorage.getItem(AUTO_SHOWN_KEY) !== null;
  } catch {
    return false;
  }
}

/** Record a SUCCESSFUL appointment request (WhatsApp deep link opened). */
export function markAppointmentSubmitted(): void {
  try {
    localStorage.setItem(SUBMITTED_KEY, String(Date.now()));
  } catch {
    /* storage unavailable — suppression degrades gracefully */
  }
}

/** True if an appointment request was successfully submitted in the last 30 days. */
export function wasAppointmentSubmittedRecently(): boolean {
  try {
    const raw = localStorage.getItem(SUBMITTED_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    return Number.isFinite(ts) && Date.now() - ts < THIRTY_DAYS_MS;
  } catch {
    return false;
  }
}
