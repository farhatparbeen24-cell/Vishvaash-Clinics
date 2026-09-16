/**
 * ─────────────────────────────────────────────────────────────────────────────
 * INSIDE VISHVAAS CLINIC — GALLERY CONFIGURATION (client-supplied photos)
 * ─────────────────────────────────────────────────────────────────────────────
 * Every file below is a photograph supplied DIRECTLY by the clinic owner in
 * the production-handover upload (WhatsApp batch IMG-20260912-WA0xxx.jpg),
 * recompressed only (max width 1200px, JPEG q82) — no content alteration, no
 * retouching, no AI processing.
 *
 * PUBLICATION RULES (production brief):
 *  • Only owner-supplied Vishvaas Clinic photos belong here — never generic
 *    stock, never another clinic's interiors, never reference screenshots.
 *  • Alt text describes only what is verifiably visible; no room/device
 *    claims that are not confirmed.
 *  • No patient faces are published. Two photos show clinic staff at the
 *    reception (owner-supplied for this gallery) — flag for the owner to
 *    confirm staff consent before go-live.
 *  • Excluded from publication (kept in /upload, quarantined where needed):
 *    - IMG-20260912-WA0009.jpg — patient face visible + only 347px wide
 *      (patient-privacy concern / poor quality)
 *    - IMG-20260912-WA0012.jpg — only 238px wide (poor quality)
 *    - IMG-20260912-WA0027.jpg — baked-in decorative frame + camera date
 *      stamp (unsuitable crop for a clean editorial grid)
 *    - file_*.png design mockups + a screenshot of another clinic's website
 *      — AI-generated / reference-only (quarantined in
 *      assets-excluded/reference-only/)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type GalleryImage = {
  id: string;
  /** Local asset under /public. */
  src: string;
  /** Intrinsic pixel dimensions (for stable layout / next/image). */
  width: number;
  height: number;
  /** Bilingual descriptive alt — verifiable visible content only. */
  alt: { en: string; hi: string };
  /** Provenance row for the clinic's records. */
  source: {
    originalUpload: string;
    note: string;
  };
};

export const galleryImages: GalleryImage[] = [
  {
    id: "reception",
    src: "/images/gallery/gallery-reception.jpg",
    width: 1048,
    height: 786,
    alt: {
      en: "Reception area at Vishvaas Clinic",
      hi: "विश्वास क्लिनिक का रिसेप्शन क्षेत्र",
    },
    source: {
      originalUpload: "IMG-20260912-WA0022.jpg",
      note: "Clinic owner-supplied photo — reception desk with clinic team",
    },
  },
  {
    id: "clinic-team",
    src: "/images/gallery/gallery-clinic-team.jpg",
    width: 1007,
    height: 756,
    alt: {
      en: "Clinic team at the Vishvaas Clinic reception",
      hi: "विश्वास क्लिनिक रिसेप्शन पर क्लिनिक टीम",
    },
    source: {
      originalUpload: "IMG-20260912-WA0023.jpg",
      note: "Clinic owner-supplied photo — team at the reception",
    },
  },
  {
    id: "exterior",
    src: "/images/gallery/gallery-exterior.jpg",
    width: 1192,
    height: 848,
    alt: {
      en: "Vishvaas Clinic building exterior in Dehradun",
      hi: "देहरादून में विश्वास क्लिनिक की बिल्डिंग",
    },
    source: {
      originalUpload: "IMG-20260912-WA0008.jpg",
      note: "Clinic owner-supplied photo — building exterior with clinic signage",
    },
  },
  {
    id: "consultation-room",
    src: "/images/gallery/gallery-consultation-room.jpg",
    width: 342,
    height: 427,
    alt: {
      en: "Consultation room with workspace at Vishvaas Clinic",
      hi: "विश्वास क्लिनिक का परामर्श कक्ष",
    },
    source: {
      originalUpload: "IMG-20260912-WA0010.jpg",
      note: "Clinic owner-supplied photo — consultation room (no faces)",
    },
  },
  {
    id: "optical-counter",
    src: "/images/gallery/gallery-optical-counter.jpg",
    width: 453,
    height: 257,
    alt: {
      en: "Optical dispensing counter with eyewear display at Vishvaas Clinic",
      hi: "विश्वास क्लिनिक में चश्मे की डिस्प्ले वाली ऑप्टिकल काउंटर",
    },
    source: {
      originalUpload: "IMG-20260912-WA0011.jpg",
      note: "Clinic owner-supplied photo — optical dispensing counter (no faces)",
    },
  },
  {
    id: "waiting-area",
    src: "/images/gallery/gallery-waiting-area.jpg",
    width: 447,
    height: 362,
    alt: {
      en: "Waiting area at Vishvaas Clinic",
      hi: "विश्वास क्लिनिक का प्रतीक्षा क्षेत्र",
    },
    source: {
      originalUpload: "IMG-20260912-WA0013.jpg",
      note: "Clinic owner-supplied photo — waiting/lobby area (no faces)",
    },
  },
  {
    id: "consultation-room-2",
    src: "/images/gallery/gallery-consultation-room-2.jpg",
    width: 670,
    height: 503,
    alt: {
      en: "Consultation room with seating for patients at Vishvaas Clinic",
      hi: "विश्वास क्लिनिक का परामर्श कक्ष — मरीज़ों के लिए बैठने की व्यवस्था",
    },
    source: {
      originalUpload: "IMG-20260912-WA0025.jpg",
      note: "Clinic owner-supplied photo — second consultation room (no faces)",
    },
  },
];
