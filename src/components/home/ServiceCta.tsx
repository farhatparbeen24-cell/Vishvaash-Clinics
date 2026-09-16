"use client";

import { CalendarCheck } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useAppointment } from "@/components/appointment/AppointmentProvider";

/**
 * "Request Consultation" button on a service card — opens the appointment
 * popup with the department's doctor preselected and the card's service
 * pre-selected from that doctor's own dropdown. `canonical` is the stable
 * English service value (mapped to form values inside the provider).
 */
export function ServiceCta({
  canonical,
  label,
  doctorId,
}: {
  canonical: string;
  label: string;
  doctorId: string;
}) {
  const { openAppointmentModal } = useAppointment();

  return (
    <button
      type="button"
      onClick={() => openAppointmentModal({ doctorId, service: canonical })}
      className="group/link inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-sand-deep transition hover:text-sand focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-offset-2"
      aria-label={`${label}: ${canonical}`}
    >
      <CalendarCheck
        className="h-4 w-4 transition-transform group-hover/link:translate-x-0.5"
        aria-hidden
      />
      {label}
    </button>
  );
}
