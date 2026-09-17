"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { clinic } from "@/lib/clinic";

/**
 * Vishvaas Clinic — approved logo lockup (owner-supplied transparent PNG).
 *
 * Artwork: VC monogram + "Vishvaas Clinic" + tagline "The Opinion We Can
 * Trust", used exactly as supplied (only fully-transparent canvas margins
 * were trimmed and the asset proportionally downscaled for web sharpness —
 * no change to the monogram, spelling, tagline, colours, typography or
 * proportions). White wordmark + orange accents are designed for the dark
 * header (royal #1428A0) and footer (navy) ribbons.
 * The tagline is part of the artwork and is never removed at any breakpoint.
 */

const LOGO_SRC = "/images/brand/vishvaas-clinic-logo.png";
const LOGO_W = 1260;
const LOGO_H = 203;

export function Logo({
  variant = "default",
  className,
}: {
  /** Retained for call-site compatibility; the approved artwork is
   * identical everywhere (white/orange asset on dark ribbons). */
  tone?: "dark" | "light";
  /** Retained for call-site compatibility; the tagline is never removed. */
  compact?: boolean;
  /**
   * Presentation variant — "header" sizes the lockup for the 72px header
   * ribbon (bolder wordmark than the previous header mark, capped at the
   * footprint the packed desktop row can hold so nav, language switcher and
   * the Book Appointment CTA keep at least their previous breathing room);
   * "default" is the footer sizing (larger, per the approved treatment).
   */
  variant?: "default" | "header";
  className?: string;
}) {
  const header = variant === "header";
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={LOGO_SRC}
        alt={`${clinic.name} — The Opinion We Can Trust`}
        width={LOGO_W}
        height={LOGO_H}
        priority={header}
        draggable={false}
        className={cn(
          "w-auto max-w-none select-none",
          header ? "h-[42px]" : "h-[46px] sm:h-[52px] md:h-[56px]"
        )}
      />
    </span>
  );
}
