"use client"

import { Footer } from "@/components/footer"
import { CrisisToolkit } from "@/components/crisis-toolkit"
import { TherapistFinder } from "@/components/therapist-finder"
import { DottedSurface } from "@/components/ui/dotted-surface"
import { EtherealShadow } from "@/components/ui/etheral-shadow"
import { Button } from "@/components/ui/button"
import HeroScrollAnimation from "@/components/ui/hero-scroll-animation"
import Link from "next/link"
import { Home } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"
import { Header } from "@/components/ui/header-2"

export default function CrisisPage() {
  const { t } = useTranslation()

  return (
    <>
      <Header />
      <DottedSurface />

      {/* Hero Scroll Animation Section */}
      <HeroScrollAnimation isCrisisPage={true} />

      <main className="relative min-h-screen overflow-hidden bg-black">
        {/* Ethereal Shadow Background - Dark */}
        <EtherealShadow
          color="rgba(15, 15, 15, 0.9)"
          animation={{ scale: 80, speed: 70 }}
          noise={{ opacity: 0.8, scale: 1 }}
          sizing="fill"
        />

        {/* Content with relative positioning */}
        <div className="relative z-10">
          {/* Crisis Toolkit Section */}
          <div id="crisis-hotlines">
            <CrisisToolkit />
          </div>

          {/* Therapist Finder Section */}
          <div id="therapist-directory">
            <TherapistFinder />
          </div>

          {/* Back to Home CTA */}
          <section className="py-12 bg-gradient-to-b from-transparent to-primary/5">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t("crisis.moreTools")}
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  {t("crisis.moreToolsDesc")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/dashboard">
                    <Button size="lg" variant="default">
                      {t("crisis.goToDashboard")}
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="lg" variant="outline">
                      <Home className="w-4 h-4 mr-2" />
                      {t("crisis.backToHome")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </div>
      </main>
    </>
  )
}
