import type { DoctorId } from "./doctors";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * HOMEPAGE HERO — SLIDE CONFIGURATION & IMAGE PROVENANCE
 * ─────────────────────────────────────────────────────────────────────────────
 * All four hero visuals are generic licensed editorial/stock imagery used to
 * illustrate eye care and dental care. NONE of them depicts Vishvaas Clinic,
 * its doctors, its staff, its equipment or its premises. They must never be
 * presented as such (alt text and captions describe generic visual content).
 *
 * SOURCING RULES (same discipline as lib/brands.ts):
 *  • Assets may come only from sources that permit commercial website use
 *    (Unsplash / Pexels licenses, Wikimedia Commons public domain / CC, or a
 *    paid-stock license the clinic holds).
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
    image: "/images/hero/hero-vision-testing.jpg",
    alt: "Vision diagnostic equipment in use",
    objectPosition: "50% 28%",
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
    image: "/images/hero/hero-dental-room.jpg",
    alt: "Modern dental treatment room",
    objectPosition: "56% 55%",
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
    file: "/images/hero/hero-vision-testing.jpg",
    source: "Wikimedia Commons",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:633rd_Aerospace_Medicine_Squadron_131219-F-DM526-173.jpg",
    creator: "Senior Airman Jason Brown (U.S. Air Force)",
    license: "Public domain (U.S. Air Force photograph)",
    note: "Generic licensed visual imagery — not Vishvaas Clinic.",
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
    file: "/images/hero/hero-dental-room.jpg",
    source: "Unsplash",
    sourceUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09",
    creator:
      "Unsplash contributor (creator name not programmatically retrievable from this environment; Unsplash License requires no attribution)",
    license: "Unsplash License (free for commercial website use)",
    note: "Generic licensed visual imagery — not Vishvaas Clinic.",
  },
];
