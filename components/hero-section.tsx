"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { ActiveUsersCounter } from "@/components/active-users-counter"
import { useTranslation } from "@/lib/i18n/context"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import { AnimatedHeadline } from "@/components/animated-headline"

export function HeroSection() {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()
  const router = useRouter()

  const handleCTA = () => {
    setIsLoading(true)
    router.push("/login")
  }

  return (
    <section className="relative z-10 pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">

          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Sparkles size={16} />
            <span>{t("hero.badge")}</span>
          </motion.div>

          {/* Headline */}
          <AnimatedHeadline
            text={t("hero.title")}
            highlight={t("hero.titleHighlight")}
            textEnd={t("hero.titleEnd")}
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-balance"
            startDelay={0.1}
          />

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.75 }}
          >
            {t("hero.description")}
          </motion.p>

          {/* Active users — real count from Supabase */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <ActiveUsersCounter />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <Button
              onClick={handleCTA}
              size="lg"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg h-auto whitespace-nowrap"
            >
              {isLoading ? t("hero.ctaLoading") : t("hero.cta")}
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
