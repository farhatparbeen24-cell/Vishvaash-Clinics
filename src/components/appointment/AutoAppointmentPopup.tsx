"use client";

import { useEffect, useRef } from "react";
import { useAppointment } from "./AppointmentProvider";
import {
  markAutoPopupShown,
  wasAppointmentSubmittedRecently,
  wasAutoPopupShownThisSession,
} from "@/lib/appointmentStorage";

/**
 * One-time automatic "Book an Appointment" popup — homepage only.
 *
 * Behaviour (owner-approved spec):
 *  • Waits until the homepage has VISIBLY loaded (window `load`), then opens
 *    the shared booking modal once after a 4-second delay — never instantly.
 *  • Reuses the existing AppointmentModal through the existing provider —
 *    no duplicate form, same doctor pre-selection (clinic default), same
 *    fields, CAPTCHA and WhatsApp flow as every manual CTA open.
 *  • Once per browser session: after it has fired (seen / closed / dismissed)
 *    it never auto-opens again this session (sessionStorage flag).
 *  • 30-day suppression: after a successful submission it never auto-opens
 *    again for at least 30 days (localStorage timestamp, set by
 *    AppointmentForm at the moment the WhatsApp deep link is opened).
 *  • Manual CTAs are unaffected: they neither read nor write these flags.
 *  • If the visitor already has the modal open when the timer fires (e.g.
 *    they used a CTA within the first seconds), the dialog is not disturbed
 *    and the auto-show is still consumed for this session.
 *
 * This component renders nothing; it is mounted only on the homepage, so no
 * other page can ever auto-open the dialog.
 */

const AUTO_OPEN_DELAY_MS = 4000;

export function AutoAppointmentPopup() {
  const { isOpen, openAppointmentModal } = useAppointment();

  // Mirror of `isOpen` so the timer callback can check it without the effect
  // depending on it (the trigger must not restart when the modal opens/closes).
  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    // Suppression check runs once on mount AND once at fire time (a request
    // could complete between mount and the 4-second mark).
    const suppressed = () =>
      wasAppointmentSubmittedRecently() || wasAutoPopupShownThisSession();

    if (suppressed()) return;

    let timer: number | undefined;
    let cancelled = false;

    const startCountdown = () => {
      if (cancelled) return;
      timer = window.setTimeout(() => {
        if (cancelled || suppressed()) return;
        // The one automatic show for this session is consumed now, whether
        // we open the dialog or the visitor already has it open.
        markAutoPopupShown();
        if (!isOpenRef.current) openAppointmentModal();
      }, AUTO_OPEN_DELAY_MS);
    };

    // "Only after the homepage has visibly loaded": begin the 4-second
    // countdown once the full page (including images) has finished loading.
    if (document.readyState === "complete") {
      startCountdown();
    } else {
      window.addEventListener("load", startCountdown, { once: true });
    }

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
      window.removeEventListener("load", startCountdown);
    };
  }, []);

  return null;
}
