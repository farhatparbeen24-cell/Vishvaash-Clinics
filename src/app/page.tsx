import { UtilityBar } from "@/components/layout/UtilityBar";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { DentalCare } from "@/components/home/DentalCare";
import { TrustSection } from "@/components/home/TrustSection";
import { DoctorSlider } from "@/components/home/DoctorSlider";
import { BrandsWeUse } from "@/components/home/BrandsWeUse";
import { ClinicGallery } from "@/components/home/ClinicGallery";
import { Testimonials } from "@/components/home/Testimonials";
import { AppointmentCTA } from "@/components/home/AppointmentCTA";
import { ContactLocation } from "@/components/contact/ContactLocation";
import { Availability } from "@/components/home/Availability";

/**
 * Vishvaas Clinic – Eye & Dental Care
 * Single-page experience: all sections are route-ready components under
 * components/home, components/appointment and components/contact.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col pb-[60px] md:pb-0">
      <UtilityBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <DentalCare />
        <TrustSection />
        <DoctorSlider />
        <BrandsWeUse />
        <ClinicGallery />
        <Testimonials />
        <AppointmentCTA />
        <ContactLocation />
        <Availability />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
