"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wind, Play, Pause, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface BreathingTechnique {
  id: string
  name: string
  description: string
  pattern: { phase: string; duration: number; instruction: string }[]
  benefits: string[]
  color: string
}

const techniques: BreathingTechnique[] = [
  {
    id: "4-7-8",
    name: "4-7-8 Technique",
    description: "Dr. Weil's relaxation breathing for sleep and anxiety",
    pattern: [
      { phase: "Inhale", duration: 4, instruction: "Breathe in through your nose" },
      { phase: "Hold", duration: 7, instruction: "Hold your breath gently" },
      { phase: "Exhale", duration: 8, instruction: "Exhale slowly through your mouth" },
    ],
    benefits: ["Reduces anxiety", "Helps with sleep", "Calms nervous system"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "box",
    name: "Box Breathing",
    description: "Navy SEAL technique for focus and stress relief",
    pattern: [
      { phase: "Inhale", duration: 4, instruction: "Breathe in deeply" },
      { phase: "Hold", duration: 4, instruction: "Hold your breath" },
      { phase: "Exhale", duration: 4, instruction: "Breathe out slowly" },
      { phase: "Hold", duration: 4, instruction: "Hold empty lungs" },
    ],
    benefits: ["Improves focus", "Reduces stress", "Regulates emotions"],
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "calm",
    name: "2-Minute Calm",
    description: "Quick calming technique for immediate relief",
    pattern: [
      { phase: "Inhale", duration: 3, instruction: "Breathe in peace" },
      { phase: "Hold", duration: 3, instruction: "Hold the calm" },
      { phase: "Exhale", duration: 6, instruction: "Release all tension" },
    ],
    benefits: ["Quick stress relief", "Easy to do anywhere", "Instant calm"],
    color: "from-green-500 to-emerald-500",
  },
]

export function BreathingExercises() {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(techniques[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(selectedTechnique.pattern[0].duration)
  const [cycleCount, setCycleCount] = useState(0)

  const currentPhase = selectedTechnique.pattern[currentPhaseIndex]

  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          const nextPhaseIndex = (currentPhaseIndex + 1) % selectedTechnique.pattern.length
          
          if (nextPhaseIndex === 0) {
            setCycleCount((c) => c + 1)
          }
          
          setCurrentPhaseIndex(nextPhaseIndex)
          return selectedTechnique.pattern[nextPhaseIndex].duration
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying, currentPhaseIndex, selectedTechnique])

  const handleStart = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentPhaseIndex(0)
    setTimeLeft(selectedTechnique.pattern[0].duration)
    setCycleCount(0)
  }

  const handleTechniqueChange = (technique: BreathingTechnique) => {
    setSelectedTechnique(technique)
    handleReset()
  }

  // Calculate circle scale for animation
  const getCircleScale = () => {
    const totalDuration = currentPhase.duration
    const progress = (totalDuration - timeLeft) / totalDuration
    
    if (currentPhase.phase === "Inhale") {
      return 0.5 + (progress * 0.5) // Grow from 0.5 to 1
    } else if (currentPhase.phase === "Exhale") {
      return 1 - (progress * 0.5) // Shrink from 1 to 0.5
    }
    return 1 // Hold stays at full size
  }

  return (
    <section className="relative py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 mb-3 text-sm font-medium">
            <Wind className="w-3.5 h-3.5" />
            Breathing Techniques
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Guided Breathing Exercises
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Clinically-proven breathing techniques to reduce stress and anxiety in minutes
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {techniques.map((technique) => (
            <Card
              key={technique.id}
              className={`p-6 cursor-pointer transition-all hover:shadow-sm transition-shadow ${
                selectedTechnique.id === technique.id
                  ? "border-primary shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/30"
              }`}
              onClick={() => handleTechniqueChange(technique)}
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${technique.color} mb-4 flex items-center justify-center`}>
                <Wind className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{technique.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{technique.description}</p>
              <div className="space-y-1">
                {technique.benefits.map((benefit, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    {benefit}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 md:p-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            {/* Breathing Circle Animation */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 mb-6">
              <motion.div
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${selectedTechnique.color} opacity-20 blur-xl`}
                animate={{
                  scale: isPlaying ? getCircleScale() : 0.5,
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className={`absolute inset-0 rounded-full border-4 border-primary flex items-center justify-center bg-gradient-to-r ${selectedTechnique.color} bg-opacity-10`}
                animate={{
                  scale: isPlaying ? getCircleScale() : 0.5,
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                }}
              >
                <div className="text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPhaseIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-2"
                    >
                      <div className="text-5xl md:text-7xl font-bold">{timeLeft}</div>
                      <div className="text-xl md:text-2xl font-semibold text-primary">
                        {currentPhase.phase}
                      </div>
                      <div className="text-sm text-muted-foreground px-4">
                        {currentPhase.instruction}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Cycle Counter */}
            <div className="mb-6 text-center">
              <div className="text-sm text-muted-foreground">Cycles Completed</div>
              <div className="text-3xl font-bold text-primary">{cycleCount}</div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {!isPlaying ? (
                <Button
                  size="lg"
                  onClick={handleStart}
                  className={`bg-gradient-to-r ${selectedTechnique.color} hover:opacity-90 text-white px-8`}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handlePause}
                  variant="outline"
                  className="px-8"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
              <Button
                size="lg"
                onClick={handleReset}
                variant="outline"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 rounded-lg bg-muted/50 max-w-2xl">
              <p className="text-sm text-muted-foreground text-center">
                <strong>💡 Tip:</strong> Find a quiet space, sit comfortably, and focus only on your breath. 
                Practice for 2-5 minutes daily for best results.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
