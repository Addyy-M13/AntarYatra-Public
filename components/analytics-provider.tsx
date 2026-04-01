"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { analytics } from "@/lib/analytics/events"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Track page views
  useEffect(() => {
    if (pathname) analytics.pageView(pathname)
  }, [pathname])

  // Track scroll depth
  useEffect(() => {
    let maxScroll = 0
    const depths = [25, 50, 75, 100]
    const tracked = new Set<number>()

    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent

        depths.forEach((depth) => {
          if (scrollPercent >= depth && !tracked.has(depth)) {
            tracked.add(depth)
            analytics.scrollDepth(depth)
          }
        })
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return <>{children}</>
}

