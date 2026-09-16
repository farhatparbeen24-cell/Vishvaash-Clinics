"use client";

import { Phone, CalendarCheck } from "lucide-react";
import { clinic } from "@/lib/clinic";
import { waLink } from "@/lib/whatsapp";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useAppointment } from "@/components/appointment/AppointmentProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/**
 * Sticky mobile action bar: Call · WhatsApp · Book Appointment.
 * Fixed to the viewport bottom on small screens only, with safe-area padding.
 */
export function MobileBottomNav() {
  const { t } = useLanguage();
  const { openAppointmentModal } = useAppointment();
  return (
    <nav
      aria-label={t.nav.ariaMobile}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-navy/60 bg-navy-deep/98 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-3">
        <a
          href={clinic.phoneHref}
          className="flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-semibold tracking-wide text-aqua transition active:bg-white/10"
          aria-label={`${t.hero.callChipAria} ${clinic.phoneDisplay}`}
        >
          <Phone className="h-5 w-5" aria-hidden />
          {t.utility.call}
        </a>
        <a
          href={waLink(t.wa.quick.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-semibold tracking-wide text-aqua transition active:bg-white/10"
          aria-label={t.utility.ariaWhatsApp}
        >
          <WhatsAppIcon className="h-5 w-5 text-[#4fce5d]" />
          {t.utility.whatsapp}
        </a>
        <button
          type="button"
          onClick={() => openAppointmentModal()}
          className="flex min-h-[60px] flex-col items-center justify-center gap-1 bg-sand text-[11px] font-bold tracking-wide text-navy-deep transition active:bg-sand-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-sand focus-visible:ring-inset"
          aria-label={t.appointment.ariaLabel}
        >
          <CalendarCheck className="h-5 w-5" aria-hidden />
          {t.cta.bookAppointment}
        </button>
      </div>
    </nav>
  );
}
