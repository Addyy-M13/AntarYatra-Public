"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const slideUp = {
  initial: { top: 0 },
  exit: {
    top: "-100vh",
    transition: { duration: 0.8, delay: 0.2 },
  },
}

interface PreloaderProps {
  words: string[]
  /** Total screen time in seconds (default 3) */
  targetDuration?: number
  onComplete?: () => void
}

export default function Preloader({ words, targetDuration = 3, onComplete }: PreloaderProps) {
  const [index, setIndex] = useState(0)
  const [dimension, setDimension] = useState({ width: 0, height: 0 })
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  useEffect(() => {
    // Reserve ~1s for the exit slide animation
    const exitMs = 1000
    const wordsTime = targetDuration * 1000 - exitMs
    // First word gets a slightly longer moment, rest split evenly
    const firstDelay = Math.max(600, wordsTime * 0.18)
    const restDelay = words.length > 1
      ? (wordsTime - firstDelay) / (words.length - 1)
      : wordsTime

    if (index === words.length - 1) {
      const t = setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => onComplete?.(), 900)
      }, 400)
      return () => clearTimeout(t)
    }

    const delay = index === 0 ? firstDelay : restDelay
    const t = setTimeout(() => setIndex((i) => i + 1), delay)
    return () => clearTimeout(t)
  }, [index, words.length, targetDuration, onComplete])

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`
  const targetPath  = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`

  const curve = {
    initial: { d: initialPath, transition: { duration: 0.7 } },
    exit:    { d: targetPath,  transition: { duration: 0.7, delay: 0.3 } },
  }

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate={isExiting ? "exit" : "initial"}
      className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-black z-[99999999999]"
    >
      {dimension.width > 0 && (
        <>
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.9, y: 0, transition: { duration: 0.4, ease: "easeOut" } }}
            className="text-white text-6xl md:text-8xl lg:text-9xl absolute z-10 font-bold tracking-tight italic select-none"
          >
            {words[index]}
          </motion.p>
          <svg className="absolute top-0 w-full h-[calc(100%+300px)]">
            <motion.path
              variants={curve}
              initial="initial"
              animate={isExiting ? "exit" : "initial"}
              fill="#070b13"
            />
          </svg>
        </>
      )}
    </motion.div>
  )
}
