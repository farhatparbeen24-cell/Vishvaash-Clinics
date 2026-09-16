"use client";

import { Phone, MapPin } from "lucide-react";
import { clinic } from "@/lib/clinic";
import { waLink } from "@/lib/whatsapp";
import { useLanguage } from "@/components/language/LanguageProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/**
 * Compact premium utility bar — only verified, editable actions:
 * Call · WhatsApp · Get Directions.
 */
export function UtilityBar() {
  const { t } = useLanguage();
  return (
    <div className="bg-royal-deep text-offwhite/90">
      <div className="mx-auto flex h-10 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <p className="hidden items-center gap-2 text-xs tracking-wide text-offwhite/75 md:inline-flex">
          <MapPin className="h-3.5 w-3.5 text-sand" aria-hidden />
          {clinic.address.line1}, {clinic.address.line2}, {clinic.address.city}
        </p>
        <div className="flex w-full items-center justify-between gap-1 md:w-auto md:justify-end md:gap-6">
          <a
            href={clinic.phoneHref}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded px-1.5 text-xs font-semibold tracking-wide transition hover:text-white"
            aria-label={`${t.utility.ariaCall} ${clinic.phoneDisplay}`}
          >
            <Phone className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">{t.utility.callClinic}</span>
            <span className="sm:hidden">{t.utility.call}</span>
          </a>
          <span aria-hidden className="h-3 w-px bg-white/25 md:hidden" />
          <a
            href={waLink(t.wa.quick.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded px-1.5 text-xs font-semibold tracking-wide transition hover:text-white"
            aria-label={t.utility.ariaWhatsApp}
          >
            <WhatsAppIcon className="h-3.5 w-3.5 text-[#4fce5d]" />
            <span className="hidden sm:inline">{t.utility.whatsapp}</span>
            <span className="sm:hidden">{t.utility.whatsapp}</span>
          </a>
          <span aria-hidden className="h-3 w-px bg-white/25" />
          <a
            href={clinic.maps.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded px-1.5 text-xs font-semibold tracking-wide transition hover:text-white"
            aria-label={t.utility.ariaDirections}
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            {t.utility.directions}
          </a>
        </div>
      </div>
    </div>
  );
}
