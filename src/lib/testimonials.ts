/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PATIENT TESTIMONIALS — CENTRAL EDITABLE DATA
 * ─────────────────────────────────────────────────────────────────────────────
 * INTERNAL CONTENT NOTE (never rendered on the website):
 *   "Verify every testimonial against the original public review and obtain
 *    clinic approval before publishing it live."
 *
 * PROVENANCE
 *   The four reviews below were supplied by the clinic owner as VERIFIED
 *   extracts from publicly visible Google review screenshots of the
 *   clinic's own Google Business Profile, and approved for publication in
 *   the same instruction — hence status "approved".
 *
 * EDITING RULES
 *   • Review text is stored EXACTLY as written by the patient — original
 *     wording, punctuation, spacing and emoji are preserved verbatim.
 *     Never rewrite, summarise, correct grammar or shorten a quote.
 *     Quotes are also NEVER translated (see components/home/Testimonials).
 *   • The two dental reviews refer to Vishvaas Clinic / Dr. Shruti — they
 *     must never be attributed to Dr. Himanshu Arora.
 *   • Statements inside quotes (e.g. "pricing is also very reasonable")
 *     stay inside the quote only — never reuse them as site claims.
 *   • Add a new review only with: exact text, visible reviewer name,
 *     visible rating, visible date and category.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type TestimonialStatus = "draft" | "awaiting-client-approval" | "approved";

export type Testimonial = {
  reviewer: string;
  rating: number;
  /** Date exactly as shown on the original review (translation keys map these). */
  date: string;
  /** Canonical English category — the UI maps it to the translated pill. */
  category: "Cataract Surgery" | "Dental Care";
  doctor: string;
  quote: string;
  source: string;
  status: TestimonialStatus;
};

/**
 * "Read more reviews" CTA target — the clinic's own verified Google
 * Business Profile (name, address and phone matched during research).
 */
export const testimonialSection = {
  reviewsUrl: "https://maps.google.com/?cid=12847042682835370064",
  reviewsSourceName: "Google Maps",
} as const;

export const testimonials: Testimonial[] = [
  {
    reviewer: "VICKY SINGH",
    rating: 5,
    date: "4 months ago",
    category: "Cataract Surgery",
    doctor: "Dr. Himanshu Arora",
    quote:
      "My father's(Shri Bhagwan Singh) eye cataract surgery was performed by Dr. Himanshu Arora, and the outcome has been excellent. He treats patients very well and explains everything clearly.",
    source: "Google Review",
    status: "approved",
  },
  {
    reviewer: "Arjita Kothiyal",
    rating: 5,
    date: "4 months ago",
    category: "Cataract Surgery",
    doctor: "Dr. Himanshu Arora",
    quote:
      "Dr Himanshu Arora treated 'High myopia' with \"toric lens correction\".writing this review after a month no issues ,eye vision is clear 😁 .The cataract surgery went great 👍",
    source: "Google Review",
    status: "approved",
  },
  {
    reviewer: "Monica Sindhwani",
    rating: 5,
    date: "a year ago",
    category: "Dental Care",
    doctor: "Dr. Shruti",
    quote:
      "We go to Vishvaas Clinic for our dental treatment. Shruti is a very efficient and soft spoken Dr. She handles her patients with care and explains the problems very patiently, she's in no hurry. The staff is also well mannered. We are very happy with the treatment we get there.",
    source: "Google Review",
    status: "approved",
  },
  {
    reviewer: "Manish Mehra",
    rating: 5,
    date: "a year ago",
    category: "Dental Care",
    doctor: "Dr. Shruti Beri",
    quote:
      "My family and I have been going to Vishvaas Clinics for dental treatment for over a year. Dr. Shruti Beri and her team are extremely professional and capable and I have had a very good experience at their hands. And to top it all the pricing is also very reasonable. I highly recommend them for anyone in need of a good dentist.",
    source: "Google Review",
    status: "approved",
  },
];

/**
 * The ONLY list the website renders — reviews whose status is "approved".
 * (Only clinic-approved reviews may appear; new entries start as
 * "awaiting-client-approval" and are hidden until approved.)
 */
export const approvedTestimonials: Testimonial[] = testimonials.filter(
  (t) => t.status === "approved"
);
