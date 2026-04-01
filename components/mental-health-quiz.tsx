"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, CheckCircle2, XCircle, RotateCcw, Trophy, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: "myth" | "fact" | "coping"
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Mental health problems are a sign of weakness",
    options: ["True", "False"],
    correctAnswer: 1,
    explanation: "False! Mental health conditions are medical conditions, not character flaws. They're caused by a complex mix of genetics, biology, environment, and life experiences.",
    category: "myth",
  },
  {
    id: 2,
    question: "Which of these is a healthy coping mechanism?",
    options: ["Avoiding all stressful situations", "Deep breathing exercises", "Isolating yourself", "Ignoring your feelings"],
    correctAnswer: 1,
    explanation: "Deep breathing exercises are a proven technique to reduce stress and anxiety. While avoidance might feel easier, healthy coping involves facing challenges with proper support.",
    category: "coping",
  },
  {
    id: 3,
    question: "Approximately how many people will experience a mental health condition in their lifetime?",
    options: ["1 in 100", "1 in 20", "1 in 5", "1 in 2"],
    correctAnswer: 2,
    explanation: "About 1 in 5 people (20%) will experience a mental health condition in their lifetime. Mental health challenges are incredibly common!",
    category: "fact",
  },
  {
    id: 4,
    question: "Talking about suicide will encourage someone to do it",
    options: ["True", "False"],
    correctAnswer: 1,
    explanation: "False! Talking openly about suicide can actually save lives. It shows you care and gives the person permission to share their feelings.",
    category: "myth",
  },
  {
    id: 5,
    question: "Which hormone is often called the 'stress hormone'?",
    options: ["Dopamine", "Serotonin", "Cortisol", "Oxytocin"],
    correctAnswer: 2,
    explanation: "Cortisol is known as the stress hormone. While it's helpful in small amounts, chronic high levels can impact mental and physical health.",
    category: "fact",
  },
  {
    id: 6,
    question: "People with mental illness are violent and dangerous",
    options: ["True", "False"],
    correctAnswer: 1,
    explanation: "False! People with mental health conditions are far more likely to be victims of violence than perpetrators. This is a harmful stigma.",
    category: "myth",
  },
  {
    id: 7,
    question: "How much sleep do adults need for optimal mental health?",
    options: ["4-5 hours", "6-7 hours", "7-9 hours", "10-12 hours"],
    correctAnswer: 2,
    explanation: "Most adults need 7-9 hours of sleep per night. Good sleep is crucial for emotional regulation, stress management, and overall mental health.",
    category: "fact",
  },
  {
    id: 8,
    question: "Which activity has been proven to reduce symptoms of depression and anxiety?",
    options: ["Watching TV", "Regular exercise", "Sleeping more", "Shopping"],
    correctAnswer: 1,
    explanation: "Regular exercise has been scientifically proven to reduce depression and anxiety symptoms. It releases endorphins and improves overall mood!",
    category: "coping",
  },
]

export function MentalHealthQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])

  const question = quizQuestions[currentQuestion]
  const isCorrect = selectedAnswer === question.correctAnswer

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return // Already answered
    
    setSelectedAnswer(answerIndex)
    setShowExplanation(true)
    
    if (answerIndex === question.correctAnswer) {
      setScore(score + 1)
    }
    
    setAnsweredQuestions([...answeredQuestions, currentQuestion])
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setIsComplete(true)
    }
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setIsComplete(false)
    setAnsweredQuestions([])
  }

  const percentage = Math.round((score / quizQuestions.length) * 100)

  return (
    <section className="relative py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {!isComplete ? (
            <Card className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-3">
                  <Brain className="w-4 h-4" />
                  <span className="text-sm font-medium">Mental Health Quiz</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  Test Your Knowledge
                </h2>
                <p className="text-muted-foreground">
                  Learn fun facts and bust common myths about mental health
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Question {currentQuestion + 1} of {quizQuestions.length}</span>
                  <span className="text-sm text-muted-foreground">Score: {score}/{answeredQuestions.length}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  question.category === "myth" ? "bg-red-500/10 text-red-500" :
                  question.category === "fact" ? "bg-blue-500/10 text-blue-500" :
                  "bg-green-500/10 text-green-500"
                }`}>
                  {question.category === "myth" ? "🚫 Myth Busting" :
                   question.category === "fact" ? "📚 Mental Health Fact" :
                   "🛠️ Coping Strategy"}
                </span>
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold">{question.question}</h3>

                  {/* Answer Options */}
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selectedAnswer === null
                            ? "border-border hover:border-primary hover:bg-primary/5"
                            : selectedAnswer === index
                            ? index === question.correctAnswer
                              ? "border-green-500 bg-green-500/10"
                              : "border-red-500 bg-red-500/10"
                            : index === question.correctAnswer && showExplanation
                            ? "border-green-500 bg-green-500/10"
                            : "border-border opacity-50"
                        }`}
                        whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                        whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{option}</span>
                          {selectedAnswer !== null && (
                            <>
                              {index === question.correctAnswer && (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              )}
                              {selectedAnswer === index && index !== question.correctAnswer && (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Explanation */}
                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`p-4 rounded-lg border ${
                          isCorrect
                            ? "bg-green-500/10 border-green-500/20"
                            : "bg-blue-500/10 border-blue-500/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Lightbulb className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            isCorrect ? "text-green-500" : "text-blue-500"
                          }`} />
                          <div>
                            <h4 className={`font-semibold mb-1 ${
                              isCorrect ? "text-green-500" : "text-blue-500"
                            }`}>
                              {isCorrect ? "Correct! 🎉" : "Good try!"}
                            </h4>
                            <p className="text-sm text-muted-foreground">{question.explanation}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Next Button */}
                  {showExplanation && (
                    <Button onClick={handleNext} className="w-full" size="lg">
                      {currentQuestion < quizQuestions.length - 1 ? "Next Question →" : "See Results →"}
                    </Button>
                  )}
                </motion.div>
              </AnimatePresence>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className={`w-24 h-24 rounded-full bg-gradient-to-r ${
                    percentage >= 80 ? "from-green-500 to-emerald-500" :
                    percentage >= 60 ? "from-blue-500 to-cyan-500" :
                    "from-orange-500 to-red-500"
                  } flex items-center justify-center mx-auto mb-4`}
                >
                  <Trophy className="w-12 h-12 text-white" />
                </motion.div>

                <h3 className="text-3xl font-bold mb-2">Quiz Complete!</h3>
                <div className="text-6xl font-bold text-primary mb-4">{percentage}%</div>
                <p className="text-xl mb-6">
                  You scored {score} out of {quizQuestions.length}
                </p>

                <div className="p-6 rounded-lg bg-muted/50 mb-8 max-w-md mx-auto">
                  <p className="text-sm text-muted-foreground">
                    {percentage >= 80
                      ? "🌟 Excellent! You have great mental health awareness!"
                      : percentage >= 60
                      ? "💪 Good job! You're learning important mental health facts!"
                      : "🌱 Keep learning! Mental health education is a journey!"}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleReset} size="lg">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} size="lg" variant="outline">
                    Explore More Tools
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Info Card */}
          {!isComplete && (
            <Card className="p-6 bg-muted/30 mt-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Why Mental Health Education Matters
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Understanding mental health helps reduce stigma, recognize warning signs, and support yourself and others effectively.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Reduces stigma</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Builds awareness</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Saves lives</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
