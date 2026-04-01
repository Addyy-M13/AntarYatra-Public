"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

// Easing that mimics a realistic progress bar (from LoaderCounter original)
function loaderEase(t: number): number {
  if (t < 0.25) return 3.2 * t * t
  if (t < 0.65) return 0.2 + ((t - 0.25) / 0.4) * 0.5
  if (t < 0.88) return 0.7 + Math.pow((t - 0.65) / 0.23, 1.5) * 0.18
  return 0.88 + Math.pow((t - 0.88) / 0.12, 4) * 0.12
}

interface Pause { start: number; end: number }

function generatePauses(): Pause[] {
  const pauses: Pause[] = []
  const count = 2 + Math.floor(Math.random() * 2)
  for (let i = 0; i < count; i++) {
    const center = 0.2 + Math.random() * 0.55
    const width  = 0.03 + Math.random() * 0.06
    pauses.push({ start: Math.max(0.15, center - width / 2), end: Math.min(0.82, center + width / 2) })
  }
  pauses.push({ start: 0.75 + Math.random() * 0.05, end: 0.80 + Math.random() * 0.04 })
  return pauses
}

interface DashboardLoaderProps {
  /** Duration in seconds (default 2.5) */
  duration?: number
  onComplete?: () => void
}

export default function DashboardLoader({ duration = 2.5, onComplete }: DashboardLoaderProps) {
  const [count, setCount]       = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const rafRef  = useRef<number>(0)
  const doneRef = useRef(false)

  useEffect(() => {
    const pauses  = generatePauses()
    const startMs = performance.now()
    const totalMs = duration * 1000

    const tick = () => {
      const elapsed = performance.now() - startMs
      const raw = Math.min(elapsed / totalMs, 1)

      const isPaused = raw < 0.95 && pauses.some((p) => raw >= p.start && raw <= p.end)
      if (!isPaused) {
        const eased = loaderEase(raw)
        setCount(Math.floor(eased * 100))
      }

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setCount(100)
        if (!doneRef.current) {
          doneRef.current = true
          setTimeout(() => {
            setIsExiting(true)
            setTimeout(() => onComplete?.(), 600)
          }, 300)
        }
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [duration, onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 w-screen h-screen bg-black flex flex-col items-center justify-center z-[99999999999]"
    >
      {/* Big counter */}
      <div
        className="text-white select-none"
        style={{
          fontSize: "clamp(5rem, 18vw, 16rem)",
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums",
          fontFamily: "inherit",
        }}
      >
        {String(count).padStart(2, "0")}
      </div>

      {/* Thin progress line at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10">
        <motion.div
          className="h-full bg-white"
          style={{ width: `${count}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>
    </motion.div>
  )
}
