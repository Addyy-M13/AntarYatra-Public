'use client'

import { Cloud, Brain, MessageCircle, Frown } from "lucide-react"
import { PointerHighlight } from "@/components/ui/pointer-highlight"
import { useTranslation } from "@/lib/i18n/context"

export function StrugglesSection() {
  const { t } = useTranslation()

  const struggles = [
    {
      icon: Cloud,
      title: t("struggles.anxiety.title"),
      description: t("struggles.anxiety.description"),
    },
    {
      icon: Brain,
      title: t("struggles.exhaustion.title"),
      description: t("struggles.exhaustion.description"),
    },
    {
      icon: MessageCircle,
      title: t("struggles.expressing.title"),
      description: t("struggles.expressing.description"),
    },
    {
      icon: Frown,
      title: t("struggles.alone.title"),
      description: t("struggles.alone.description"),
    },
  ]

  return (
    <section className="relative z-10 py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-balance">
            {t("struggles.title")}{" "}
            <PointerHighlight
              rectangleClassName="border-destructive/60 dark:border-destructive/60"
              pointerClassName="text-destructive"
              containerClassName="inline-block"
            >
              <span className="bg-gradient-to-r from-destructive to-accent bg-clip-text text-transparent">
                {t("struggles.titleHighlight")}
              </span>
            </PointerHighlight>
          </h2>
          <div className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            <PointerHighlight
              rectangleClassName="border-muted-foreground/40 dark:border-muted-foreground/40"
              pointerClassName="text-muted-foreground"
              containerClassName="inline-block"
            >
              <span>{t("struggles.subtitle")}</span>
            </PointerHighlight>{" "}
            {t("struggles.subtitleEnd")}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {struggles.map((struggle, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-sm transition-shadow duration-300"
            >
              <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <struggle.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">{struggle.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{struggle.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

