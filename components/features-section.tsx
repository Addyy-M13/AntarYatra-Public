"use client"

import React from "react"
import { useRef, useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n/context"
import { Sparkles, BarChart3, Globe, Gift, Users, Shield } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"
import { CardContent } from "@/components/ui/card"

// ─── Types ────────────────────────────────────────────────────────────────────

type FeatureCard = {
  id: number
  icon: React.ElementType
  title: string
  description: string
}

// ─── CardStack ────────────────────────────────────────────────────────────────

let stackInterval: ReturnType<typeof setInterval> | undefined

const CardStack = ({
  items,
  offset = 10,
  scaleFactor = 0.06,
}: {
  items: FeatureCard[]
  offset?: number
  scaleFactor?: number
}) => {
  const [cards, setCards] = useState<FeatureCard[]>(items)

  useEffect(() => {
    stackInterval = setInterval(() => {
      setCards((prev) => {
        const next = [...prev]
        next.unshift(next.pop()!)
        return next
      })
    }, 3500)
    return () => clearInterval(stackInterval)
  }, [])

  return (
    <div className="relative mx-auto h-52 w-full md:h-52 md:w-96 my-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.id}
            className="absolute bg-white dark:bg-zinc-900 h-52 w-full md:h-52 md:w-96 rounded-3xl p-5 shadow-xl border border-neutral-200 dark:border-white/10 flex flex-col justify-between"
            style={{ transformOrigin: "top center" }}
            animate={{
              top: index * -offset,
              scale: 1 - index * scaleFactor,
              zIndex: cards.length - index,
            }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary flex-shrink-0">
                {React.createElement(Icon as any, { className: "w-5 h-5" })}
              </div>
              <h4 className="font-semibold text-neutral-900 dark:text-white text-sm leading-snug pt-0.5">
                {card.title}
              </h4>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
              {card.description}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function FeaturesSection() {
  const { t } = useTranslation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  const leftFeatures: FeatureCard[] = [
    { id: 0, icon: Sparkles, title: t("features.ai.title"),    description: t("features.ai.description") },
    { id: 1, icon: BarChart3, title: t("features.mood.title"), description: t("features.mood.description") },
    { id: 2, icon: Globe,     title: t("features.multi.title"),description: t("features.multi.description") },
  ]

  const rightFeatures = [
    { icon: Gift,   title: t("features.rewards.title"),   description: t("features.rewards.description") },
    { icon: Users,  title: t("features.community.title"), description: t("features.community.description") },
    { icon: Shield, title: t("features.privacy.title"),   description: t("features.privacy.description") },
  ]

  return (
    <section id="features" className="relative z-10 py-20 md:py-28" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
            Everything You Need for{" "}
            <span className="text-primary">Mental Wellness</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Powerful features designed to support your journey to inner peace
          </p>
        </motion.div>

        {/* Ruixen-style 2-column layout */}
        <motion.div
          className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 relative gap-0"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── Left Block – CardStack ── */}
          <div className="flex flex-col items-start justify-center border border-border p-6 sm:p-8 lg:p-10 rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl bg-white/50 dark:bg-black/50 backdrop-blur-sm relative overflow-hidden">
            <div className="relative w-full mb-8 h-64 flex items-center justify-center">
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white dark:from-black to-transparent z-10 pointer-events-none" />
              <CardStack items={leftFeatures} />
            </div>

            <h3 className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed tracking-tight">
              Empathy-Driven Design.{" "}
              <span className="text-primary">AntarYatra</span>{" "}
              <span className="text-muted-foreground text-base sm:text-lg block mt-2 font-normal">
                Simplify your mental wellness journey with thoughtfully designed tools that provide actionable emotional insights out of the box.
              </span>
            </h3>
          </div>

          {/* ── Right Block – Feature list with rainbow border ── */}
          <div className="flex flex-col items-center justify-start border border-t-0 lg:border-t lg:border-l-0 border-border p-6 sm:p-8 lg:p-10 rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl bg-white/50 dark:bg-black/50 backdrop-blur-sm">
            <h3 className="text-xl sm:text-2xl font-medium text-foreground mb-8 leading-relaxed tracking-tight w-full">
              Your Complete Toolkit.{" "}
              <span className="text-primary">All in One.</span>{" "}
              <span className="text-muted-foreground text-base sm:text-lg block mt-2 font-normal">
                Integrate mindfulness effortlessly into your daily routine using AntarYatra&apos;s smart tools—no jargon, just peace.
              </span>
            </h3>

            <div
              className={cn(
                "group relative mt-auto w-full inline-flex animate-rainbow cursor-default items-center justify-center rounded-2xl border-0 bg-white dark:bg-black p-1 font-medium transition-colors",
                "[background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent]",
                "before:absolute before:bottom-0 before:left-1/2 before:z-0 before:h-1/2 before:w-4/5 before:-translate-x-1/2",
                "before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
                "before:bg-[length:200%] before:[filter:blur(calc(1.2*1rem))] before:opacity-50"
              )}
            >
              <CardContent className="p-4 sm:p-6 space-y-3 bg-white dark:bg-zinc-950 border border-border rounded-[14px] sm:rounded-[1.3rem] z-10 w-full shadow-sm">
                {rightFeatures.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-xl hover:bg-muted/50 dark:hover:bg-white/5 transition duration-300"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 border border-primary/20">
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm sm:text-base font-semibold text-foreground truncate">
                            {item.title}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <button className="rounded-full border border-border bg-background p-2 sm:p-2.5 text-primary flex-shrink-0 ml-3 hover:bg-muted transition">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  )
                })}
              </CardContent>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
