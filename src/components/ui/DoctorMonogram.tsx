import { doctorMonogram, type ClinicDoctor } from "@/lib/doctors";
import { cn } from "@/lib/utils";

/**
 * Neutral no-photo panel for doctors.
 *
 * WHY: the only doctor imagery ever supplied was AI-generated (design
 * mockups), which the production brief forbids publishing. Until the clinic
 * supplies authentic photographs, every doctor surface renders this
 * restrained monogram panel — navy gradient, display-serif initials, zero
 * invented identity. It is purely decorative (aria-hidden): the doctor's
 * real name and department are always rendered as adjacent visible text.
 *
 * To restore real portraits later, see lib/doctors.ts rule 2.
 */
export function DoctorMonogram({
  doctor,
  className,
  initialsClassName,
}: {
  doctor: ClinicDoctor;
  className?: string;
  initialsClassName?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy via-navy-deep to-[#123a52]",
        className
      )}
    >
      {/* Restrained radial highlight — no decorative shapes, no icons */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_30%_18%,rgba(255,255,255,0.10),transparent_58%)]" />
      <span
        className={cn(
          "font-display relative select-none font-semibold tracking-[0.06em] text-white/92",
          initialsClassName
        )}
      >
        {doctorMonogram[doctor.id]}
      </span>
    </div>
  );
}

/** Compact circular monogram for the popup's doctor switcher chips. */
export function DoctorMonogramBadge({
  doctor,
  className,
}: {
  doctor: ClinicDoctor;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy to-navy-deep ring-2 ring-white",
        className
      )}
    >
      <span className="font-display text-[12px] font-semibold tracking-[0.04em] text-white/92">
        {doctorMonogram[doctor.id]}
      </span>
    </span>
  );
}
