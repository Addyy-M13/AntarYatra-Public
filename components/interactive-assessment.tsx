"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Heart, Smile, Zap, ChevronRight, RotateCcw } from "lucide-react"

interface Question {
  id: number
  question: string
  options: { text: string; value: number; emoji: string }[]
}

const questions: Question[] = [
  {
    id: 1,
    question: "How would you describe your stress level this week?",
    options: [
      { text: "Very Low", value: 1, emoji: "😌" },
      { text: "Low", value: 2, emoji: "🙂" },
      { text: "Moderate", value: 3, emoji: "😐" },
      { text: "High", value: 4, emoji: "😰" },
      { text: "Very High", value: 5, emoji: "😫" },
    ],
  },
  {
    id: 2,
    question: "How well are you sleeping lately?",
    options: [
      { text: "Excellent", value: 1, emoji: "😴" },
      { text: "Good", value: 2, emoji: "😊" },
      { text: "Fair", value: 3, emoji: "😑" },
      { text: "Poor", value: 4, emoji: "😔" },
      { text: "Very Poor", value: 5, emoji: "😞" },
    ],
  },
  {
    id: 3,
    question: "How often do you feel overwhelmed?",
    options: [
      { text: "Rarely", value: 1, emoji: "✨" },
      { text: "Sometimes", value: 2, emoji: "🌤️" },
      { text: "Often", value: 3, emoji: "☁️" },
      { text: "Very Often", value: 4, emoji: "⛈️" },
      { text: "Always", value: 5, emoji: "🌊" },
    ],
  },
  {
    id: 4,
    question: "How's your energy level throughout the day?",
    options: [
      { text: "High Energy", value: 1, emoji: "⚡" },
      { text: "Good", value: 2, emoji: "💪" },
      { text: "Average", value: 3, emoji: "🔋" },
      { text: "Low", value: 4, emoji: "🪫" },
      { text: "Exhausted", value: 5, emoji: "😴" },
    ],
  },
]

export function InteractiveAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    } else {
      setTimeout(() => setShowResults(true), 300)
    }
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
  }

  const calculateScore = () => {
    const total = answers.reduce((sum, val) => sum + val, 0)
    const average = total / answers.length
    
    if (average <= 2) {
      return {
        level: "Excellent",
        color: "from-green-500 to-emerald-500",
        icon: Smile,
        message: "Your mental wellness is in great shape. Keep up the excellent work!",
        tips: ["Maintain your current wellness routine", "Share your strategies with others", "Continue prioritizing self-care"],
      }
    } else if (average <= 3.5) {
      return {
        level: "Good",
        color: "from-blue-500 to-cyan-500",
        icon: Heart,
        message: "You're managing well with room for growth. Consider exploring new techniques.",
        tips: ["Practice daily meditation or breathing exercises", "Establish consistent sleep patterns", "Build stronger social connections"],
      }
    } else {
      return {
        level: "Needs Support",
        color: "from-orange-500 to-red-500",
        icon: Zap,
        message: "Your mental wellness could benefit from additional support. You're not alone.",
        tips: ["Consider consulting a mental health professional", "Practice stress management techniques daily", "Prioritize rest and self-care activities"],
      }
    }
  }

  return (
    <section className="relative py-20 md:py-32 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Brain className="w-4 h-4" />
            Interactive Assessment
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How's Your{" "}
            <span className="text-primary">
              Mental Wellness?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take this quick 4-question assessment to understand your current state
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="relative p-8 md:p-12 bg-card border-primary/20 shadow-lg">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">
                        Question {currentQuestion + 1} of {questions.length}
                      </span>
                      <div className="flex gap-1">
                        {questions.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-1.5 w-8 rounded-full transition-colors ${
                              idx <= currentQuestion ? "bg-primary" : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-8">
                      {questions[currentQuestion].question}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(option.value)}
                        className="w-full p-4 rounded-xl border-2 border-border hover:border-primary bg-card transition-all text-left group shadow-lg hover:shadow-xl"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{option.emoji}</span>
                            <span className="font-medium group-hover:text-primary transition-colors">
                              {option.text}
                            </span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {(() => {
                  const result = calculateScore()
                  const Icon = result.icon
                  return (
                    <Card className="relative p-8 md:p-12 bg-card border-primary/20 shadow-lg">
                      <div className="text-center mb-8">
                        <div className={`inline-flex p-6 rounded-full bg-gradient-to-br ${result.color} mb-6`}>
                          <Icon className="w-12 h-12 text-white" />
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold mb-4">
                          Your Wellness Level:{" "}
                          <span className={`bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
                            {result.level}
                          </span>
                        </h3>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                          {result.message}
                        </p>
                      </div>

                      <div className="space-y-4 mb-8">
                        <h4 className="font-semibold text-lg">Personalized Tips:</h4>
                        {result.tips.map((tip, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border shadow-md"
                          >
                            <div className="mt-0.5">
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-xs font-bold text-primary">{idx + 1}</span>
                              </div>
                            </div>
                            <p className="text-muted-foreground">{tip}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          onClick={resetAssessment}
                          variant="outline"
                          className="flex-1"
                          size="lg"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Take Again
                        </Button>
                        <Button className="flex-1" size="lg">
                          Join Waitlist for Full Assessment
                        </Button>
                      </div>
                    </Card>
                  )
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

