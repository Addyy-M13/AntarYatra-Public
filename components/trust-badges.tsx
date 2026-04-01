"use client"

import { Shield, Lock, CheckCircle, Award } from "lucide-react"

export function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "GDPR Compliant",
      description: "Your privacy protected",
    },
    {
      icon: Lock,
      title: "256-bit Encryption",
      description: "Bank-level security",
    },
    {
      icon: CheckCircle,
      title: "Verified Platform",
      description: "Trusted by thousands",
    },
    {
      icon: Award,
      title: "Expert Approved",
      description: "Mental health certified",
    },
  ]

  return (
    <section className="relative z-10 py-12 border-y border-border/50 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-3 p-4 rounded-lg hover:bg-card/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <badge.icon className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">{badge.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

