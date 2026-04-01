"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, RefreshCw, Heart, Wind, CloudRain, Sun, Star, Layers } from "lucide-react"
import Link from "next/link"

const MAX_CHARS = 500

const TONE_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  joyful:      { label: "Joyful",      color: "text-amber-500  bg-amber-50   border-amber-200",   icon: <Sun size={14} /> },
  calm:        { label: "Calm",        color: "text-teal-600   bg-teal-50    border-teal-200",     icon: <Wind size={14} /> },
  anxious:     { label: "Anxious",     color: "text-orange-500 bg-orange-50  border-orange-200",   icon: <Layers size={14} /> },
  sad:         { label: "Sad",         color: "text-blue-500   bg-blue-50    border-blue-200",     icon: <CloudRain size={14} /> },
  overwhelmed: { label: "Overwhelmed", color: "text-purple-500 bg-purple-50  border-purple-200",   icon: <Layers size={14} /> },
  grateful:    { label: "Grateful",    color: "text-rose-500   bg-rose-50    border-rose-200",     icon: <Heart size={14} /> },
  mixed:       { label: "Mixed",       color: "text-indigo-500 bg-indigo-50  border-indigo-200",   icon: <Star size={14} /> },
}

const EXAMPLE_PROMPTS = [
  "I've been feeling really anxious about my job lately and can't sleep.",
  "Today was unexpectedly good — a stranger smiled at me and it changed my whole mood.",
  "I keep putting things off and I don't know why I can't get started.",
  "I miss how things used to be before everything changed.",
  "I feel grateful but also guilty about being happy when others are struggling.",
]

export function TryItNowSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ tone: string; response: string; remainingRequests: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rateLimited, setRateLimited] = useState(false)

  const charsLeft = MAX_CHARS - text.length

  async function handleSubmit() {
    if (!text.trim() || isLoading) return
    setIsLoading(true)
    setError(null)
    setResult(null)
    setRateLimited(false)

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      })

      const data = await res.json()

      if (res.status === 429) {
        setRateLimited(true)
        setError(data.error)
        return
      }

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.")
        return
      }

      setResult(data)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  function handlePromptClick(prompt: string) {
    setText(prompt)
    textareaRef.current?.focus()
  }

  function handleReset() {
    setText("")
    setResult(null)
    setError(null)
    setRateLimited(false)
    textareaRef.current?.focus()
  }

  const toneInfo = result ? (TONE_CONFIG[result.tone] ?? TONE_CONFIG.mixed) : null

  return (
    <section
      id="try-it-now"
      className="relative z-10 py-20 md:py-28"
      ref={ref}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-primary/3 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">

        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Sparkles size={15} />
            <span>Live Demo — No sign-up needed</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-balance mb-4">
            See it work,{" "}
            <span className="text-primary">right now</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Type anything you&apos;re feeling or thinking — our AI responds like a compassionate companion, not a chatbot.
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          className="rounded-2xl border border-border/60 bg-card shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >

          {/* Input area */}
          <div className="p-6 pb-4">
            <label htmlFor="demo-input" className="block text-sm font-medium text-foreground/70 mb-3">
              What&apos;s on your mind?
            </label>
            <textarea
              id="demo-input"
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit()
              }}
              placeholder="Share a thought, a feeling, or something that happened today..."
              rows={4}
              className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">⌘+Enter to submit</span>
              <span className={`text-xs tabular-nums ${charsLeft < 50 ? "text-orange-500" : "text-muted-foreground"}`}>
                {charsLeft} left
              </span>
            </div>
          </div>

          {/* Example prompts */}
          <div className="px-6 pb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Try an example</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border/70 bg-background hover:bg-primary/5 hover:border-primary/40 text-foreground/70 hover:text-primary transition-all cursor-pointer"
                >
                  {prompt.length > 42 ? prompt.slice(0, 42) + "…" : prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Action row */}
          <div className="px-6 py-4 border-t border-border/50 flex items-center gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!text.trim() || isLoading || rateLimited}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" />
                  Reflecting…
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  Get my reflection
                </>
              )}
            </Button>
            {(result || error) && (
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
                Start over
              </Button>
            )}
            <span className="ml-auto text-xs text-muted-foreground">5 free tries / hour</span>
          </div>

          {/* Response area */}
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-border/50"
              >
                <div className="p-6 flex items-center gap-3 text-muted-foreground text-sm">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                  </span>
                  AntarYatra is listening…
                </div>
              </motion.div>
            )}

            {error && !isLoading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-border/50"
              >
                <div className="p-6">
                  <p className="text-sm text-destructive mb-1">{error}</p>
                  {rateLimited && (
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
                    >
                      Sign up for unlimited access <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
              </motion.div>
            )}

            {result && !isLoading && !error && (
              <motion.div
                key="result"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="border-t border-border/50"
              >
                <div className="p-6 space-y-4">
                  {/* Tone badge */}
                  {toneInfo && (
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${toneInfo.color}`}
                    >
                      {toneInfo.icon}
                      {toneInfo.label}
                    </motion.div>
                  )}

                  {/* AI response */}
                  <motion.p
                    className="text-sm text-foreground/85 leading-relaxed"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {result.response}
                  </motion.p>

                  {/* Upsell */}
                  <motion.div
                    className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-border/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <p className="text-xs text-muted-foreground flex-1">
                      Want to save this, track your mood over time, and get deeper weekly insights?
                    </p>
                    <Link href="/login">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1 whitespace-nowrap">
                        Start your journey <ArrowRight size={13} />
                      </Button>
                    </Link>
                  </motion.div>

                  {result.remainingRequests > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {result.remainingRequests} free {result.remainingRequests === 1 ? "try" : "tries"} remaining this hour.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="text-center text-xs text-muted-foreground mt-5"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Your demo input is not stored. Powered by Claude AI.
        </motion.p>
      </div>
    </section>
  )
}
