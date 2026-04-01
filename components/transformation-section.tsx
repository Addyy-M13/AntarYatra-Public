'use client'

import { ArrowRight, Smile, TrendingUp, Zap, Sparkles } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"

export function TransformationSection() {
  const { t } = useTranslation()

  return (
    <section className="relative z-10 py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
            {t("transformation.title")}{" "}
            <span className="text-primary">
              {t("transformation.titleHighlight")}
            </span>{" "}
            {t("transformation.subtitle")}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t("transformation.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          <div className="bg-card border border-destructive/30 rounded-2xl p-8 text-center">
            <div className="mb-4 inline-flex p-4 rounded-full bg-destructive/10 text-destructive">
              <Smile size={32} className="rotate-180" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{t("transformation.before")}</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>{t("transformation.beforeItem1")}</li>
              <li>{t("transformation.beforeItem2")}</li>
              <li>{t("transformation.beforeItem3")}</li>
              <li>{t("transformation.beforeItem4")}</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <div className="inline-flex p-4 rounded-full bg-primary">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="bg-card border border-primary/30 rounded-2xl p-8 text-center">
            <div className="mb-4 inline-flex p-4 rounded-full bg-primary/10 text-primary">
              <Smile size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4">{t("transformation.after")}</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li>{t("transformation.afterItem1")}</li>
              <li>{t("transformation.afterItem2")}</li>
              <li>{t("transformation.afterItem3")}</li>
              <li>{t("transformation.afterItem4")}</li>
            </ul>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-3">
              <TrendingUp size={24} />
            </div>
            <div className="text-3xl font-bold mb-2">{t("transformation.stat1")}</div>
            <p className="text-sm text-muted-foreground">{t("transformation.stat1Label")}</p>
          </div>
          <div className="text-center">
            <div className="inline-flex p-3 rounded-xl bg-secondary/10 text-secondary mb-3">
              <Zap size={24} />
            </div>
            <div className="text-3xl font-bold mb-2">{t("transformation.stat2")}</div>
            <p className="text-sm text-muted-foreground">{t("transformation.stat2Label")}</p>
          </div>
          <div className="text-center">
            <div className="inline-flex p-3 rounded-xl bg-accent/10 text-accent mb-3">
              <Smile size={24} />
            </div>
            <div className="text-3xl font-bold mb-2">{t("transformation.stat3")}</div>
            <p className="text-sm text-muted-foreground">{t("transformation.stat3Label")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

