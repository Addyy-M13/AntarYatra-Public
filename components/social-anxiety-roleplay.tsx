"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Brain, ArrowRight, CheckCircle2, RotateCcw, Lightbulb, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const cognitiveDistortions = [
  { name: "All-or-Nothing", description: "Seeing things in black and white" },
  { name: "Overgeneralization", description: "Making broad conclusions from single events" },
  { name: "Mental Filter", description: "Focusing only on negatives" },
  { name: "Catastrophizing", description: "Expecting the worst outcome" },
  { name: "Mind Reading", description: "Assuming you know what others think" },
  { name: "Fortune Telling", description: "Predicting negative futures" },
]

export function SocialAnxietyRolePlay() {
  const [scenario, setScenario] = useState<string | null>(null)
  const [negativeThought, setNegativeThought] = useState("")
  const [evidence, setEvidence] = useState("")
  const [reframe, setReframe] = useState("")
  const [step, setStep] = useState(1)
  const [isComplete, setIsComplete] = useState(false)

  const scenarios = [
    {
      id: "job-interview",
      title: "Job Interview",
      emoji: "💼",
      situation: "You have an important job interview tomorrow and feel anxious about it.",
      commonThoughts: [
        "I'm going to mess this up",
        "They'll think I'm incompetent",
        "I'll forget everything I want to say",
      ],
    },
    {
      id: "social-gathering",
      title: "Social Event",
      emoji: "🎉",
      situation: "You're invited to a party where you don't know many people.",
      commonThoughts: [
        "Nobody will want to talk to me",
        "I'll say something embarrassing",
        "Everyone will judge me",
      ],
    },
    {
      id: "difficult-conversation",
      title: "Difficult Talk",
      emoji: "💬",
      situation: "You need to have a tough conversation with a friend or colleague.",
      commonThoughts: [
        "They'll get angry with me",
        "This will ruin our relationship",
        "I can't handle conflict",
      ],
    },
    {
      id: "presentation",
      title: "Public Speaking",
      emoji: "🎤",
      situation: "You need to give a presentation at work or school.",
      commonThoughts: [
        "I'll freeze up and forget everything",
        "Everyone will notice I'm nervous",
        "I'm a terrible speaker",
      ],
    },
  ]

  const selectedScenario = scenarios.find((s) => s.id === scenario)

  const handleReset = () => {
    setScenario(null)
    setNegativeThought("")
    setEvidence("")
    setReframe("")
    setStep(1)
    setIsComplete(false)
  }

  const handleComplete = () => {
    setIsComplete(true)
  }

  return (
    <section className="relative py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {!scenario ? (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-500 mb-3">
                  <Brain className="w-4 h-4" />
                  <span className="text-sm font-medium">Thought Reframing (CBT)</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  Challenge Anxious Thoughts
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Learn to identify and reframe negative thinking patterns using Cognitive Behavioral Therapy techniques
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {scenarios.map((s) => (
                  <Card
                    key={s.id}
                    className="p-6 cursor-pointer hover:shadow-lg hover:shadow-sm transition-shadow transition-all border-2 border-transparent hover:border-primary/30"
                    onClick={() => setScenario(s.id)}
                  >
                    <div className="text-4xl mb-3">{s.emoji}</div>
                    <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.situation}</p>
                  </Card>
                ))}
              </div>
            </div>
          ) : !isComplete ? (
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-3xl mb-2">{selectedScenario?.emoji}</div>
                  <h3 className="text-2xl font-bold">{selectedScenario?.title}</h3>
                  <p className="text-muted-foreground">{selectedScenario?.situation}</p>
                </div>
                <Button onClick={handleReset} variant="ghost" size="sm">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        step >= s
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`h-1 w-12 ${
                          step > s ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-orange-500 mb-1">Step 1: Identify the Thought</h4>
                        <p className="text-sm text-muted-foreground">
                          What negative or anxious thought comes to mind in this situation?
                        </p>
                      </div>
                    </div>

                    <Textarea
                      value={negativeThought}
                      onChange={(e) => setNegativeThought(e.target.value)}
                      placeholder="e.g., I'm going to completely mess this up and look like a fool..."
                      rows={4}
                      className="resize-none"
                    />

                    <div className="text-sm text-muted-foreground">
                      Common thoughts:
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedScenario?.commonThoughts.map((thought, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => setNegativeThought(thought)}
                          >
                            {thought}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => setStep(2)}
                      disabled={!negativeThought.trim()}
                      className="w-full"
                    >
                      Next: Examine the Evidence
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-500 mb-1">Step 2: Challenge with Evidence</h4>
                        <p className="text-sm text-muted-foreground">
                          What evidence contradicts this thought? What's a more realistic perspective?
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="text-sm font-medium mb-1">Your thought:</div>
                      <div className="text-muted-foreground italic">"{negativeThought}"</div>
                    </div>

                    <Textarea
                      value={evidence}
                      onChange={(e) => setEvidence(e.target.value)}
                      placeholder="e.g., I've handled similar situations before successfully. Most people are understanding. One mistake doesn't define me..."
                      rows={4}
                      className="resize-none"
                    />

                    <div className="flex gap-2">
                      <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                        ← Back
                      </Button>
                      <Button
                        onClick={() => setStep(3)}
                        disabled={!evidence.trim()}
                        className="flex-1"
                      >
                        Next: Reframe
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-500 mb-1">Step 3: Create a Balanced Thought</h4>
                        <p className="text-sm text-muted-foreground">
                          Write a more balanced, realistic thought based on the evidence
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-muted/50 border border-border">
                        <div className="text-sm font-medium mb-1">Original thought:</div>
                        <div className="text-muted-foreground italic line-through">"{negativeThought}"</div>
                      </div>

                      <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                        <div className="text-sm font-medium mb-1 text-blue-500">Evidence:</div>
                        <div className="text-sm text-muted-foreground">{evidence}</div>
                      </div>
                    </div>

                    <Textarea
                      value={reframe}
                      onChange={(e) => setReframe(e.target.value)}
                      placeholder="e.g., While I feel nervous, I've prepared well and can handle this. It's okay to be imperfect. I'll do my best and that's enough."
                      rows={4}
                      className="resize-none"
                    />

                    <div className="flex gap-2">
                      <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                        ← Back
                      </Button>
                      <Button
                        onClick={handleComplete}
                        disabled={!reframe.trim()}
                        className="flex-1 bg-green-500 hover:bg-green-600"
                      >
                        Complete Exercise
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}
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
                  className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>

                <h3 className="text-3xl font-bold mb-3">Thought Successfully Reframed! 🎉</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  You've transformed an anxious thought into a balanced perspective
                </p>

                <div className="space-y-4 text-left max-w-2xl mx-auto mb-6">
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="text-sm font-medium text-red-500 mb-1">❌ Old Thought:</div>
                    <div className="text-sm italic">"{negativeThought}"</div>
                  </div>

                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="text-sm font-medium text-green-500 mb-1">✅ New Balanced Thought:</div>
                    <div className="text-sm font-semibold">"{reframe}"</div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-6 mb-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>💡 Practice Tip:</strong> The more you practice reframing, the more automatic it becomes.
                    Try this exercise whenever you notice anxious or negative thoughts.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleReset} size="lg">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Practice Another Scenario
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
                About Cognitive Reframing (CBT)
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Cognitive Behavioral Therapy helps you identify and challenge distorted thinking patterns.
                By examining evidence and creating balanced thoughts, you can reduce anxiety and improve emotional wellbeing.
              </p>
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Identify negative patterns</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Challenge with evidence</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <span>Create balanced thoughts</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
