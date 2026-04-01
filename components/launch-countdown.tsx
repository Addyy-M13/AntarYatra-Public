"use client"

import { motion } from "framer-motion"
import { Calendar, Rocket } from "lucide-react"

export function LaunchCountdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-8"
    >
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-sm">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_70%)]" />
          <div className="relative px-6 py-4">
            <div className="flex items-center justify-center gap-3 text-center">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm font-semibold text-muted-foreground">
                  Production Launch
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold text-primary">
                  November 14th, 2025
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

