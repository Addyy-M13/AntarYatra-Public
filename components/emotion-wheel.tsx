"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, RotateCcw, Sparkles, Info, Brain } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Emotion {
  primary: string
  secondary: string[]
  tertiary: { [key: string]: string[] }
  color: string
  description: string
}

const emotions: Emotion[] = [
  {
    primary: "Joy",
    secondary: ["Optimistic", "Trusting", "Peaceful"],
    tertiary: {
      Optimistic: ["Hopeful", "Inspired"],
      Trusting: ["Sensitive", "Intimate"],
      Peaceful: ["Loving", "Thankful"],
    },
    color: "from-yellow-400 to-orange-400",
    description: "Feeling happy, content, and positive about life",
  },
  {
    primary: "Sadness",
    secondary: ["Lonely", "Vulnerable", "Despair"],
    tertiary: {
      Lonely: ["Isolated", "Abandoned"],
      Vulnerable: ["Victimized", "Fragile"],
      Despair: ["Grief", "Powerless"],
    },
    color: "from-blue-400 to-blue-600",
    description: "Feeling down, disconnected, or experiencing loss",
  },
  {
    primary: "Fear",
    secondary: ["Scared", "Anxious", "Insecure"],
    tertiary: {
      Scared: ["Helpless", "Frightened"],
      Anxious: ["Overwhelmed", "Worried"],
      Insecure: ["Inadequate", "Inferior"],
    },
    color: "from-purple-400 to-purple-600",
    description: "Feeling threatened, worried, or unsafe",
  },
  {
    primary: "Anger",
    secondary: ["Mad", "Aggressive", "Frustrated"],
    tertiary: {
      Mad: ["Furious", "Jealous"],
      Aggressive: ["Provoked", "Hostile"],
      Frustrated: ["Irritated", "Annoyed"],
    },
    color: "from-red-400 to-red-600",
    description: "Feeling irritated, upset, or hostile",
  },
  {
    primary: "Disgust",
    secondary: ["Disapproving", "Disappointed", "Awful"],
    tertiary: {
      Disapproving: ["Judgmental", "Loathing"],
      Disappointed: ["Appalled", "Revolted"],
      Awful: ["Nauseated", "Detestable"],
    },
    color: "from-green-400 to-green-600",
    description: "Feeling aversion or strong disapproval",
  },
  {
    primary: "Surprise",
    secondary: ["Startled", "Confused", "Amazed"],
    tertiary: {
      Startled: ["Shocked", "Dismayed"],
      Confused: ["Disillusioned", "Perplexed"],
      Amazed: ["Astonished", "Awe-struck"],
    },
    color: "from-cyan-400 to-teal-400",
    description: "Feeling caught off guard or unexpected",
  },
]

export function EmotionWheel() {
  const [selectedPrimary, setSelectedPrimary] = useState<Emotion | null>(null)
  const [selectedSecondary, setSelectedSecondary] = useState<string | null>(null)
  const [selectedTertiary, setSelectedTertiary] = useState<string | null>(null)

  const handleReset = () => {
    setSelectedPrimary(null)
    setSelectedSecondary(null)
    setSelectedTertiary(null)
  }

  const getCurrentDescription = () => {
    if (!selectedPrimary) return "Click on any emotion to explore what you're feeling"
    if (selectedTertiary) return `You're identifying a specific feeling of ${selectedTertiary.toLowerCase()}`
    if (selectedSecondary) return `You're narrowing down to feeling ${selectedSecondary.toLowerCase()}`
    return selectedPrimary.description
  }

  return (
    <section className="relative py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-500 mb-3 text-sm font-medium">
            <Brain className="w-3.5 h-3.5" />
            Emotion Identification
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Interactive Emotion Wheel
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Develop emotional intelligence by identifying and understanding your feelings
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Emotion Wheel Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left: Interactive Wheel */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {emotions.map((emotion) => (
                  <motion.button
                    key={emotion.primary}
                    onClick={() => {
                      setSelectedPrimary(emotion)
                      setSelectedSecondary(null)
                      setSelectedTertiary(null)
                    }}
                    className={`p-6 rounded-2xl text-center transition-all ${
                      selectedPrimary?.primary === emotion.primary
                        ? "ring-4 ring-primary shadow-xl scale-105"
                        : "hover:shadow-sm transition-shadow"
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${
                        emotion.color.includes("yellow")
                          ? "#fbbf24, #f97316"
                          : emotion.color.includes("blue")
                          ? "#60a5fa, #2563eb"
                          : emotion.color.includes("purple")
                          ? "#a78bfa, #7c3aed"
                          : emotion.color.includes("red")
                          ? "#f87171, #dc2626"
                          : emotion.color.includes("green")
                          ? "#4ade80, #16a34a"
                          : "#22d3ee, #14b8a6"
                      })`,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-white font-bold text-lg">{emotion.primary}</div>
                  </motion.button>
                ))}
              </div>

              {/* Secondary Emotions */}
              <AnimatePresence mode="wait">
                {selectedPrimary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3"
                  >
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span>How would you describe your {selectedPrimary.primary.toLowerCase()}?</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedPrimary.secondary.map((secondary) => (
                        <Button
                          key={secondary}
                          onClick={() => {
                            setSelectedSecondary(secondary)
                            setSelectedTertiary(null)
                          }}
                          variant={selectedSecondary === secondary ? "default" : "outline"}
                          className="h-auto py-3"
                        >
                          {secondary}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tertiary Emotions */}
              <AnimatePresence mode="wait">
                {selectedPrimary && selectedSecondary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-3"
                  >
                    <h3 className="text-lg font-semibold">More specifically:</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedPrimary.tertiary[selectedSecondary]?.map((tertiary) => (
                        <Button
                          key={tertiary}
                          onClick={() => setSelectedTertiary(tertiary)}
                          variant={selectedTertiary === tertiary ? "default" : "outline"}
                          className="h-auto py-3"
                        >
                          {tertiary}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Emotion Details */}
            <Card className="p-8 sticky top-24">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">Your Emotion</h3>
                </div>
                {selectedPrimary && (
                  <Button onClick={handleReset} variant="ghost" size="sm">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {selectedPrimary ? (
                  <motion.div
                    key={selectedPrimary.primary + selectedSecondary + selectedTertiary}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Emotion Path */}
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-white bg-gradient-to-r ${selectedPrimary.color}`}
                      >
                        {selectedPrimary.primary}
                      </span>
                      {selectedSecondary && (
                        <>
                          <span className="text-muted-foreground">→</span>
                          <span className="px-3 py-1 rounded-full bg-primary text-white">
                            {selectedSecondary}
                          </span>
                        </>
                      )}
                      {selectedTertiary && (
                        <>
                          <span className="text-muted-foreground">→</span>
                          <span className="px-3 py-1 rounded-full bg-primary text-white">
                            {selectedTertiary}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Description */}
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-muted-foreground">{getCurrentDescription()}</p>
                    </div>

                    {/* Completion Message */}
                    {selectedTertiary && (
                      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div className="space-y-2">
                            <h4 className="font-semibold text-primary">Emotion Identified!</h4>
                            <p className="text-sm text-muted-foreground">
                              Recognizing and naming your emotions is the first step to understanding and managing them.
                              Consider journaling about why you feel {selectedTertiary.toLowerCase()} right now.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tips */}
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" />
                        Helpful Tips
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>All emotions are valid and temporary</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Notice where you feel this emotion in your body</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Try breathing exercises or grounding techniques</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Talk to someone you trust about how you feel</span>
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h4 className="text-xl font-semibold mb-2">Explore Your Emotions</h4>
                    <p className="text-muted-foreground">
                      Select an emotion from the wheel to begin understanding what you're feeling
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Info Footer */}
          <Card className="p-6 bg-muted/30 mt-8">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              About the Emotion Wheel
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              The emotion wheel helps you develop emotional intelligence by identifying and naming specific feelings.
              Research shows that accurately labeling emotions reduces their intensity and improves emotional regulation.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Builds self-awareness</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Improves communication</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Enhances emotional regulation</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
