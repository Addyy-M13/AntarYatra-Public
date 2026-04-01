"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Heart, Users, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface EmotionalProfile {
  feeling: string
  situation: string
  color: string
  twin: {
    name: string
    story: string
    outcome: string
  }
}

const emotionalProfiles: Record<string, EmotionalProfile> = {
  anxious: {
    feeling: "Anxious & Overwhelmed",
    situation: "constant worry, racing thoughts",
    color: "from-yellow-500 to-orange-500",
    twin: {
      name: "Priya S.",
      story: "Was having panic attacks before exams, couldn't sleep for weeks",
      outcome: "Now manages anxiety with daily journaling - hasn't had a panic attack in 3 months"
    }
  },
  depressed: {
    feeling: "Sad & Empty",
    situation: "no motivation, everything feels pointless",
    color: "from-blue-500 to-indigo-500",
    twin: {
      name: "Rahul M.",
      story: "Felt numb for months, stopped meeting friends, barely ate",
      outcome: "Journaling helped identify triggers - now exercises daily and reconnected with 5 friends"
    }
  },
  lonely: {
    feeling: "Lonely & Isolated",
    situation: "no one understands me",
    color: "from-purple-500 to-pink-500",
    twin: {
      name: "Ananya K.",
      story: "Moved to new city, felt completely alone and misunderstood",
      outcome: "Found community through AntarYatra - made 3 close friends who get it"
    }
  },
  stressed: {
    feeling: "Stressed & Burned Out",
    situation: "work pressure, no work-life balance",
    color: "from-red-500 to-orange-500",
    twin: {
      name: "Vikram T.",
      story: "Working 14-hour days, health deteriorating, relationships suffering",
      outcome: "Set boundaries using insights from mood tracking - now works 8 hours and feels productive"
    }
  },
  hopeless: {
    feeling: "Hopeless & Lost",
    situation: "nothing will ever get better",
    color: "from-gray-500 to-slate-600",
    twin: {
      name: "Meera P.",
      story: "Failed startup, broken relationship, felt like life was over at 28",
      outcome: "Daily journaling revealed patterns of resilience - now mentors others and started new venture"
    }
  },
  confused: {
    feeling: "Confused & Uncertain",
    situation: "don't know what I want or who I am",
    color: "from-cyan-500 to-teal-500",
    twin: {
      name: "Arjun D.",
      story: "Quarter-life crisis, quit job without plan, family pressure",
      outcome: "Journaling helped clarify values - found dream career and confident in choices"
    }
  }
}

export function EmotionalTwinFinder() {
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null)
  const [showTwin, setShowTwin] = useState(false)

  const handleSelect = (key: string) => {
    setSelectedFeeling(key)
    setShowTwin(false)
    setTimeout(() => setShowTwin(true), 300)
  }

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-primary mb-4"
          >
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">You're Not Alone</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            Find Your{" "}
            <span className="text-primary">
              Emotional Twin
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            Someone else felt exactly like you do right now — and they made it through. Find them.
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-center text-muted-foreground mb-6">How are you feeling right now?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {Object.entries(emotionalProfiles).map(([key, profile]) => (
                <motion.button
                  key={key}
                  onClick={() => handleSelect(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedFeeling === key
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30 bg-card"
                  }`}
                >
                  <div className={`text-sm font-semibold bg-gradient-to-r ${profile.color} bg-clip-text text-transparent`}>
                    {profile.feeling}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {selectedFeeling && showTwin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-6 md:p-8 bg-gradient-to-br from-card via-card to-primary/5 border-primary/20">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Meet {emotionalProfiles[selectedFeeling].twin.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Your emotional twin who felt: <span className="text-foreground font-medium">{emotionalProfiles[selectedFeeling].situation}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-background/50 rounded-lg p-4 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Their Struggle:</p>
                    <p className="text-foreground">{emotionalProfiles[selectedFeeling].twin.story}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-green-500" />
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">Their Transformation:</p>
                    </div>
                    <p className="text-foreground">{emotionalProfiles[selectedFeeling].twin.outcome}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-center text-sm text-muted-foreground mb-4">
                    If they could transform their life, so can you. Start your journey today.
                  </p>
                  <Button className="w-full group" size="lg">
                    Start My Journey Like {emotionalProfiles[selectedFeeling].twin.name.split(' ')[0]}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {!selectedFeeling && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">Select a feeling above to meet someone who felt the same way</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

