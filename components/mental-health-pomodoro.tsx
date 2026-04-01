"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Timer, Play, Pause, RotateCcw, Coffee, Brain, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface PomodoroSession {
  type: "work" | "break" | "longBreak"
  duration: number
  label: string
}

const sessions: { [key: string]: PomodoroSession } = {
  work: { type: "work", duration: 25 * 60, label: "Focus Time" },
  break: { type: "break", duration: 5 * 60, label: "Short Break" },
  longBreak: { type: "longBreak", duration: 15 * 60, label: "Long Break" },
}

const breakActivities = [
  "🧘 Take 3 deep breaths",
  "💧 Drink a glass of water",
  "🚶 Walk around for a minute",
  "👀 Look at something 20 feet away (20-20-20 rule)",
  "🙆 Do shoulder rolls and neck stretches",
  "🌱 Water your plants",
  "🎵 Listen to a calming song",
  "📝 Write one thing you're grateful for",
  "🌅 Step outside for fresh air",
  "😊 Smile and relax your jaw",
]

export function MentalHealthPomodoro() {
  const [currentSession, setCurrentSession] = useState<PomodoroSession>(sessions.work)
  const [timeLeft, setTimeLeft] = useState(sessions.work.duration)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [currentBreakActivity, setCurrentBreakActivity] = useState(breakActivities[0])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // Session complete
      handleSessionComplete()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const handleSessionComplete = () => {
    setIsRunning(false)

    if (currentSession.type === "work") {
      setSessionsCompleted((prev) => prev + 1)
      // After 4 work sessions, take a long break
      const nextSession = (sessionsCompleted + 1) % 4 === 0 ? sessions.longBreak : sessions.break
      setCurrentSession(nextSession)
      setTimeLeft(nextSession.duration)
      // Random break activity
      setCurrentBreakActivity(breakActivities[Math.floor(Math.random() * breakActivities.length)])
    } else {
      // Break complete, back to work
      setCurrentSession(sessions.work)
      setTimeLeft(sessions.work.duration)
    }
  }

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  
  const handleReset = () => {
    setIsRunning(false)
    setCurrentSession(sessions.work)
    setTimeLeft(sessions.work.duration)
    setSessionsCompleted(0)
  }

  const handleSkip = () => {
    setTimeLeft(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((currentSession.duration - timeLeft) / currentSession.duration) * 100

  return (
    <section className="relative py-6 md:py-8 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500 mb-3 text-sm font-medium">
            <Timer className="w-3.5 h-3.5" />
            Productivity Timer
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Mindful Productivity Timer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Boost focus and prevent burnout with wellness-integrated work intervals
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-3">
                <Timer className="w-4 h-4" />
                <span className="text-sm font-medium">Pomodoro Session</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Work Smart, Rest Well
              </h3>
              <p className="text-muted-foreground">
                Balanced productivity with mindful breaks to prevent burnout
              </p>
            </div>

            {/* Timer Display */}
            <div className="relative mb-8">
              {/* Progress Circle */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
                <svg className="transform -rotate-90 w-full h-full">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/30"
                  />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className={
                      currentSession.type === "work"
                        ? "text-primary"
                        : "text-green-500"
                    }
                    strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                    strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>

                {/* Timer Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl md:text-7xl font-bold mb-2">{formatTime(timeLeft)}</div>
                  <div className="text-xl font-semibold text-muted-foreground">
                    {currentSession.label}
                  </div>
                  {currentSession.type === "work" && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Session {sessionsCompleted % 4 + 1}/4
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="px-10"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  size="lg"
                  variant="outline"
                  className="px-10"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={handleReset} size="lg" variant="outline">
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSkip} size="lg" variant="ghost">
                Skip →
              </Button>
            </div>

            {/* Break Activity Suggestion */}
            {currentSession.type !== "work" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-lg bg-green-500/10 border border-green-500/20"
              >
                <div className="flex items-start gap-3">
                  <Coffee className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-500 mb-1">Break Time!</h4>
                    <p className="text-sm mb-3">Try this mindful activity:</p>
                    <div className="text-lg font-medium">{currentBreakActivity}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{sessionsCompleted}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.floor(sessionsCompleted * 25 / 60)}h {(sessionsCompleted * 25) % 60}m
                </div>
                <div className="text-sm text-muted-foreground">Focus Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.floor(sessionsCompleted / 4)}
                </div>
                <div className="text-sm text-muted-foreground">Cycles</div>
              </div>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-6 bg-muted/30 mt-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              The Mental Health Pomodoro Method
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Work in focused 25-minute intervals with mindful breaks. This technique prevents mental fatigue,
              maintains focus, and promotes sustainable productivity while protecting your mental health.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>25 min focus sessions</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>5 min mindful breaks</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>15 min rest after 4 cycles</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
