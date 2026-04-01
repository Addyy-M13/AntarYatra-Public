"use client"

import { Book, Brain, Heart, Shield, Users, Clock } from "lucide-react"
import { Card } from "./ui/card"
import { cn } from "@/lib/utils"

interface Feature {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const features: Feature[] = [
  {
    title: "AI-Powered Journaling",
    description: "Express yourself freely with smart journaling that understands your emotions",
    icon: Book,
    color: "text-blue-500"
  },
  {
    title: "Mood Tracking",
    description: "Track your emotional journey with intelligent mood analysis",
    icon: Brain,
    color: "text-purple-500"
  },
  {
    title: "Mental Wellness",
    description: "Access guided exercises and resources for mental well-being",
    icon: Heart,
    color: "text-rose-500"
  },
  {
    title: "Privacy First",
    description: "Your data is encrypted and completely private",
    icon: Shield,
    color: "text-green-500"
  },
  {
    title: "Supportive Community",
    description: "Connect with others on similar journeys while maintaining anonymity",
    icon: Users,
    color: "text-amber-500"
  },
  {
    title: "Progress Tracking",
    description: "Monitor your growth with detailed insights and patterns",
    icon: Clock,
    color: "text-cyan-500"
  }
]

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {features.map((feature, index) => (
        <Card
          key={index}
          className="p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className={cn("p-2 rounded-full bg-background", feature.color)}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
          </div>
          <p className="text-muted-foreground">{feature.description}</p>
        </Card>
      ))}
    </div>
  )
}
