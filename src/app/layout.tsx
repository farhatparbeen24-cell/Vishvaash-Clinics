import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { clinic } from "@/lib/clinic";
import { LanguageProvider } from "@/components/language/LanguageProvider";
import { AppointmentProvider } from "@/components/appointment/AppointmentProvider";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

/** Devanagari font for the हिंदी interface (activated via body.lang-hi). */
const notoDevanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(clinic.seo.canonicalUrl),
  title: clinic.seo.title,
  description: clinic.seo.description,
  alternates: {
    canonical: clinic.seo.canonicalUrl,
  },
  openGraph: {
    title: clinic.seo.title,
    description: clinic.seo.description,
    url: clinic.seo.canonicalUrl,
    siteName: `${clinic.name} – ${clinic.descriptor}`,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: clinic.seo.ogImage,
        width: 1192,
        height: 848,
        alt: clinic.images.hero.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: clinic.seo.title,
    description: clinic.seo.description,
    images: [clinic.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b2b40",
  width: "device-width",
  initialScale: 1,
  // On-screen keyboards resize the layout viewport (not just the visual
  // viewport), so the mobile appointment bottom-sheet — its pinned submit
  // bar and the focused field — always stay above the keyboard. Desktop
  // and browsers without support ignore it.
  interactiveWidget: "resizes-content",
};

/**
 * LocalBusiness / MedicalClinic JSON-LD — verified data only:
 * name, address, telephone and the two verified care departments.
 * No ratings, credentials or hours are claimed.
 */
const clinicJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: clinic.name,
  alternateName: `${clinic.name} – ${clinic.descriptor}`,
  medicalSpecialty: ["Ophthalmologic", "Dentistry"],
  availableService: clinic.services.map((s) => ({
    "@type": "MedicalProcedure",
    name: s.title,
  })),
  telephone: clinic.phoneDisplay,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${clinic.address.line1}, ${clinic.address.line2}`,
    addressLocality: clinic.address.city,
    addressRegion: clinic.address.state,
    postalCode: clinic.address.postalCode,
    addressCountry: "IN",
  },
  url: clinic.seo.canonicalUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${manrope.variable} ${notoDevanagari.variable} antialiased bg-offwhite text-ink`}
      >
        <LanguageProvider>
          <AppointmentProvider>{children}</AppointmentProvider>
        </LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd) }}
        />
      </body>
    </html>
  );
}
