"use client";

import { cn } from "@/lib/utils";
import { clinic } from "@/lib/clinic";
import { useLanguage } from "@/components/language/LanguageProvider";

/**
 * Vishvaas Clinic — refined logo lockup.
 *
 * Monogram: dominant "VC" (premium geometric letterforms) with subtle
 * integrated clinical cues — an eyelid curve + orange iris dot inside the V
 * (eye care) and a refined smile arc inside the C (dental care).
 * Palette: navy #0B2B40 mark, orange #D9772A accent only, soft-white space.
 * Wordmark + descriptor typography unchanged (approved).
 */

const NAVY = "#0B2B40";
const OFFWHITE = "#F8FBFC";
const ORANGE = "#D9772A";

function MonogramMark({ stroke }: { stroke: string }) {
  return (
    <svg
      aria-hidden
      viewBox="34.3 37.3 247.4 161.4"
      className="h-10 w-auto shrink-0"
      fill="none"
    >
      {/* V — dominant letterform; bevel apex, confident flat terminals */}
      <path
        d="M 54 56 L 100 184 L 146 56"
        stroke={stroke}
        strokeWidth={35}
        strokeLinecap="butt"
        strokeLinejoin="bevel"
      />
      {/* C — dominant letterform; radial flat terminals */}
      <path
        d="M 267.96 79.43 A 60 60 0 1 0 267.96 156.57"
        stroke={stroke}
        strokeWidth={35}
        strokeLinecap="butt"
      />
      {/* Eye-care cue: eyelid curve nested in the V counter */}
      <path
        d="M 78 88 Q 100 63 122 88"
        stroke={stroke}
        strokeWidth={9}
        strokeLinecap="round"
      />
      {/* Eye-care cue: iris dot (the orange accent) */}
      <circle cx="100" cy="96" r="10.5" fill={ORANGE} />
      {/* Dental-care cue: refined smile arc inside the C counter */}
      <path
        d="M 212 122 Q 232 147 252 122"
        stroke={ORANGE}
        strokeWidth={8.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  tone = "dark",
  compact = false,
  className,
}: {
  tone?: "dark" | "light";
  compact?: boolean;
  className?: string;
}) {
  const { t } = useLanguage();
  const light = tone === "light";
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <MonogramMark stroke={light ? OFFWHITE : NAVY} />
      {/* Wordmark */}
      {!compact && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "whitespace-nowrap font-display text-[19px] font-semibold tracking-[-0.01em]",
              light ? "text-offwhite" : "text-navy"
            )}
          >
            {clinic.name}
          </span>
          <span
            className={cn(
              "mt-1 text-[10px] font-bold uppercase tracking-[0.24em]",
              light ? "text-aqua/75" : "text-sand-deep"
            )}
          >
            {t.brand.descriptor}
          </span>
        </span>
      )}
    </span>
  );
}
