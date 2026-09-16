/**
 * ─────────────────────────────────────────────────────────────────────────────
 * VISHVAAS CLINIC — CENTRAL DOCTOR CONFIGURATION (single source of truth)
 * ─────────────────────────────────────────────────────────────────────────────
 * Four doctors live here (Phase 3): two core doctors and two visiting
 * specialists. The homepage "Meet the Doctors" section, the appointment
 * popup (doctor panel, filtered service dropdown, switcher) and the
 * pre-filled WhatsApp request ALL read from this file — so every surface
 * can never show one doctor's photo with another doctor's name.
 *
 * EDITING RULES (for the clinic owner / webmaster):
 *  1. Never invent qualifications, degrees, memberships, experience years,
 *     awards or medical claims. Every credential below was supplied and
 *     approved verbatim in the clinic's Phase 3 brief — edit only with
 *     owner-verified facts.
 *  2. PHOTOGRAPHS — Phase 3 approved assets. The four portraits in
 *     /public/images/doctors/ are transcoded (PNG → WebP q88) from the
 *     clinic's four newly supplied, approved real doctor photographs
 *     (upload/dr-*.jpg.png). Original pixels preserved: no crop, no resize,
 *     no retouch, no AI generation — display framing is done purely with
 *     CSS object-position (face-safe, see doctorImageSize notes). They are
 *     used ONLY in doctor-specific contexts (Meet the Doctors cards,
 *     appointment popup panel + switcher, launcher card chips) and must
 *     NEVER appear in the generic service hero slides. Alt text per the
 *     approved Phase 3 spec.
 *  3. `serviceOptions` and `whatsappLabel` are canonical English values —
 *     they are submitted to WhatsApp so the front desk always receives
 *     stable values. Display labels per language live in lib/translations.ts.
 *  4. If a doctor's final name changes, update `name`/`displayName` here and
 *     every consumer (cards, popup, WhatsApp message) follows automatically.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type DoctorGroup = "core" | "visiting";

export type DoctorDepartment =
  | "Eye Care"
  | "Dental Care"
  | "Urology"
  | "Gastroenterology";

export type DoctorId =
  | "himanshu-arora"
  | "shruti-beri-arora"
  | "shalabh-aggarwal"
  | "akshay-rawat";

export type ClinicDoctor = {
  id: DoctorId;
  name: string;
  displayName: string;
  department: DoctorDepartment;
  /** "core" renders under Core Doctors, "visiting" under Visiting Specialists. */
  group: DoctorGroup;
  /** Canonical English role (translated rendering lives in translations.ts). */
  role: string;
  /** Optional second clinical-focus line (approved for Dr. Himanshu Arora). */
  focus?: string;
  /**
   * Degree line(s) — language-neutral (abbreviations and institution names
   * are not translated). A single string renders as one credential row; an
   * array renders one compact credential row per entry (owner-approved
   * format for Dr. Shruti Beri Arora).
   */
  qualifications: string | string[];
  /**
   * Previous hospital associations (owner-supplied, verbatim). Rendered as a
   * subtly labelled list on the doctor card — currently Dr. Shruti Beri
   * Arora only. Never add an entry without owner-verified facts.
   */
  exConsultant?: string[];
  /** Optional fellowship line (translated rendering lives in translations.ts). */
  credentialLine?: string;
  /** Council registration identifier WITHOUT the "Reg. No." prefix. */
  registration?: string;
  /** Named clinic line (approved for Dr. Akshay Rawat). */
  clinic?: string;
  /**
   * Public photo path under /public — the clinic's approved Phase 3 portrait
   * (WebP transcode of the owner-supplied original; see rule 2).
   */
  image: string;
  /** Accessible name for the portrait (approved Phase 3 alt text). */
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
    group: "core",
    role: "Consultant Ophthalmologist",
    focus: "Phaco-Cataract & Glaucoma Consultant",
    qualifications: "MBBS, D.O., DNB",
    credentialLine: "Long-term Anterior Segment Fellowship",
    registration: "UKMC 7532",
    image: "/images/doctors/dr-himanshu-arora-profile.webp",
    alt: "Dr. Himanshu Arora, Consultant Ophthalmologist",
    serviceOptions: [
      "General Eye Consultation",
      "Cataract Care",
      "Glaucoma Care",
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
    group: "core",
    role: "Consultant Dental Surgeon & Periodontist",
    qualifications: [
      "B.D.S. — Manipal",
      "M.D.S. — Government Dental College, Chennai",
    ],
    exConsultant: [
      "Guru Teg Bahadur Hospital, Dehradun",
      "Apollo Speciality Hospital, Trichy, Tamil Nadu",
      "Noble Medical & Dental College, Nepal",
    ],
    image: "/images/doctors/dr-shruti-beri-arora-profile.webp",
    alt: "Dr. Shruti Beri Arora, Consultant Dental Surgeon and Periodontist",
    serviceOptions: [
      "Dental Consultation",
      "General Dental Care",
      "Other / Not Sure",
    ],
    whatsappLabel: "Dental Care",
  },
  {
    id: "shalabh-aggarwal",
    name: "Dr. Shalabh Aggarwal",
    displayName: "Dr. Shalabh Aggarwal",
    department: "Urology",
    group: "visiting",
    role: "Urologist & Kidney Transplant Surgeon",
    qualifications: "MBBS, MS (General Surgery), DrNB (Urology)",
    image: "/images/doctors/dr-shalabh-aggarwal-profile.webp",
    alt: "Dr. Shalabh Aggarwal, Urologist and Kidney Transplant Surgeon",
    serviceOptions: ["Urology Consultation", "Other / Not Sure"],
    whatsappLabel: "Urology",
  },
  {
    id: "akshay-rawat",
    name: "Dr. Akshay Rawat",
    displayName: "Dr. Akshay Rawat",
    department: "Gastroenterology",
    group: "visiting",
    role: "Gastroenterologist, Hepatologist & Endoscopist",
    qualifications: "MBBS, DNB (Medicine), DrNB (Gastroenterology)",
    registration: "4355",
    clinic: "Gastro-Liver Clinic",
    image: "/images/doctors/dr-akshay-rawat-profile.webp",
    alt: "Dr. Akshay Rawat, Gastroenterologist, Hepatologist and Endoscopist",
    serviceOptions: ["Gastro Consultation", "Other / Not Sure"],
    whatsappLabel: "Gastroenterology",
  },
];

export const CORE_DOCTORS = clinicDoctors.filter((d) => d.group === "core");

export const VISITING_DOCTORS = clinicDoctors.filter(
  (d) => d.group === "visiting"
);

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
export const doctorIdByDepartment: Record<"Eye Care" | "Dental Care", DoctorId> =
  {
    "Eye Care": "himanshu-arora",
    "Dental Care": "shruti-beri-arora",
  };

/**
 * Monogram initials — kept only as an internal fallback identifier; every
 * doctor surface renders the approved Phase 3 photograph.
 */
export const doctorMonogram: Record<DoctorId, string> = {
  "himanshu-arora": "HA",
  "shruti-beri-arora": "SB",
  "shalabh-aggarwal": "SA",
  "akshay-rawat": "AR",
};

/**
 * Intrinsic pixel sizes of the approved Phase 3 portraits (original supplied
 * dimensions preserved exactly — for next/image stability, no CLS). All four
 * share near-identical framing: face in the upper-centre of frame, so a
 * uniform face-safe object-position (≈ 50% 20%) works across every surface.
 */
export const doctorImageSize: Record<
  DoctorId,
  { width: number; height: number }
> = {
  "himanshu-arora": { width: 1086, height: 1448 },
  "shruti-beri-arora": { width: 1086, height: 1448 },
  "shalabh-aggarwal": { width: 1086, height: 1448 },
  "akshay-rawat": { width: 1145, height: 1374 },
};

/**
 * Translatable per-doctor copy (role/focus/hours renderings). Canonical
 * English facts stay in `clinicDoctors`; this is the UI layer.
 */
export type DoctorText = {
  /** Translated role line, e.g. "Consultant Ophthalmologist". */
  role: string;
  /** Translated clinical-focus line (Dr. Himanshu Arora only). */
  focus?: string;
  /** Translated fellowship line (Dr. Himanshu Arora only). */
  credentialLine?: string;
  /** Translated consulting-hours string (visiting specialists). */
  hours?: string;
  /** Translated Saturday-availability string (visiting specialists). */
  saturday?: string;
};
