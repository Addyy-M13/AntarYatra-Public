import { StructuredData } from "@/components/structured-data"
import { Header } from "@/components/ui/header-2"
import { Component as HorizonHeroSection } from "@/components/ui/horizon-hero-section"
import { StrugglesSection } from "@/components/struggles-section"
import { TransformationSection } from "@/components/transformation-section"
import { GlassHowItWorksCard } from "@/components/ui/glass-how-it-works-card"
import { FeaturesSection } from "@/components/features-section"
import { FAQSection } from "@/components/faq-section"
import { FinalCTASection } from "@/components/final-cta-section"
import { Footer } from "@/components/footer"
import { CookieConsent } from "@/components/cookie-consent"
import { Testimonials } from "@/components/testimonials-demo"
import SectionWithMockup from "@/components/blocks/section-with-mockup"

export default function Home() {
  return (
    <>
      <StructuredData />
      <Header />
      <main className="grain-overlay">
        <HorizonHeroSection />
        <StrugglesSection />
        <TransformationSection />
        <section id="how-it-works" className="relative z-10 flex w-full justify-center px-4 py-16">
          <GlassHowItWorksCard />
        </section>
        <FeaturesSection />
        <Testimonials />
        <SectionWithMockup
          title={
            <>
              Your mental wellness
              <br />
              journey starts here.
            </>
          }
          description="Access comprehensive AI-powered insights and personalized recommendations right when you need them. Built for your peace of mind."
          primaryImageSrc="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=800&fit=crop"
          secondaryImageSrc="https://images.unsplash.com/photo-1512814915021-8cd84c2e8e39?w=500&h=800&fit=crop"
        />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
      <CookieConsent />
    </>
  )
}
