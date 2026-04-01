"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

interface MilestoneConfettiProps {
  count: number
}

export function MilestoneConfetti({ count }: MilestoneConfettiProps) {
  const [lastMilestone, setLastMilestone] = useState(0)

  useEffect(() => {
    const milestones = [100, 250, 500, 1000, 2500, 5000, 10000]
    const currentMilestone = milestones.find((m) => count >= m && m > lastMilestone)

    if (currentMilestone) {
      setLastMilestone(currentMilestone)

      // Trigger confetti
      const duration = 3000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)
    }
  }, [count, lastMilestone])

  return null
}

