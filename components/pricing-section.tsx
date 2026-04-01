"use client"

import { Check, Sparkles, Crown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/context"

export function PricingSection() {
  const { t } = useTranslation()
  const plans = [
    {
      name: t("pricing.free.name"),
      icon: Sparkles,
      price: "0",
      period: "/month",
      description: t("pricing.free.description"),
      features: [
        "5 AI journal entries per month",
        "Basic mood tracking",
        "Daily prompts",
        "Community access",
        "Multilanguage support"
      ],
      cta: "Start Free",
      badge: null,
    },
    {
      name: t("pricing.premium.name"),
      icon: Crown,
      price: "49",
      period: "/month",
      description: t("pricing.premium.description"),
      features: [
        "Unlimited AI journal entries",
        "Advanced mood analytics",
        "Personalized insights",
        "Priority support",
        "Export your data",
        "Custom prompts",
        "1-on-1 check-ins"
      ],
      cta: "Start Premium",
      badge: "Most Popular",
    },
    {
      name: t("pricing.lifetime.name"),
      icon: Zap,
      price: "99",
      period: "/month",
      description: t("pricing.lifetime.description"),
      features: [
        "Everything in Premium",
        "Lifetime updates",
        "Early access to features",
        "Exclusive community",
        "Personal wellness coach",
      ],
      cta: "Get Lifetime",
      popular: false,
    },
  ]

  return (
    <section className="relative py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("pricing.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card border rounded-3xl p-8 hover:shadow-sm transition-shadow transition-all ${
                plan.popular ? "border-primary shadow-lg shadow-primary/20" : "border-primary/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <plan.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">Rs. {plan.price}</span>
                  {plan.name !== t("pricing.lifetime.name") && <span className="text-muted-foreground">/month</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={
                  plan.popular ? "bg-primary hover:bg-primary/90" : ""
                }
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-6 py-3">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-foreground font-medium">{t("pricing.guarantee")}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

