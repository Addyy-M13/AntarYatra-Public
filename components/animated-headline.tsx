"use client"

import { motion, type Variants } from "framer-motion"

interface AnimatedHeadlineProps {
  /** Plain text segments rendered in default foreground color */
  text: string
  /** Text rendered in primary/brand color */
  highlight?: string
  /** Text after the highlight */
  textEnd?: string
  className?: string
  /** Delay before the animation starts (seconds) */
  startDelay?: number
}

const wordVariant: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.08,
      type: "spring" as const,
      stiffness: 90,
      damping: 18,
    },
  }),
}

function WordSpan({
  word,
  index,
  className,
}: {
  word: string
  index: number
  className?: string
}) {
  return (
    <motion.span
      custom={index}
      variants={wordVariant}
      initial="hidden"
      animate="visible"
      className={`inline-block ${className ?? ""}`}
    >
      {word}&nbsp;
    </motion.span>
  )
}

export function AnimatedHeadline({
  text,
  highlight,
  textEnd,
  className,
  startDelay = 0.2,
}: AnimatedHeadlineProps) {
  const textWords = text.trim().split(" ")
  const highlightWords = highlight?.trim().split(" ") ?? []
  const textEndWords = textEnd?.trim().split(" ") ?? []

  // Global word index for staggered delay across all segments
  let wordIndex = Math.round(startDelay / 0.08)

  const textSpans = textWords.map((word) => {
    const idx = wordIndex++
    return <WordSpan key={`t-${idx}`} word={word} index={idx} />
  })

  const highlightSpans = highlightWords.map((word) => {
    const idx = wordIndex++
    return (
      <WordSpan
        key={`h-${idx}`}
        word={word}
        index={idx}
        className="text-primary"
      />
    )
  })

  const textEndSpans = textEndWords.map((word) => {
    const idx = wordIndex++
    return <WordSpan key={`e-${idx}`} word={word} index={idx} />
  })

  return (
    <h1 className={className}>
      {textSpans}
      {highlightSpans}
      {textEndSpans}
    </h1>
  )
}
