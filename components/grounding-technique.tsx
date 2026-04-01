"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Ear, Hand, Droplet, Apple, ArrowRight, CheckCircle2, RotateCcw, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface GroundingStep {
  count: number
  sense: string
  icon: any
  prompt: string
  placeholder: string
  color: string
}

const steps: GroundingStep[] = [
  {
    count: 5,
    sense: "See",
    icon: Eye,
    prompt: "Name 5 things you can see around you",
    placeholder: "e.g., A blue chair, my phone, a plant...",
    color: "from-blue-500 to-cyan-500",
  },
  {
    count: 4,
    sense: "Touch",
    icon: Hand,
    prompt: "Name 4 things you can touch or feel",
    placeholder: "e.g., Soft fabric, cold floor, smooth desk...",
    color: "from-purple-500 to-pink-500",
  },
  {
    count: 3,
    sense: "Hear",
    icon: Ear,
    prompt: "Name 3 things you can hear right now",
    placeholder: "e.g., Birds chirping, fan humming, distant traffic...",
    color: "from-green-500 to-emerald-500",
  },
  {
    count: 2,
    sense: "Smell",
    icon: Droplet,
    prompt: "Name 2 things you can smell (or like to smell)",
    placeholder: "e.g., Fresh coffee, my soap, air after rain...",
    color: "from-orange-500 to-red-500",
  },
  {
    count: 1,
    sense: "Taste",
    icon: Apple,
    prompt: "Name 1 thing you can taste (or would like to taste)",
    placeholder: "e.g., Mint from my toothpaste, tea, chocolate...",
    color: "from-pink-500 to-rose-500",
  },
]

export function GroundingTechnique() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [responses, setResponses] = useState<{ [key: number]: string[] }>({})
  const [currentInput, setCurrentInput] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  const currentStep = steps[currentStepIndex]
  const currentResponses = responses[currentStepIndex] || []

  const handleAddResponse = () => {
    if (!currentInput.trim()) return

    const newResponses = {
      ...responses,
      [currentStepIndex]: [...currentResponses, currentInput.trim()],
    }
    setResponses(newResponses)
    setCurrentInput("")

    // Check if current step is complete
    if (currentResponses.length + 1 >= currentStep.count) {
      if (currentStepIndex < steps.length - 1) {
        // Move to next step after a short delay
        setTimeout(() => {
          setCurrentStepIndex(currentStepIndex + 1)
        }, 500)
      } else {
        // Exercise complete
        setTimeout(() => {
          setIsComplete(true)
        }, 500)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddResponse()
    }
  }

  const handleReset = () => {
    setCurrentStepIndex(0)
    setResponses({})
    setCurrentInput("")
    setIsComplete(false)
  }

  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100

  return (
    <section className="relative py-8 md:py-12 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-3">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">5-4-3-2-1 Grounding</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Ground Yourself in the <span className="text-primary">Present Moment</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Use your five senses to anchor yourself when feeling anxious, overwhelmed, or disconnected
          </p>
        </div>

        {!isComplete ? (
          <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  Step {currentStepIndex + 1} of {steps.length}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Steps Overview */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {steps.map((step, idx) => {
                const Icon = step.icon
                const isCompleted = idx < currentStepIndex
                const isCurrent = idx === currentStepIndex
                
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-center transition-all ${
                      isCurrent
                        ? "bg-primary/10 border-2 border-primary"
                        : isCompleted
                        ? "bg-primary/5 border border-primary/20"
                        : "bg-muted/50 border border-border"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${isCurrent ? "text-primary" : isCompleted ? "text-primary/60" : "text-muted-foreground"}`} />
                    <div className={`text-xs font-bold ${isCurrent ? "text-primary" : isCompleted ? "text-primary/60" : "text-muted-foreground"}`}>
                      {step.count}
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">{step.sense}</div>
                  </div>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentStep.color} flex items-center justify-center flex-shrink-0`}>
                      <currentStep.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-1">
                        {currentStep.count} Things You Can {currentStep.sense}
                      </h3>
                      <p className="text-muted-foreground">{currentStep.prompt}</p>
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <Input
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={currentStep.placeholder}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        onClick={handleAddResponse}
                        disabled={!currentInput.trim()}
                        className={`bg-gradient-to-r ${currentStep.color} hover:opacity-90`}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Responses List */}
                  <div className="space-y-2">
                    {Array.from({ length: currentStep.count }).map((_, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-4 rounded-lg border ${
                          currentResponses[idx]
                            ? "border-primary/20 bg-primary/5"
                            : "border-dashed border-muted-foreground/20 bg-muted/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {currentResponses[idx] ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                              <span className="text-foreground">{currentResponses[idx]}</span>
                            </>
                          ) : (
                            <>
                              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                              <span className="text-muted-foreground italic">
                                {currentStep.sense} #{idx + 1}
                              </span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    {currentResponses.length} of {currentStep.count} completed
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-8 md:p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
              
              <h3 className="text-3xl font-bold mb-3">Grounding Complete! 🎉</h3>
              <p className="text-lg text-muted-foreground mb-6">
                You've successfully connected with the present moment through your five senses.
                How do you feel now?
              </p>

              <div className="bg-muted/50 rounded-lg p-6 mb-6">
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Remember:</strong> This technique can be used anytime you feel:
                </p>
                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  <div className="p-2 bg-background rounded">😰 Anxious</div>
                  <div className="p-2 bg-background rounded">😵 Overwhelmed</div>
                  <div className="p-2 bg-background rounded">😶‍🌫️ Disconnected</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleReset}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Practice Again
                </Button>
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  size="lg"
                  variant="outline"
                >
                  Explore More Tools
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Info Card */}
        {!isComplete && (
          <div className="max-w-3xl mx-auto mt-6">
            <Card className="p-6 bg-muted/30">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                How the 5-4-3-2-1 Technique Works
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                This grounding technique helps you shift focus from anxious thoughts to your immediate
                surroundings, bringing you back to the present moment and reducing anxiety or panic.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Activates your senses to anchor you</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Interrupts anxiety spirals</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Helps during panic attacks</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Works anytime, anywhere</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}
