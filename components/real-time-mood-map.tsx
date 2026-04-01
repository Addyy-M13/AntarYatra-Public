"use client"

import { motion, useInView } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface CityMood {
  city: string
  state: string
  mood: number // 0-100
  trend: "up" | "down" | "stable"
  topEmotion: string
}

const cityMoods: CityMood[] = [
  // North India
  { city: "Delhi", state: "NCR", mood: 62, trend: "stable", topEmotion: "Determined" },
  { city: "Chandigarh", state: "Punjab", mood: 70, trend: "up", topEmotion: "Vibrant" },
  { city: "Jaipur", state: "Rajasthan", mood: 66, trend: "up", topEmotion: "Hopeful" },
  { city: "Lucknow", state: "Uttar Pradesh", mood: 64, trend: "stable", topEmotion: "Content" },
  { city: "Dehradun", state: "Uttarakhand", mood: 73, trend: "up", topEmotion: "Peaceful" },
  { city: "Shimla", state: "Himachal Pradesh", mood: 75, trend: "up", topEmotion: "Calm" },
  { city: "Srinagar", state: "Jammu & Kashmir", mood: 58, trend: "stable", topEmotion: "Reflective" },
  
  // West India
  { city: "Mumbai", state: "Maharashtra", mood: 68, trend: "up", topEmotion: "Energetic" },
  { city: "Pune", state: "Maharashtra", mood: 72, trend: "up", topEmotion: "Optimistic" },
  { city: "Ahmedabad", state: "Gujarat", mood: 67, trend: "up", topEmotion: "Motivated" },
  { city: "Surat", state: "Gujarat", mood: 69, trend: "up", topEmotion: "Positive" },
  { city: "Goa", state: "Goa", mood: 76, trend: "up", topEmotion: "Relaxed" },
  
  // South India
  { city: "Bangalore", state: "Karnataka", mood: 71, trend: "up", topEmotion: "Inspired" },
  { city: "Mysore", state: "Karnataka", mood: 70, trend: "stable", topEmotion: "Serene" },
  { city: "Hyderabad", state: "Telangana", mood: 65, trend: "down", topEmotion: "Focused" },
  { city: "Chennai", state: "Tamil Nadu", mood: 69, trend: "up", topEmotion: "Balanced" },
  { city: "Coimbatore", state: "Tamil Nadu", mood: 68, trend: "stable", topEmotion: "Grounded" },
  { city: "Kochi", state: "Kerala", mood: 74, trend: "up", topEmotion: "Content" },
  { city: "Thiruvananthapuram", state: "Kerala", mood: 72, trend: "up", topEmotion: "Tranquil" },
  { city: "Visakhapatnam", state: "Andhra Pradesh", mood: 67, trend: "stable", topEmotion: "Steady" },
  { city: "Vijayawada", state: "Andhra Pradesh", mood: 66, trend: "up", topEmotion: "Hopeful" },
  { city: "Puducherry", state: "Puducherry", mood: 73, trend: "up", topEmotion: "Peaceful" },
  
  // East India
  { city: "Kolkata", state: "West Bengal", mood: 64, trend: "stable", topEmotion: "Thoughtful" },
  { city: "Bhubaneswar", state: "Odisha", mood: 68, trend: "up", topEmotion: "Calm" },
  { city: "Patna", state: "Bihar", mood: 61, trend: "stable", topEmotion: "Resilient" },
  { city: "Ranchi", state: "Jharkhand", mood: 63, trend: "up", topEmotion: "Steady" },
  { city: "Guwahati", state: "Assam", mood: 65, trend: "stable", topEmotion: "Hopeful" },
  { city: "Imphal", state: "Manipur", mood: 62, trend: "stable", topEmotion: "Determined" },
  { city: "Shillong", state: "Meghalaya", mood: 71, trend: "up", topEmotion: "Joyful" },
  { city: "Agartala", state: "Tripura", mood: 64, trend: "stable", topEmotion: "Content" },
  
  // Central India
  { city: "Bhopal", state: "Madhya Pradesh", mood: 65, trend: "stable", topEmotion: "Balanced" },
  { city: "Indore", state: "Madhya Pradesh", mood: 67, trend: "up", topEmotion: "Positive" },
  { city: "Raipur", state: "Chhattisgarh", mood: 63, trend: "stable", topEmotion: "Hopeful" },
  { city: "Nagpur", state: "Maharashtra", mood: 66, trend: "up", topEmotion: "Motivated" },
]

function AnimatedMoodScore({ score, inView }: { score: number; inView: boolean }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return

    let startTime: number | null = null
    const duration = 1000 // Reduced from 1500ms to 1000ms for snappier animations

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = score * easeOutQuart
      
      setCount(Math.floor(currentValue))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [inView, score])

  return <span>{count}</span>
}

function getMoodColor(mood: number): string {
  if (mood >= 70) return "from-green-500 to-emerald-500"
  if (mood >= 60) return "from-blue-500 to-cyan-500"
  if (mood >= 50) return "from-yellow-500 to-orange-500"
  return "from-red-500 to-pink-500"
}

function getMoodLabel(mood: number): string {
  if (mood >= 70) return "Great"
  if (mood >= 60) return "Good"
  if (mood >= 50) return "Okay"
  return "Struggling"
}

export function RealTimeMoodMap() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2, margin: "100px" }) // Optimized viewport detection
  const [selectedCity, setSelectedCity] = useState<CityMood | null>(null)

  const avgMood = Math.round(cityMoods.reduce((sum, city) => sum + city.mood, 0) / cityMoods.length)

  return (
    <section ref={ref} className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-green-500/10 text-primary mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">Live Community Pulse</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            India's{" "}
            <span className="text-primary">
              Mood Map
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            Real-time emotional wellness across major cities. You're part of a growing community.
          </motion.p>
        </div>

        {/* National Average */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative bg-card border border-primary/20 rounded-2xl p-8 text-center">
            <div className={`absolute inset-0 bg-gradient-to-br ${getMoodColor(avgMood)} opacity-10 rounded-2xl`} />
            
            <div className="relative">
              <p className="text-sm text-muted-foreground mb-2">National Average Wellness Score</p>
              <div className="text-6xl font-bold mb-2">
                <AnimatedMoodScore score={avgMood} inView={inView} />
                <span className="text-3xl text-muted-foreground">/100</span>
              </div>
              <p className={`text-lg font-medium bg-gradient-to-r ${getMoodColor(avgMood)} bg-clip-text text-transparent`}>
                {getMoodLabel(avgMood)} Overall
              </p>
            </div>
          </div>
        </motion.div>

        {/* City Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {cityMoods.map((cityData, index) => {
            const TrendIcon = cityData.trend === "up" ? TrendingUp : cityData.trend === "down" ? TrendingDown : Minus
            const isSelected = selectedCity?.city === cityData.city
            
            return (
              <motion.button
                key={cityData.city}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCity(isSelected ? null : cityData)}
                className="relative group text-left w-full"
              >
                <div className={`relative bg-card border rounded-2xl p-6 transition-all duration-300 ${
                  isSelected ? 'border-primary scale-105' : 'border-border hover:border-primary/30'
                }`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${getMoodColor(cityData.mood)} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity`} />
                  
                  <div className="relative">
                    {/* City Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{cityData.city}</h3>
                        <p className="text-xs text-muted-foreground">{cityData.state}</p>
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium ${
                        cityData.trend === "up" ? "text-green-500" : 
                        cityData.trend === "down" ? "text-red-500" : 
                        "text-muted-foreground"
                      }`}>
                        <TrendIcon className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Mood Score */}
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={`text-4xl font-bold bg-gradient-to-r ${getMoodColor(cityData.mood)} bg-clip-text text-transparent`}>
                          <AnimatedMoodScore score={cityData.mood} inView={inView} />
                        </span>
                        <span className="text-muted-foreground">/100</span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${cityData.mood}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                          className={`h-full bg-gradient-to-r ${getMoodColor(cityData.mood)}`}
                        />
                      </div>
                    </div>

                    {/* Top Emotion */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <span>😊</span>
                      {cityData.topEmotion}
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-muted-foreground">
            📊 Data aggregated from anonymous community mood tracking • Updated every hour
          </p>
        </motion.div>
      </div>
    </section>
  )
}

