"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Heart, AlertCircle, ExternalLink, Wind, Anchor, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n/context"

interface HotlineInfo {
  name: string
  number: string
  available: string
  description: string
  country: string
}

const crisisHotlines: HotlineInfo[] = [
  {
    name: "AASRA (India)",
    number: "91-9820466726",
    available: "24/7",
    description: "Suicide prevention & emotional support helpline",
    country: "India",
  },
  {
    name: "Vandrevala Foundation (India)",
    number: "1860-2662-345",
    available: "24/7",
    description: "Mental health support and crisis intervention",
    country: "India",
  },
  {
    name: "iCall Psychosocial Helpline",
    number: "+91-9152987821",
    available: "Mon-Sat 8AM-10PM",
    description: "Tata Institute of Social Sciences helpline",
    country: "India",
  },
  {
    name: "Snehi India Foundation",
    number: "+91-9899885018",
    available: "Daily 10AM-10PM",
    description: "Emotional support for those in distress",
    country: "India",
  },
  {
    name: "NIMHANS Helpline",
    number: "+91-8046110007",
    available: "24/7",
    description: "Mental health emergency support",
    country: "India",
  },
  {
    name: "Fortis Stress Helpline",
    number: "+91-8376804102",
    available: "24/7",
    description: "Crisis counseling & mental health support",
    country: "India",
  },
  {
    name: "Roshni Trust (Hyderabad)",
    number: "+91-4066202000",
    available: "11AM-9PM",
    description: "Suicide prevention & emotional support",
    country: "India",
  },
  {
    name: "Mitram Foundation (Chennai)",
    number: "+91-4466202000",
    available: "10AM-6PM",
    description: "Mental health support & counseling",
    country: "India",
  },
]


export function CrisisToolkit() {
  const { t } = useTranslation()

  return (
    <section className="relative py-8 md:py-12 bg-gradient-to-b from-transparent via-red-500/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 mb-3">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{t('crisis.toolkit.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {t('crisis.toolkit.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('crisis.toolkit.description')}
            </p>
          </div>

          {/* Emergency Warning */}
          <Card className="p-6 mb-8 border-2 border-red-500/50 bg-red-500/10">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-500 mb-2">{t('crisis.toolkit.emergencyTitle')}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('crisis.toolkit.emergencyDesc')}
                </p>
                <div className="space-y-1 text-sm font-medium">
                  <p>• {t('crisis.toolkit.emergencyCall')}: <a href="tel:112" className="text-primary hover:underline">112</a></p>
                  <p>• {t('crisis.toolkit.ambulance')}: <a href="tel:102" className="text-primary hover:underline">102</a></p>
                  <p>• {t('crisis.toolkit.womenHelpline')}: <a href="tel:1091" className="text-primary hover:underline">1091</a></p>
                </div>
                <p className="text-sm font-medium mt-3">
                  {t('crisis.toolkit.yourLifeMatters')}
                </p>
              </div>
            </div>
          </Card>

          {/* Crisis Hotlines */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Phone className="w-6 h-6 text-primary" />
              {t('crisis.toolkit.hotlinesTitle')}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {crisisHotlines.map((hotline, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-lg">{hotline.name}</h4>
                      <span className="text-xs text-muted-foreground">{hotline.country}</span>
                    </div>
                    <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                      {hotline.available}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{hotline.description}</p>
                  <a
                    href={`tel:${hotline.number.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors group"
                  >
                    <Phone className="w-5 h-5 text-primary" />
                    <span className="font-bold text-primary">{hotline.number}</span>
                    <ExternalLink className="w-4 h-4 ml-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <Card className="p-6 bg-muted/30">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              {t('crisis.toolkit.resourcesTitle')}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">{t('crisis.toolkit.onlineChat')}</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <a href="https://www.yourdost.com" target="_blank" rel="noopener" className="hover:underline">
                      YourDOST - Online Counseling
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <a href="https://www.thetribe.in" target="_blank" rel="noopener" className="hover:underline">
                      The Tribe - Mental Health Platform
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <a href="https://mindpeers.co" target="_blank" rel="noopener" className="hover:underline">
                      Mindpeers - Therapy & Support
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t('crisis.toolkit.findTherapist')}</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Use our Therapist Finder below</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Visit NIMHANS, AIIMS, or local hospitals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Contact Fortis Mental Health: <a href="tel:08376804102" className="text-primary hover:underline">+91-8376804102</a></span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Encouragement */}
          <Card className="p-8 mt-6 text-center bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="text-2xl font-bold mb-3">{t('crisis.toolkit.youMatterTitle')}</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('crisis.toolkit.youMatterDesc')}
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
