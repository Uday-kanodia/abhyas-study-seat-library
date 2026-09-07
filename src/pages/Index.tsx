import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import GallerySection from "@/components/GallerySection";
import SeatAvailability from "@/components/SeatAvailability";
import SeatMapSection from "@/components/SeatMapSection";

import PricingSection from "@/components/PricingSection";
import RulesSection from "@/components/RulesSection";
import InquiryForm from "@/components/InquiryForm";
import MembershipSection from "@/components/MembershipSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FacilitiesSection />
      <GallerySection />
      <SeatAvailability />
      <SeatMapSection />

      <PricingSection />
      <RulesSection />
      <InquiryForm />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
