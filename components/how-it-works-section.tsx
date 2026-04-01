"use client"

import * as React from "react"
import { Sparkles, Brain, TrendingUp, Users } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"
import { FeatureHighlight } from "@/components/ui/feature-highlight"

const STEP_ICONS = [
  <Sparkles className="inline h-7 w-7 align-middle" />,
  <Brain className="inline h-7 w-7 align-middle" />,
  <TrendingUp className="inline h-7 w-7 align-middle" />,
  <Users className="inline h-7 w-7 align-middle" />,
]

export function HowItWorksSection() {
  const { t } = useTranslation()

  const steps = [
    { title: t("how.step1.title"), description: t("how.step1.description") },
    { title: t("how.step2.title"), description: t("how.step2.description") },
    { title: t("how.step3.title"), description: t("how.step3.description") },
    { title: t("how.step4.title"), description: t("how.step4.description") },
  ]

  const features = steps.map((step, i) => (
    <div className="flex items-start gap-4">
      {/* Step number badge */}
      <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        0{i + 1}
      </span>

      <div>
        {/* Icon + title inline */}
        <span className="inline-flex items-center gap-2">
          <span className="text-primary">{STEP_ICONS[i]}</span>
          <span className="text-xl font-semibold text-foreground">{step.title}</span>
        </span>
        <span className="mx-2 text-muted-foreground/40">—</span>
        <span className="text-xl">{step.description}</span>
      </div>
    </div>
  ))

  const footer = (
    <p className="pt-2 text-lg text-muted-foreground">
      {t("how.description")}
    </p>
  )

  return (
    <section id="how-it-works" className="relative z-10 flex w-full justify-center px-4 py-16">
      <FeatureHighlight
        icon={
          <Sparkles className="h-14 w-14 rounded-full bg-primary p-3 text-primary-foreground" />
        }
        title="How AntarYatra Works"
        features={features}
        footer={footer}
        className="max-w-3xl"
      />
    </section>
  )
}
