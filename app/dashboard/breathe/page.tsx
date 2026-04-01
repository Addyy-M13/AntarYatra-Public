"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wind } from "lucide-react"
import { cn } from "@/lib/utils"

type TechniqueKey = "box" | "478" | "wim"

interface Phase {
  label: string
  dur: number
  color: string
}

const TECHNIQUES: Record<TechniqueKey, { name: string; desc: string; phases: Phase[] }> = {
  box: {
    name: "Box Breathing",
    desc: "4-4-4-4 pattern, great for stress relief",
    phases: [
      { label: "Inhale", dur: 4, color: "text-blue-400" },
      { label: "Hold", dur: 4, color: "text-purple-400" },
      { label: "Exhale", dur: 4, color: "text-green-400" },
      { label: "Hold", dur: 4, color: "text-purple-400" },
    ],
  },
  "478": {
    name: "4-7-8 Technique",
    desc: "Calming breath for anxiety and sleep",
    phases: [
      { label: "Inhale", dur: 4, color: "text-blue-400" },
      { label: "Hold", dur: 7, color: "text-purple-400" },
      { label: "Exhale", dur: 8, color: "text-green-400" },
    ],
  },
  wim: {
    name: "Wim Hof",
    desc: "Energizing power breathing",
    phases: [
      { label: "Inhale", dur: 2, color: "text-blue-400" },
      { label: "Exhale", dur: 1, color: "text-green-400" },
    ],
  },
}

export default function BreathePage() {
  const [technique, setTechnique] = useState<TechniqueKey>("box")
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [countdown, setCountdown] = useState(TECHNIQUES.box.phases[0].dur)
  const [isRunning, setIsRunning] = useState(false)
  const [cycleCount, setCycleCount] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const phaseIndexRef = useRef(0)
  const countdownRef = useRef(TECHNIQUES.box.phases[0].dur)
  const cycleRef = useRef(0)

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    const phases = TECHNIQUES[technique].phases
    intervalRef.current = setInterval(() => {
      countdownRef.current -= 1
      if (countdownRef.current <= 0) {
        const nextPhase = (phaseIndexRef.current + 1) % phases.length
        if (nextPhase === 0) {
          cycleRef.current += 1
          setCycleCount(cycleRef.current)
        }
        phaseIndexRef.current = nextPhase
        countdownRef.current = phases[nextPhase].dur
        setPhaseIndex(nextPhase)
        setCountdown(phases[nextPhase].dur)
      } else {
        setCountdown(countdownRef.current)
      }
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, technique])

  const handleStart = () => {
    const phases = TECHNIQUES[technique].phases
    phaseIndexRef.current = 0
    countdownRef.current = phases[0].dur
    cycleRef.current = 0
    setPhaseIndex(0)
    setCountdown(phases[0].dur)
    setCycleCount(0)
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
    const phases = TECHNIQUES[technique].phases
    phaseIndexRef.current = 0
    countdownRef.current = phases[0].dur
    setPhaseIndex(0)
    setCountdown(phases[0].dur)
    setCycleCount(0)
    cycleRef.current = 0
  }

  const selectTechnique = (key: TechniqueKey) => {
    if (isRunning) handleStop()
    setTechnique(key)
    const phases = TECHNIQUES[key].phases
    setPhaseIndex(0)
    setCountdown(phases[0].dur)
  }

  const currentPhase = TECHNIQUES[technique].phases[phaseIndex]
  const isInhaleOrHold = currentPhase.label === "Inhale" || currentPhase.label === "Hold"
  const circleScale = isRunning ? (isInhaleOrHold ? 1.5 : 1.0) : 1.0

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Wind className="h-8 w-8 text-primary" />
          Breathing Exercises
        </h1>
        <p className="text-muted-foreground mt-1">Calm your mind with guided breathing techniques</p>
      </div>

      {/* Technique Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(Object.keys(TECHNIQUES) as TechniqueKey[]).map((key) => (
          <Card
            key={key}
            className={cn(
              "cursor-pointer transition-all hover:border-primary",
              technique === key ? "border-primary bg-primary/10" : ""
            )}
            onClick={() => selectTechnique(key)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{TECHNIQUES[key].name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{TECHNIQUES[key].desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Animated Circle */}
      <Card>
        <CardContent className="pt-8 pb-8 flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center w-48 h-48">
            <motion.div
              className="absolute rounded-full bg-primary/20 border-4 border-primary/40"
              style={{ width: 160, height: 160 }}
              animate={{ scale: circleScale }}
              transition={{ duration: currentPhase.dur * 0.9, ease: "easeInOut" }}
            />
            <div className="relative z-10 text-center">
              {isRunning ? (
                <>
                  <p className={cn("text-2xl font-bold", currentPhase.color)}>{currentPhase.label}</p>
                  <p className="text-5xl font-mono font-bold mt-1">{countdown}</p>
                </>
              ) : (
                <Wind className="h-12 w-12 text-primary/50" />
              )}
            </div>
          </div>

          {isRunning && (
            <p className="text-sm text-muted-foreground">
              Cycle {cycleCount + 1} &middot; Phase {phaseIndex + 1}/{TECHNIQUES[technique].phases.length}
            </p>
          )}

          {cycleCount > 0 && !isRunning && (
            <p className="text-sm text-muted-foreground">Completed {cycleCount} cycles</p>
          )}

          <div className="flex gap-3">
            {!isRunning ? (
              <Button onClick={handleStart} size="lg">
                Start Breathing
              </Button>
            ) : (
              <Button onClick={handleStop} variant="destructive" size="lg">
                Stop
              </Button>
            )}
          </div>

          {/* Phase indicators */}
          <div className="flex gap-2">
            {TECHNIQUES[technique].phases.map((phase, i) => (
              <div
                key={i}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border",
                  isRunning && i === phaseIndex
                    ? cn("border-current font-bold", phase.color)
                    : "border-border text-muted-foreground"
                )}
              >
                {phase.label} {phase.dur}s
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
