"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

type Phase = "inhale" | "hold" | "exhale" | "rest"

const PHASES: { phase: Phase; label: string; duration: number }[] = [
  { phase: "inhale", label: "Breathe in...",  duration: 4000 },
  { phase: "hold",   label: "Hold...",         duration: 7000 },
  { phase: "exhale", label: "Let go...",       duration: 8000 },
  { phase: "rest",   label: "",               duration: 1000 },
]

const SCALE: Record<Phase, number> = {
  inhale: 1.45,
  hold:   1.45,
  exhale: 1.0,
  rest:   1.0,
}

const OPACITY: Record<Phase, number> = {
  inhale: 0.85,
  hold:   1,
  exhale: 0.5,
  rest:   0.5,
}

const EASE = {
  inhale: "easeInOut",
  hold:   "linear",
  exhale: "easeInOut",
  rest:   "linear",
} as const

export function BreathingHero() {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const current = PHASES[phaseIndex]

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhaseIndex((i) => (i + 1) % PHASES.length)
    }, current.duration)
    return () => clearTimeout(timer)
  }, [phaseIndex, current.duration])

  const scale = SCALE[current.phase]
  const opacity = OPACITY[current.phase]
  const duration = current.duration / 1000

  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-sm mx-auto select-none">

      {/* Outermost ripple ring */}
      <motion.div
        className="absolute rounded-full border border-primary/10"
        animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: "88%", height: "88%" }}
      />

      {/* Middle ripple ring */}
      <motion.div
        className="absolute rounded-full border border-primary/15"
        animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.1, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        style={{ width: "72%", height: "72%" }}
      />

      {/* Glow blob behind the circle */}
      <motion.div
        className="absolute rounded-full bg-primary/20 blur-3xl"
        animate={{ scale, opacity: opacity * 0.6 }}
        transition={{ duration, ease: EASE[current.phase] }}
        style={{ width: "60%", height: "60%" }}
      />

      {/* Main breathing circle */}
      <motion.div
        className="absolute rounded-full bg-gradient-to-br from-primary/40 via-primary/25 to-accent/30 backdrop-blur-sm border border-primary/20 shadow-lg"
        animate={{ scale, opacity }}
        transition={{ duration, ease: EASE[current.phase] }}
        style={{ width: "52%", height: "52%" }}
      />

      {/* Inner bright core */}
      <motion.div
        className="absolute rounded-full bg-primary/30"
        animate={{ scale: scale * 0.45, opacity: opacity * 0.8 }}
        transition={{ duration, ease: EASE[current.phase] }}
        style={{ width: "52%", height: "52%" }}
      />

      {/* Phase label */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <AnimatePresence mode="wait">
          {current.label && (
            <motion.p
              key={current.phase}
              className="text-sm font-medium text-primary/80 tracking-widest uppercase"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
            >
              {current.label}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Progress arc indicator */}
        <motion.div className="flex gap-1 mt-1">
          {PHASES.filter(p => p.label).map((p, i) => (
            <motion.div
              key={p.phase}
              className="h-0.5 w-4 rounded-full bg-primary/30"
              animate={{
                backgroundColor:
                  PHASES[phaseIndex].phase === p.phase
                    ? "oklch(0.58 0.15 240 / 0.9)"
                    : "oklch(0.58 0.15 240 / 0.2)",
                scaleX: PHASES[phaseIndex].phase === p.phase ? 1.5 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
