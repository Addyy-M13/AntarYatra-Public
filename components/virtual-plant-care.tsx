"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sprout, Droplet, Sun, Heart, Sparkles, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PlantState {
  health: number
  water: number
  happiness: number
  growth: number
  lastCared: Date | null
  daysAlive: number
  careActions: { action: string; timestamp: Date }[]
}

const careActivities = [
  { id: "journal", name: "Journaled today", icon: "📝", points: 20 },
  { id: "exercise", name: "Exercised", icon: "🏃", points: 25 },
  { id: "sleep", name: "Got 7+ hours sleep", icon: "😴", points: 20 },
  { id: "social", name: "Connected with someone", icon: "💬", points: 15 },
  { id: "meditation", name: "Meditated/Relaxed", icon: "🧘", points: 20 },
  { id: "healthy-meal", name: "Ate healthy meal", icon: "🥗", points: 15 },
  { id: "therapy", name: "Went to therapy", icon: "🗣️", points: 30 },
  { id: "hobby", name: "Enjoyed a hobby", icon: "🎨", points: 15 },
]

export function VirtualPlantCare() {
  const [plant, setPlant] = useState<PlantState>({
    health: 50,
    water: 50,
    happiness: 50,
    growth: 0,
    lastCared: null,
    daysAlive: 0,
    careActions: [],
  })

  useEffect(() => {
    // Simulate daily decay
    const interval = setInterval(() => {
      setPlant(prev => ({
        ...prev,
        water: Math.max(0, prev.water - 1),
        health: Math.max(0, prev.health - 0.5),
      }))
    }, 60000) // Every minute for demo (would be longer in production)

    return () => clearInterval(interval)
  }, [])

  const handleCare = (activity: typeof careActivities[0]) => {
    const newPoints = activity.points
    
    setPlant(prev => {
      const newHealth = Math.min(100, prev.health + newPoints * 0.5)
      const newWater = Math.min(100, prev.water + newPoints * 0.4)
      const newHappiness = Math.min(100, prev.happiness + newPoints * 0.6)
      const newGrowth = Math.min(100, prev.growth + newPoints * 0.3)
      
      return {
        ...prev,
        health: newHealth,
        water: newWater,
        happiness: newHappiness,
        growth: newGrowth,
        lastCared: new Date(),
        careActions: [
          { action: activity.name, timestamp: new Date() },
          ...prev.careActions.slice(0, 4),
        ],
      }
    })
  }

  const getPlantStage = () => {
    if (plant.growth < 20) return { emoji: "🌱", name: "Seedling", color: "from-green-300 to-green-400" }
    if (plant.growth < 40) return { emoji: "🌿", name: "Sprout", color: "from-green-400 to-green-500" }
    if (plant.growth < 60) return { emoji: "🪴", name: "Young Plant", color: "from-green-500 to-emerald-500" }
    if (plant.growth < 80) return { emoji: "🌳", name: "Mature Plant", color: "from-emerald-500 to-green-600" }
    return { emoji: "🌸", name: "Blooming!", color: "from-pink-500 to-rose-500" }
  }

  const getHealthStatus = () => {
    if (plant.health < 20) return { text: "Needs care!", color: "text-red-500" }
    if (plant.health < 50) return { text: "Could be better", color: "text-orange-500" }
    if (plant.health < 80) return { text: "Doing well", color: "text-blue-500" }
    return { text: "Thriving!", color: "text-green-500" }
  }

  const stage = getPlantStage()
  const healthStatus = getHealthStatus()

  return (
    <section className="relative py-8 md:py-12 bg-gradient-to-b from-transparent via-green-500/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 mb-3">
              <Sprout className="w-4 h-4" />
              <span className="text-sm font-medium">Virtual Plant Companion</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Grow Your Wellness Garden
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your self-care actions help your plant grow. A beautiful metaphor for your mental health journey!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Plant Display */}
            <Card className="p-8">
              <div className="text-center">
                <motion.div
                  key={stage.emoji}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className={`text-9xl mb-4 ${plant.health < 20 ? "grayscale" : ""}`}
                >
                  {stage.emoji}
                </motion.div>

                <h3 className="text-2xl font-bold mb-2">{stage.name}</h3>
                <p className={`text-lg font-medium mb-6 ${healthStatus.color}`}>
                  {healthStatus.text}
                </p>

                {/* Stats */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        Health
                      </span>
                      <span className="text-sm font-bold">{Math.round(plant.health)}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-red-400 to-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${plant.health}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-blue-500" />
                        Hydration
                      </span>
                      <span className="text-sm font-bold">{Math.round(plant.water)}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${plant.water}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm flex items-center gap-2">
                        <Sun className="w-4 h-4 text-yellow-500" />
                        Happiness
                      </span>
                      <span className="text-sm font-bold">{Math.round(plant.happiness)}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${plant.happiness}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Growth
                      </span>
                      <span className="text-sm font-bold">{Math.round(plant.growth)}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-400 to-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${plant.growth}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Care Actions */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Self-Care Actions
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Complete these activities to help your plant (and yourself!) thrive
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {careActivities.map((activity) => (
                  <Button
                    key={activity.id}
                    onClick={() => handleCare(activity)}
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2 hover:bg-primary/10 hover:border-primary"
                  >
                    <span className="text-2xl">{activity.icon}</span>
                    <span className="text-xs text-center">{activity.name}</span>
                    <span className="text-xs text-primary">+{activity.points} pts</span>
                  </Button>
                ))}
              </div>

              {/* Recent Care Log */}
              {plant.careActions.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold mb-3">Recent Care</h4>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {plant.careActions.map((action, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="text-xs text-muted-foreground flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span>{action.action}</span>
                          <span className="text-xs opacity-60">
                            {new Date(action.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Info Card */}
          <Card className="p-6 bg-muted/30 mt-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" />
              Why This Works
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              This virtual plant is a gentle reminder that your mental health needs regular care, just like a plant.
              Each self-care action you complete nurtures both your wellbeing and your plant's growth!
            </p>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Visual progress tracking</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Gamifies self-care</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Builds healthy habits</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
