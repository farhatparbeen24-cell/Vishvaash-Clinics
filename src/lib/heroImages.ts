import type { DoctorId } from "./doctors";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * HOMEPAGE HERO — SLIDE CONFIGURATION & IMAGE PROVENANCE
 * ─────────────────────────────────────────────────────────────────────────────
 * Slides 2 and 4 use authentic, client-provided Vishvaas Clinic photographs
 * (owner-verified, supplied 2026-09; displayed exactly as provided). Slides 1
 * and 3 remain generic licensed editorial/stock imagery used to illustrate
 * eye care and dental care — they never depict Vishvaas Clinic and must never
 * be presented as such (alt text describes the generic scene only).
 *
 * SOURCING RULES (same discipline as lib/brands.ts):
 *  • Stock-derived assets may come only from sources that permit commercial
 *    website use (Unsplash / Pexels licenses, Wikimedia Commons public domain
 *    / CC, or a paid-stock license the clinic holds).
 *  • Clinic photographs are used only from owner-provided originals.
 *  • Never image-search thumbnails, watermarked previews or re-created media.
 *  • Keep each file's provenance row below in sync with the actual asset.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type HeroSlideId = "eyeIntro" | "eyeExam" | "dentalIntro" | "dentalRoom";

export type HeroSlide = {
  id: HeroSlideId;
  /** Local asset under /public. */
  image: string;
  /**
   * Generic visual description (NOT branded as Vishvaas Clinic) — verbatim
   * style from the clinic-approved hero brief.
   */
  alt: string;
  /** Purposeful focus point for the object-cover crop. */
  objectPosition: string;
  /** Which side the text panel occupies on desktop (mirrors composition). */
  align: "left" | "right";
  /** Appointment popup preselection for this slide's primary CTA. */
  department: "Eye Care" | "Dental Care";
  doctorId: DoctorId;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "eyeIntro",
    image: "/images/hero/hero-eye-examination.jpg",
    alt: "Eye examination in a clinical setting",
    objectPosition: "40% 30%",
    align: "right",
    department: "Eye Care",
    doctorId: "himanshu-arora",
  },
  {
    id: "eyeExam",
    image: "/images/hero/vishvaas-clinic-staff-hero-slide-2.png",
    alt: "Vishvaas Clinic staff",
    objectPosition: "44% 45%",
    align: "left",
    department: "Eye Care",
    doctorId: "himanshu-arora",
  },
  {
    id: "dentalIntro",
    image: "/images/hero/hero-dental-consultation.jpg",
    alt: "Dental consultation in a clinical setting",
    objectPosition: "55% 30%",
    align: "right",
    department: "Dental Care",
    doctorId: "shruti-beri-arora",
  },
  {
    id: "dentalRoom",
    image: "/images/hero/vishvaas-clinic-dental-room-hero-slide-4.png",
    alt: "Dental treatment room at Vishvaas Clinic",
    objectPosition: "28% 40%",
    align: "left",
    department: "Dental Care",
    doctorId: "shruti-beri-arora",
  },
];

/** Provenance record — keep alongside the assets for the clinic's records. */
export const heroImageProvenance: Array<{
  file: string;
  source: string;
  sourceUrl: string;
  creator: string;
  license: string;
  note: string;
}> = [
  {
    file: "/images/hero/hero-eye-examination.jpg",
    source: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Luke_AFB_eye_exam.jpg",
    creator: "U.S. Air Force photo / Staff Sgt. Darlene Seltmann",
    license: "Public domain (U.S. Air Force photograph)",
    note: "Generic licensed visual imagery — not Vishvaas Clinic.",
  },
  {
    file: "/images/hero/vishvaas-clinic-staff-hero-slide-2.png",
    source: "Vishvaas Clinic (client-provided original)",
    sourceUrl: "",
    creator: "Vishvaas Clinic — owner-verified staff photograph",
    license: "Clinic-owned (used with permission)",
    note: "Authentic Vishvaas Clinic staff photo — homepage hero slide 2 only.",
  },
  {
    file: "/images/hero/hero-dental-consultation.jpg",
    source: "Unsplash",
    sourceUrl:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95",
    creator:
      "Unsplash contributor (creator name not programmatically retrievable from this environment; Unsplash License requires no attribution)",
    license: "Unsplash License (free for commercial website use)",
    note: "Generic licensed visual imagery — not Vishvaas Clinic.",
  },
  {
    file: "/images/hero/vishvaas-clinic-dental-room-hero-slide-4.png",
    source: "Vishvaas Clinic (client-provided original)",
    sourceUrl: "",
    creator: "Vishvaas Clinic — owner-verified dental treatment-room photograph",
    license: "Clinic-owned (used with permission)",
    note: "Authentic Vishvaas Clinic dental treatment room — homepage hero slide 4 only.",
  },
];
