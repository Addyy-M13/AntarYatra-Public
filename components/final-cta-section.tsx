"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "@/lib/i18n/context"
import { useRouter } from "next/navigation"

export function FinalCTASection() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { t } = useTranslation()
  const router = useRouter()

  const handleClick = () => {
    setIsLoading(true)
    router.push("/login")
  }

  return (
    <section className="relative z-10 py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-3xl blur-3xl animate-gradient" />
          <div className="relative bg-card border border-border rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
                {t("final.title")}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                {t("final.description")}
            </p>
            <div className="flex justify-center mb-6">
              <Button
                onClick={handleClick}
                size="lg"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 group whitespace-nowrap"
              >
                  {isLoading ? t("final.ctaLoading") : t("final.cta")}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </div>
              <p className="text-sm text-muted-foreground">{t("final.note")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

