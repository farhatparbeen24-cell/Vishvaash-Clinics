/**
 * ─────────────────────────────────────────────────────────────────────────────
 * VISHVAAS CLINIC — CENTRAL DOCTOR CONFIGURATION (single source of truth)
 * ─────────────────────────────────────────────────────────────────────────────
 * Both consulting doctors live here. The homepage doctor slider, the
 * appointment popup (doctor panel, filtered service dropdown) and the
 * pre-filled WhatsApp request ALL read from this file — so the slider and the
 * popup can never show one doctor's photo with another doctor's name.
 *
 * EDITING RULES (for the clinic owner / webmaster):
 *  1. Never invent qualifications, degrees, memberships, experience years,
 *     awards or medical claims. `specialty` strings below were supplied with
 *     the clinic's brief and remain CONFIRMATION-PENDING before final go-live
 *     (see FINAL VERIFICATION note at the bottom of this file).
 *  2. PHOTOGRAPHS — RESTORED (owner-verified). The two portraits in
 *     /public/images/doctors/ are the clinic's original uploaded doctor files
 *     (byte-identical, unaltered, original aspect ratio preserved), restored
 *     by explicit owner instruction and used ONLY in doctor-specific contexts
 *     (Meet Our Doctors slider, appointment popup panel + switcher, launcher
 *     card chips). They must NEVER appear in the generic service hero slides.
 *     Alts are exactly "Dr. Himanshu Arora, Eye Care" / "Dr. Shruti Beri
 *     Arora, Dental Care". No qualification/degree text is transcribed from
 *     the photos into site copy.
 *  3. `serviceOptions` and `whatsappLabel` are canonical English values —
 *     they are submitted to WhatsApp so the front desk always receives
 *     stable values. Display labels per language live in lib/translations.ts.
 *  4. If a doctor's final name changes, update `name`/`displayName` here and
 *     every consumer (slider, popup, WhatsApp message) follows automatically.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type DoctorDepartment = "Eye Care" | "Dental Care";

export type DoctorId = "himanshu-arora" | "shruti-beri-arora";

export type ClinicDoctor = {
  id: DoctorId;
  name: string;
  displayName: string;
  department: DoctorDepartment;
  specialty: string;
  shortDescription: string;
  /**
   * Public photo path under /public — the clinic's original verified uploaded
   * portrait (owner-confirmed). Consumers render it with face-safe,
   * aspect-ratio-stable object-cover (see doctorImageSize below).
   */
  image: string;
  /** Accessible name for the portrait, e.g. "Dr. Himanshu Arora, Eye Care". */
  alt: string;
  serviceOptions: string[];
  whatsappLabel: string;
};

export const clinicDoctors: ClinicDoctor[] = [
  {
    id: "himanshu-arora",
    name: "Dr. Himanshu Arora",
    displayName: "Dr. Himanshu Arora",
    department: "Eye Care",
    specialty: "Consultant Ophthalmologist",
    shortDescription:
      "Eye-care consultations and cataract-focused support at Vishvaas Clinic.",
    image: "/images/doctors/dr-himanshu-arora.jpg",
    alt: "Dr. Himanshu Arora, Eye Care",
    serviceOptions: [
      "General Eye Consultation",
      "Cataract Care",
      "Dry Eye Care",
      "Eye Examination",
      "Emergency Eye Care",
    ],
    whatsappLabel: "Eye Care",
  },
  {
    id: "shruti-beri-arora",
    name: "Dr. Shruti Beri Arora",
    displayName: "Dr. Shruti Beri Arora",
    department: "Dental Care",
    specialty: "Consultant Dental Surgeon",
    shortDescription:
      "Dental consultation and patient-focused dental-care support at Vishvaas Clinic.",
    image: "/images/doctors/dr-shruti-beri-arora.jpg",
    alt: "Dr. Shruti Beri Arora, Dental Care",
    serviceOptions: [
      "Dental Consultation",
      "General Dental Care",
      "Other / Not Sure",
    ],
    whatsappLabel: "Dental Care",
  },
];

export const DEFAULT_DOCTOR_ID: DoctorId = "himanshu-arora";

/** Safe lookup — unknown/missing ids always resolve to the default doctor. */
export function getDoctor(id: string | null | undefined): ClinicDoctor {
  return (
    clinicDoctors.find((d) => d.id === id) ??
    (clinicDoctors.find((d) => d.id === DEFAULT_DOCTOR_ID) as ClinicDoctor)
  );
}

export function isDoctorId(id: string | null | undefined): id is DoctorId {
  return clinicDoctors.some((d) => d.id === id);
}

/** Department → doctor id (for section CTAs that imply a department). */
export const doctorIdByDepartment: Record<DoctorDepartment, DoctorId> = {
  "Eye Care": "himanshu-arora",
  "Dental Care": "shruti-beri-arora",
};

/**
 * Monogram initials — kept only as an internal fallback identifier; every
 * doctor surface renders the restored owner-verified photograph.
 */
export const doctorMonogram: Record<DoctorId, string> = {
  "himanshu-arora": "HA",
  "shruti-beri-arora": "SB",
};

/**
 * Intrinsic pixel sizes of the restored portraits (original uploaded files,
 * original aspect ratio preserved — for next/image stability, no CLS).
 */
export const doctorImageSize: Record<
  DoctorId,
  { width: number; height: number }
> = {
  "himanshu-arora": { width: 575, height: 691 },
  "shruti-beri-arora": { width: 586, height: 689 },
};

/**
 * Translatable per-doctor copy (specialty rendering, description, CTA label).
 * Canonical English facts stay in `clinicDoctors`; this is the UI layer.
 */
export type DoctorText = {
  specialty: string;
  shortDescription: string;
  cta: string;
};

/**
 * FINAL VERIFICATION NOTE (go-live):
 * "Consultant Ophthalmologist" / "Consultant Dental Surgeon" were provided in
 * the clinic's brief but should be re-confirmed by the clinic before launch.
 * They are plain editable strings above — update them here and the slider,
 * popup and page copy update everywhere at once. No degrees, memberships or
 * years of experience are published anywhere on the site.
 */
