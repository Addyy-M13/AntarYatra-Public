"use client"

import { motion } from "framer-motion"
import { Calendar, Bell, Heart, Brain, Users, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MentalHealthDay {
  date: string
  title: string
  description: string
  color: string
  icon: any
  activities: string[]
}

const mentalHealthCalendar: MentalHealthDay[] = [
  {
    date: "Jan 24",
    title: "International Day of Education",
    description: "Mental health literacy matters",
    color: "from-blue-500 to-cyan-500",
    icon: Brain,
    activities: ["Learn about one mental health condition", "Share educational resources", "Break stigma through knowledge"]
  },
  {
    date: "Feb 13",
    title: "World Radio Day",
    description: "Share your story, amplify voices",
    color: "from-purple-500 to-pink-500",
    icon: Sparkles,
    activities: ["Listen to mental health podcasts", "Share your journey", "Support content creators"]
  },
  {
    date: "Mar 20",
    title: "International Day of Happiness",
    description: "Celebrate joy and mental wellness",
    color: "from-yellow-500 to-orange-500",
    icon: Sparkles,
    activities: ["Do something that makes you happy", "Practice gratitude", "Spread positivity"]
  },
  {
    date: "Apr 7",
    title: "World Health Day",
    description: "Mental health IS health",
    color: "from-green-500 to-emerald-500",
    icon: Heart,
    activities: ["Schedule a check-in with yourself", "Review your wellness goals", "Support health initiatives"]
  },
  {
    date: "May 10",
    title: "World Lupus Day",
    description: "Chronic illness affects mental health",
    color: "from-purple-600 to-indigo-500",
    icon: Heart,
    activities: ["Learn about invisible illnesses", "Support chronic illness warriors", "Practice self-compassion"]
  },
  {
    date: "Jun 21",
    title: "International Yoga Day",
    description: "Mind-body wellness connection",
    color: "from-teal-500 to-cyan-500",
    icon: Sparkles,
    activities: ["Try 10 minutes of yoga", "Practice mindful breathing", "Stretch your body"]
  },
  {
    date: "Jul 30",
    title: "International Day of Friendship",
    description: "Social connections heal",
    color: "from-pink-500 to-rose-500",
    icon: Users,
    activities: ["Reach out to a friend", "Join a support group", "Express appreciation"]
  },
  {
    date: "Sep 10",
    title: "World Suicide Prevention Day",
    description: "Every life matters, help is available",
    color: "from-yellow-500 to-amber-500",
    icon: Heart,
    activities: ["Learn warning signs", "Share helpline numbers", "Check on loved ones"]
  },
  {
    date: "Oct 10",
    title: "World Mental Health Day",
    description: "Global awareness and advocacy",
    color: "from-green-500 to-teal-500",
    icon: Brain,
    activities: ["Share your mental health journey", "Donate to organizations", "Advocate for change"]
  },
  {
    date: "Nov 13",
    title: "World Kindness Day",
    description: "Small acts, big impact",
    color: "from-purple-500 to-pink-500",
    icon: Heart,
    activities: ["Random acts of kindness", "Be kind to yourself", "Spread compassion"]
  },
  {
    date: "Dec 3",
    title: "International Day of Persons with Disabilities",
    description: "Mental health is inclusive",
    color: "from-blue-500 to-indigo-500",
    icon: Users,
    activities: ["Learn about accessibility", "Support inclusive spaces", "Amplify diverse voices"]
  },
  {
    date: "Dec 31",
    title: "New Year's Reflection",
    description: "Honor your growth and resilience",
    color: "from-purple-600 to-pink-600",
    icon: Sparkles,
    activities: ["Review your year", "Celebrate small wins", "Set intentions with compassion"]
  }
]

export function MentalHealthCalendar() {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-teal-500/10 text-primary mb-4"
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Mark Your Calendar</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            Mental Health{" "}
            <span className="text-primary">
              Awareness Days
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            Join the global conversation and take action throughout the year
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentalHealthCalendar.map((day, index) => {
              const Icon = day.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 h-full bg-gradient-to-br from-card to-primary/5 border-primary/10 hover:border-primary/30 transition-all group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${day.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2">{day.date}</Badge>
                        <h3 className="font-bold text-lg mb-1 leading-tight">{day.title}</h3>
                        <p className="text-sm text-muted-foreground">{day.description}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ways to Participate:</p>
                      <ul className="space-y-1.5">
                        {day.activities.map((activity, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className="mt-4 w-full py-2 px-4 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      <Bell className="w-4 h-4" />
                      Set Reminder
                    </button>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Card className="p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
              <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Every Day is Mental Health Day</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                While these special days raise awareness, remember that taking care of your mental health is important every single day. 
                Start your daily wellness journey with AntarYatra.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

