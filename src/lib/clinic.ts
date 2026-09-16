/**
 * ─────────────────────────────────────────────────────────────────────────────
 * VISHVAAS CLINIC — CENTRAL EDITABLE CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 * Every business fact rendered on the website lives here.
 *
 * EDITING RULES (for the clinic owner / webmaster):
 *  1. Only verified information appears below. Fields marked `null` or `""`
 *     are intentionally blank because the detail has not been confirmed yet.
 *  2. Never add claims (best / leading / world-class), degrees, awards,
 *     years of experience, patient counts, fees or timings here unless they
 *     have been verified with Dr. Himanshu Arora.
 *  3. UI copy (English + Hindi) lives in lib/translations.ts.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const clinic = {
  /** Business identity ---------------------------------------------------- */
  name: "Vishvaas Clinic",
  shortName: "Vishvaas",
  descriptor: "Eye & Dental Care",
  tagline: "Clearer care. Confident choices.",

  /** Front desk — WhatsApp-first ------------------------------------------ */
  whatsappNumber: "917252991991" as const,
  phoneDisplay: "+91 72529 91991",
  phoneHref: "tel:+917252991991",

  /** Verified address ------------------------------------------------------ */
  address: {
    line1: "Vikas Lok, Lane No. 2",
    line2: "Sahastradhara Road",
    city: "Dehradun",
    state: "Uttarakhand",
    postalCode: "248001",
    country: "India",
    get full(): string {
      return `${this.line1}, ${this.line2}, ${this.city}, ${this.state} ${this.postalCode}, ${this.country}`;
    },
    /** Short form for compact UI (utility bar, chips) */
    get short(): string {
      return `Sahastradhara Road, ${this.city}`;
    },
  },

  /**
   * CONFIRMED clinic timings (shown in the Availability section).
   * Display labels are translated in lib/translations.ts; these are the
   * canonical English facts.
   */
  hours: {
    days: "Monday to Saturday",
    time: "9:00 AM – 1:00 PM & 3:00 PM – 7:00 PM",
  } as { days: string; time: string },

  /**
   * Google Maps URLs.
   * NOTE: the query strings intentionally keep the name used on the
   * clinic's actual Google Business Profile listing ("Vishvaas Clinics")
   * so the address lookup resolves correctly. These are functional URLs,
   * not displayed text — the displayed name everywhere is "Vishvaas Clinic".
   */
  maps: {
    search:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(
        "Vishvaas Clinics, Vikas Lok, Lane No. 2, Sahastradhara Road, Dehradun, Uttarakhand 248001"
      ),
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=" +
      encodeURIComponent(
        "Vishvaas Clinics, Vikas Lok, Lane No. 2, Sahastradhara Road, Dehradun, Uttarakhand 248001"
      ),
    embed:
      "https://www.google.com/maps?q=" +
      encodeURIComponent(
        "Vishvaas Clinics, Vikas Lok, Lane No. 2, Sahastradhara Road, Dehradun, Uttarakhand 248001"
      ) +
      "&output=embed",
  },
  doctor: {
    name: "Dr. Himanshu Arora",
    /** Neutral, non-claim descriptor. Replace with a verified designation. */
    role: "Consulting Doctor · Vishvaas Clinic",
    /**
     * NOTE: the two-doctor profiles used by the homepage slider and the
     * appointment popup now live in lib/doctors.ts (single source of truth).
     * This entry is kept for legacy/SEO references only.
     */
    /**
     * PHOTO (Phase 3 approved asset): WebP transcode of the clinic's newly
     * supplied approved portrait. The live doctor profiles (photo, alt,
     * sizes) live in lib/doctors.ts — see rule 2 there.
     */
    photo: "/images/doctors/dr-himanshu-arora-profile.webp" as string | null,
    /** Exact alt text for the portrait (approved Phase 3 alt). */
    photoAlt: "Dr. Himanshu Arora, Consultant Ophthalmologist",
    /** Provenance note for the photo (internal bookkeeping). */
    photoSource:
      "Clinic-supplied approved portrait (Phase 3, non-destructive WebP transcode)",
    /** Editable placeholder fields — to be filled with verified details. */
    profileNote: "Professional profile details to be confirmed",
    approachNote: "Consultation approach and background",
  },

  /**
   * Verified service categories (exactly as provided by the clinic).
   * Descriptions are intentionally short, patient-friendly and claim-free.
   */
  services: [
    {
      slug: "cataract-care",
      icon: "Eye",
      title: "Cataract Care",
      blurb:
        "Consultation and guidance for cataract-related vision concerns, with clear next steps explained by the care team.",
    },
    {
      slug: "glaucoma-care",
      icon: "Stethoscope",
      title: "Glaucoma Care",
      blurb:
        "Early detection, monitoring and medical and surgical management of glaucoma.",
    },
    {
      slug: "comprehensive-eye-examination",
      icon: "ScanEye",
      title: "Comprehensive Eye Examination",
      blurb:
        "A thorough check of your vision and eye health, so small concerns are noticed before they grow.",
    },
    {
      slug: "emergency-eye-care",
      icon: "Siren",
      title: "Emergency Eye Care",
      blurb:
        "Urgent attention for eye injuries or sudden changes in vision. Call the clinic straight away for guidance.",
    },
  ] as Array<{ slug: string; icon: string; title: string; blurb: string }>,

  /**
   * Dental service categories (Phase 2, owner-supplied titles/descriptions —
   * rendered verbatim). CTA opens the appointment popup with the clinic's
   * default doctor pre-selected, per owner instruction.
   */
  dentalServices: [
    {
      slug: "root-canal-treatment",
      icon: "Syringe",
      title: "Root Canal Treatment",
      blurb:
        "Pain-free root canal therapy to save and restore damaged teeth.",
    },
    {
      slug: "dental-implants",
      icon: "Anchor",
      title: "Dental Implants",
      blurb:
        "Permanent, natural-looking tooth replacement with dental implants.",
    },
    {
      slug: "teeth-whitening",
      icon: "Sparkles",
      title: "Teeth Whitening",
      blurb:
        "Professional teeth whitening for a brighter, more confident smile.",
    },
    {
      slug: "dental-veneers",
      icon: "Layers",
      title: "Dental Veneers",
      blurb:
        "Custom veneers to correct chips, gaps, and discoloration.",
    },
    {
      slug: "orthodontic-treatment",
      icon: "AlignCenter",
      title: "Orthodontic Treatment",
      blurb:
        "Modern braces and clear aligners to straighten teeth effectively.",
    },
    {
      slug: "periodontal-care",
      icon: "ShieldPlus",
      title: "Periodontal Care",
      blurb:
        "Treatment and prevention of gum disease for healthy gums and teeth.",
    },
  ] as Array<{ slug: string; icon: string; title: string; blurb: string }>,

  /** Appointment request form options -------------------------------------- */
  form: {
    /**
     * Canonical English values — these are the option VALUES submitted to
     * WhatsApp (stable for the front desk). Display labels per language
     * live in lib/translations.ts → form.serviceOptionLabels.
     */
    serviceOptions: [
      { key: "general", value: "General Eye Consultation" },
      { key: "cataract", value: "Cataract Care" },
      { key: "glaucoma", value: "Glaucoma Care" },
      { key: "exam", value: "Eye Examination" },
      { key: "emergency", value: "Emergency Eye Care" },
      { key: "dentalConsult", value: "Dental Consultation" },
      { key: "dentalGeneral", value: "General Dental Care" },
      { key: "urology", value: "Urology Consultation" },
      { key: "gastro", value: "Gastro Consultation" },
      { key: "other", value: "Other / Not Sure" },
    ] as Array<{
      key:
        | "general"
        | "cataract"
        | "glaucoma"
        | "exam"
        | "emergency"
        | "dentalConsult"
        | "dentalGeneral"
        | "urology"
        | "gastro"
        | "other";
      value: string;
    }>,
    /**
     * Indicative parts of the day only — exact slot times are confirmed by
     * the front desk. Canonical values; labels translated in translations.ts.
     */
    timeOptions: [
      { key: "morning", value: "Morning" },
      { key: "afternoon", value: "Afternoon" },
      { key: "evening", value: "Evening" },
      { key: "any", value: "Any time (front desk will confirm)" },
    ] as Array<{
      key: "morning" | "afternoon" | "evening" | "any";
      value: string;
    }>,
  },

  /** Social media — official URLs supplied by the clinic owner (verified). --- */
  social: {
    instagram: "https://www.instagram.com/vishvaasclinic/?hl=en" as string,
    facebook:
      "https://www.facebook.com/profile.php?id=61593752521643" as string,
    youtube: "" as string,
  },

  /** SEO -------------------------------------------------------------------- */
  seo: {
    /**
     * Production base URL — single source for metadataBase, canonical, OG url,
     * JSON-LD `url` and sitemap.xml.
     * Vercel-ready: set NEXT_PUBLIC_SITE_URL in the Vercel project environment
     * (e.g. "https://www.vishvaasclinics.com", no trailing slash needed) once
     * the final domain is live — no code change required. Until then the
     * placeholder below is used. Never publish a guessed domain.
     */
    canonicalUrl:
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
      "https://www.vishvaasclinics.com",
    title: "Vishvaas Clinic | Eye & Dental Care — Sahastradhara Road, Dehradun",
    description:
      "Vishvaas Clinic, Dehradun offers eye care consultations — cataract care, glaucoma care, comprehensive eye examinations and emergency eye care — along with dental consultations, near Sahastradhara Road. Request an appointment on WhatsApp.",
    ogImage: "/images/clinic/exterior-building.jpg",
  },

  /**
   * Image inventory with source transparency.
   * Clinic photos are client-supplied originals (owner upload, production
   * handover) or clearly-labelled neutral stock. Replace/add only with
   * verified assets.
   */
  images: {
    hero: {
      src: "/images/clinic/exterior-building.jpg",
      alt: "Vishvaas Clinic exterior and signage on Sahastradhara Road in Dehradun",
      caption: "Vishvaas Clinic · Sahastradhara Road, Dehradun",
      source:
        "Clinic owner-supplied photograph of the Vishvaas Clinics building exterior (production handover upload IMG-20260912-WA0008.jpg)",
    },
    /**
     * NOTE: the former `signage` entry (Justdial business-listing photo of
     * the VC wall sign, captioned "Look for the VC sign at the clinic
     * entrance") was removed on clinic instruction together with the two
     * components that displayed it (Why-Choose-Us photo card and the
     * Contact & Location wayfinding figure). Do not re-add third-party
     * business-listing photos.
     */
    /** Neutral, clearly-labelled decorative stock (never presented as the clinic). */
    decorative: {
      slitLamp: {
        src: "/images/decor/slit-lamp-illustrative.jpg",
        alt: "Illustrative photo of a slit lamp microscope used during eye examinations",
        tag: "Illustrative image",
        source: "Neutral stock imagery — decorative use only",
      },
    },
  },
} as const;

export type Clinic = typeof clinic;

/** Convenience: fully formatted one-line address. */
export const fullAddress = clinic.address.full;

/** Site navigation (single-page anchored sections). Labels are translated in lib/translations.ts → nav. */
export const navLinks = [
  { href: "#eye-care", key: "eyeCare" },
  { href: "#dental-care", key: "dentalCare" },
  { href: "#why-us", key: "whyUs" },
  { href: "#doctor", key: "doctor" },
  { href: "#testimonials", key: "testimonials" },
  { href: "#contact", key: "contact" },
] as const;

export type NavLinkKey = (typeof navLinks)[number]["key"];
