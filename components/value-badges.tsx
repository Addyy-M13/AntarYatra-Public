"use client"

import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { Heart, Globe, Star, BookOpen, Users, Sparkles } from "lucide-react"

const valueBadges = [
  {
    icon: Globe,
    label: "Hinglish Support",
    description: "Write in Hindi, English, or mix both naturally",
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    icon: Heart,
    label: "India-Focused Wellness",
    description: "Content tailored to Indian cultural context",
    color: "bg-rose-500/10 text-rose-500"
  },
  {
    icon: Star,
    label: "Culturally Aware",
    description: "Understanding of local values and traditions",
    color: "bg-amber-500/10 text-amber-500"
  },
  {
    icon: BookOpen,
    label: "Regional Stories",
    description: "Success stories from your community",
    color: "bg-green-500/10 text-green-500"
  },
  {
    icon: Users,
    label: "Local Support",
    description: "Connect with people who understand your context",
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    icon: Sparkles,
    label: "Personalized Experience",
    description: "AI that understands Indian expressions",
    color: "bg-cyan-500/10 text-cyan-500"
  }
]

export function ValueBadges() {
  return (
    <section className="py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold mb-4">Built for India&apos;s Unique Journey</h2>
        <p className="text-muted-foreground">
          AntarYatra is designed specifically for the Indian context, understanding our unique 
          cultural nuances and wellness needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {valueBadges.map((badge, index) => (
          <Card 
            key={index}
            className="p-6 flex items-start space-x-4 hover:shadow-lg transition-shadow"
          >
            <div className={`p-3 rounded-full ${badge.color}`}>
              <badge.icon className="w-6 h-6" />
            </div>
            <div>
              <Badge className={badge.color}>
                {badge.label}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                {badge.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
