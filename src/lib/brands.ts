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
 * HOW TO ADD AN APPROVED LOGO LATER
 *  1. Save the official file, e.g. /public/images/brands/zeiss.png.
 *  2. Set { name: "ZEISS", logo: "/images/brands/zeiss.png", approved: true }.
 *  3. In BrandsWeUse.tsx, extend the item renderer to draw the image with
 *     next/image (fixed optical height, width/height set, object-contain).
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
      { name: "ZEISS", logo: null, approved: false },
      { name: "Alcon", logo: null, approved: false },
      { name: "HOYA", logo: null, approved: false },
      { name: "Appasamy", logo: null, approved: false },
      { name: "Biotech", logo: null, approved: false },
      { name: "Care", logo: null, approved: false },
      { name: "Johnson & Johnson", logo: null, approved: false },
    ],
  },
  {
    id: "equipment",
    label: {
      en: "Equipment",
      hi: "उपकरण",
    },
    brands: [
      { name: "Oertli", logo: null, approved: false },
      { name: "Topcon", logo: null, approved: false },
      { name: "Axialis", logo: null, approved: false },
      { name: "Keeler", logo: null, approved: false },
      { name: "Labomed", logo: null, approved: false },
    ],
  },
  {
    id: "pharmaceuticals",
    label: {
      en: "Pharmaceuticals",
      hi: "फार्मास्यूटिकल्स",
    },
    brands: [
      { name: "Sun Pharma", logo: null, approved: false },
      { name: "Lupin", logo: null, approved: false },
      { name: "Alembic", logo: null, approved: false },
      { name: "Alkem", logo: null, approved: false },
      { name: "Zydus", logo: null, approved: false },
      { name: "Headway", logo: null, approved: false },
      { name: "Vibgyor", logo: null, approved: false },
      { name: "Neomedix", logo: null, approved: false },
      { name: "Raymed", logo: null, approved: false },
    ],
  },
];

/** Total number of listed brands (QA helper — not rendered anywhere). */
export const brandCount = brandGroups.reduce(
  (sum, group) => sum + group.brands.length,
  0
);
