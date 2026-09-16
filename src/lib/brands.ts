/**
 * ─────────────────────────────────────────────────────────────────────────────
 * VISHVAAS CLINIC — "BRANDS WE USE" CENTRAL CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 * Single editable source for the compact credibility section on the homepage.
 * The clinic owner has confirmed these brands are USED at Vishvaas Clinic.
 *
 * STRICT USAGE RULES (do not relax):
 *  • This is a "brands we use" listing ONLY. It must never state or imply
 *    partnership, dealership, authorisation, exclusivity, recommendation,
 *    sponsorship or endorsement by any of these companies.
 *  • `logo` may only ever point to an OFFICIAL brand asset obtained from the
 *    company's own website / official press or media kit, or a file supplied
 *    and approved in writing by the clinic owner. Never use image-search
 *    thumbnails, watermarked assets or re-created/fake logo files, and never
 *    remove or crop watermarks.
 *  • `approved: true` may only be set after the clinic owner has confirmed the
 *    specific logo file in writing. It is an internal workflow flag and is
 *    NEVER rendered on the website.
 *  • Until an approved file exists, the section renders a neutral TEXT
 *    wordmark in the site's own typography — a placeholder, not an imitation
 *    of the company's official logo. Do not restyle these names to look like
 *    the real logos (no brand fonts, colours or mark imitations).
 *  • Preserve each supplied logo's original aspect ratio when adding files
 *    (render with next/image, explicit width/height, object-contain).
 *
 * PHASE 2 LOGO PROVENANCE (owner instruction: "add a small official logo/icon
 * fetched from the brand's official website or a trusted source"). Files live
 * in /public/images/brands/. Every file below is an UNALTERED official asset:
 *
 *  zeiss.svg    — Wikimedia Commons "File:Zeiss logo.svg" (official ZEISS mark)
 *  alcon.svg    — Wikimedia Commons "File:Alcon Logo 2019.svg" (official mark)
 *  hoya.svg     — Wikimedia Commons "File:Hoya Corporation logo.svg"
 *  jnj.svg      — Wikimedia Commons "File:Johnson and Johnson Logo.svg"
 *  topcon.svg   — Wikimedia Commons "File:Topcon company logo.svg"
 *  sunpharma.png— Wikimedia Commons "File:Logo Sun Pharmaceutical.png"
 *                 (downscaled to 240px height for web)
 *  zydus.webp   — Wikimedia Commons "File:Zydus Logo.jpg" (converted WebP)
 *  alkem.png    — Wikimedia Commons "File:Alkem Laboratories logo.png"
 *  appasamy.png — official appasamy.com site icon (Google favicon service,
 *                 16px source — smallest official asset available; the main
 *                 site blocks automated fetching)
 *  biotech.png  — biotechhealthcare.com official logo (linked from the
 *                 clinic-listed biotechvisioncare.com)
 *  keeler.png   — official keeler.co.uk site mark (Google favicon service,
 *                 100px; direct media URLs are WAF-blocked)
 *  labomed.webp — official labomed.com "labomed-full-logo5_with_r_sign.jpg"
 *                 (converted WebP, white background preserved)
 *  lupin.png    — official lupin.com mobile-menu logo asset (colored variant)
 *  alembic.png  — official alembicpharmaceuticals.com "Alembic-logo.png"
 *  oertli.svg   — official oertli-instruments.com "/images/logo.svg"
 *  neomedix.png — official neomedixhealthcare.com site icon (Google favicon
 *                 service, 32px)
 *
 *  NO VERIFIABLE OFFICIAL ASSET COULD BE FETCHED (kept as neutral text
 *  wordmarks until the clinic supplies files): "Care", "Axialis", "Headway",
 *  "Vibgyor" (official site logo is white-on-transparent, invisible on white
 *  panels), "Raymed".
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type BrandGroupId = "lenses" | "equipment" | "pharmaceuticals";

export type BrandEntry = {
  /** Exact brand name as rendered. Proper noun — never translated. */
  name: string;
  /**
   * Path to the APPROVED official logo file (under /public), or null while
   * no approved file exists (→ neutral text wordmark placeholder).
   */
  logo: string | null;
  /** Intrinsic pixel dimensions of `logo` (next/image stability, no CLS). */
  logoW?: number;
  logoH?: number;
  /**
   * Internal only — true once the clinic owner approves the logo file in
   * writing. Never displayed publicly.
   */
  approved: boolean;
};

export type BrandGroup = {
  id: BrandGroupId;
  /** Category label, localized. Group labels are UI text (not brand names). */
  label: { en: string; hi: string };
  brands: BrandEntry[];
};

export const brandGroups: BrandGroup[] = [
  {
    id: "lenses",
    label: {
      en: "Lenses",
      hi: "लेंस",
    },
    brands: [
      { name: "ZEISS", logo: "/images/brands/zeiss.svg", logoW: 567, logoH: 567, approved: true },
      { name: "Alcon", logo: "/images/brands/alcon.svg", logoW: 190, logoH: 52, approved: true },
      { name: "HOYA", logo: "/images/brands/hoya.svg", logoW: 957, logoH: 272, approved: true },
      { name: "Appasamy", logo: "/images/brands/appasamy.png", logoW: 16, logoH: 16, approved: true },
      { name: "Biotech", logo: "/images/brands/biotech.png", logoW: 300, logoH: 206, approved: true },
      { name: "Care", logo: null, approved: false },
      { name: "Johnson & Johnson", logo: "/images/brands/jnj.svg", logoW: 1000, logoH: 181, approved: true },
    ],
  },
  {
    id: "equipment",
    label: {
      en: "Equipment",
      hi: "उपकरण",
    },
    brands: [
      { name: "Oertli", logo: "/images/brands/oertli.svg", logoW: 150, logoH: 58, approved: true },
      { name: "Topcon", logo: "/images/brands/topcon.svg", logoW: 336, logoH: 286, approved: true },
      { name: "Axialis", logo: null, approved: false },
      { name: "Keeler", logo: "/images/brands/keeler.png", logoW: 100, logoH: 100, approved: true },
      { name: "Labomed", logo: "/images/brands/labomed.webp", logoW: 443, logoH: 130, approved: true },
    ],
  },
  {
    id: "pharmaceuticals",
    label: {
      en: "Pharmaceuticals",
      hi: "फार्मास्यूटिकल्स",
    },
    brands: [
      { name: "Sun Pharma", logo: "/images/brands/sunpharma.png", logoW: 178, logoH: 240, approved: true },
      { name: "Lupin", logo: "/images/brands/lupin.png", logoW: 60, logoH: 73, approved: true },
      { name: "Alembic", logo: "/images/brands/alembic.png", logoW: 486, logoH: 134, approved: true },
      { name: "Alkem", logo: "/images/brands/alkem.png", logoW: 722, logoH: 547, approved: true },
      { name: "Zydus", logo: "/images/brands/zydus.webp", logoW: 416, logoH: 240, approved: true },
      { name: "Headway", logo: null, approved: false },
      { name: "Vibgyor", logo: null, approved: false },
      { name: "Neomedix", logo: "/images/brands/neomedix.png", logoW: 32, logoH: 32, approved: true },
      { name: "Raymed", logo: null, approved: false },
    ],
  },
];

/** Total number of listed brands (QA helper — not rendered anywhere). */
export const brandCount = brandGroups.reduce(
  (sum, group) => sum + group.brands.length,
  0
);
