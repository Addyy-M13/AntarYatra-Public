"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Brain, Heart, Sparkles, TrendingUp, Users, Zap } from "lucide-react"

const journeyStages = [
  {
    stage: 0,
    label: "Feeling Lost",
    emoji: "😔",
    description: "Struggling to understand what you're feeling",
    features: ["Mood Tracking", "Daily Check-ins"],
    color: "from-slate-500 to-slate-600",
    icon: Heart
  },
  {
    stage: 25,
    label: "Seeking Clarity",
    emoji: "🤔",
    description: "Starting to identify patterns and triggers",
    features: ["AI Journal Insights", "Pattern Recognition"],
    color: "from-blue-500 to-cyan-500",
    icon: Brain
  },
  {
    stage: 50,
    label: "Building Habits",
    emoji: "💪",
    description: "Developing consistent self-care routines",
    features: ["Streak Rewards", "Guided Prompts"],
    color: "from-purple-500 to-pink-500",
    icon: Zap
  },
  {
    stage: 75,
    label: "Finding Support",
    emoji: "🤝",
    description: "Connecting with others on similar journeys",
    features: ["Anonymous Community", "Shared Stories"],
    color: "from-green-500 to-emerald-500",
    icon: Users
  },
  {
    stage: 100,
    label: "Thriving",
    emoji: "✨",
    description: "Managing your mental health with confidence",
    features: ["Advanced Analytics", "Progress Milestones"],
    color: "from-yellow-500 to-orange-500",
    icon: TrendingUp
  }
]

const personas = [
  { name: "Student", color: "bg-blue-500" },
  { name: "Professional", color: "bg-purple-500" },
  { name: "Parent", color: "bg-pink-500" },
  { name: "Entrepreneur", color: "bg-green-500" }
]

export function EmotionalJourneySlider() {
  const [sliderValue, setSliderValue] = useState([50])
  const [selectedPersona, setSelectedPersona] = useState(0)

  const currentStage = journeyStages.reduce((prev, curr) => 
    Math.abs(curr.stage - sliderValue[0]) < Math.abs(prev.stage - sliderValue[0]) ? curr : prev
  )

  const StageIcon = currentStage.icon

  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-primary mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Interactive Journey</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
          >
            Your{" "}
            <span className="text-primary">
              Transformation
            </span>
            {" "}Path
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground"
          >
            Slide to explore how AntarYatra supports you at every stage
          </motion.p>
        </div>

        {/* Persona Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <span className="text-sm text-muted-foreground self-center">I'm a:</span>
          {personas.map((persona, index) => (
            <button
              key={persona.name}
              onClick={() => setSelectedPersona(index)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedPersona === index
                  ? `${persona.color} text-white`
                  : 'bg-card/50 text-muted-foreground hover:bg-card'
              }`}
            >
              {persona.name}
            </button>
          ))}
        </motion.div>

        {/* Main Interactive Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-card border border-border rounded-3xl p-8 md:p-12">
            <div className={`absolute inset-0 bg-gradient-to-br ${currentStage.color} opacity-10 rounded-3xl transition-all duration-500`} />
            
            <div className="relative">
              {/* Current Stage Display */}
              <div className="text-center mb-12">
                <motion.div
                  key={currentStage.stage}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6"
                >
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${currentStage.color} mb-4`}>
                    <StageIcon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-6xl mb-4">{currentStage.emoji}</div>
                </motion.div>
                
                <motion.h3
                  key={currentStage.label}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl md:text-3xl font-bold mb-3"
                >
                  {currentStage.label}
                </motion.h3>
                
                <motion.p
                  key={currentStage.description}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-muted-foreground mb-8"
                >
                  {currentStage.description}
                </motion.p>

                {/* Features */}
                <motion.div
                  key={currentStage.stage + 'features'}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap justify-center gap-3"
                >
                  {currentStage.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`px-4 py-2 rounded-full bg-gradient-to-r ${currentStage.color} text-white text-sm font-medium`}
                    >
                      {feature}
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Slider */}
              <div className="space-y-4">
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Feeling Lost</span>
                  <span>Thriving</span>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{Math.round(sliderValue[0])}%</span> of your journey
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            No matter where you are in your journey, AntarYatra meets you there
          </p>
        </motion.div>
      </div>
    </section>
  )
}

