"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Preloader from "@/components/ui/preloader"
import DashboardLoader from "@/components/ui/dashboard-loader"

const HOME_WORDS = [
  "Hello",
  "नमस्ते",
  "வணக்கம்",
  "ନମସ୍କାର",
  "নমস্কার",
  "నమస్కారం",
  "ನಮಸ್ಕಾರ",
  "നമസ്കാരം",
]

const DASHBOARD_FIRST_WORDS = [
  "Welcome back",
  "This is your space",
  "Breathe in",
  "Be present",
  "Let's begin",
]

function isDashboard(path: string) {
  return path.startsWith("/dashboard")
}

type LoaderType = "home-preloader" | "dashboard-first" | "dashboard-nav" | "none"

export function LoadingScreen() {
  const pathname  = usePathname()
  const prevPath  = useRef<string | null>(null)
  const [loaderType, setLoaderType] = useState<LoaderType>("none")
  const [key, setKey] = useState(0)

  useEffect(() => {
    const prev = prevPath.current
    prevPath.current = pathname

    // Initial mount
    if (prev === null) {
      if (pathname && isDashboard(pathname)) {
        // Direct deep-link into dashboard — treat as first visit
        const seen = sessionStorage.getItem("ay_dashboard_seen")
        if (!seen) {
          sessionStorage.setItem("ay_dashboard_seen", "1")
          setLoaderType("dashboard-first")
        }
        // else: no loader, already seen
      } else if (pathname) {
        setLoaderType("home-preloader")
      }
      setKey((k) => k + 1)
      return
    }

    // Route changed
    if (prev === pathname) return

    if (pathname && isDashboard(pathname)) {
      const seen = sessionStorage.getItem("ay_dashboard_seen")
      if (!seen) {
        // First ever dashboard entry
        sessionStorage.setItem("ay_dashboard_seen", "1")
        setLoaderType("dashboard-first")
      } else if (isDashboard(prev)) {
        // Navigating between dashboard pages
        setLoaderType("dashboard-nav")
      } else {
        // Coming from outside into dashboard (not first time)
        setLoaderType("dashboard-nav")
      }
    } else {
      // Navigating to a non-dashboard page
      setLoaderType("home-preloader")
    }

    setKey((k) => k + 1)
  }, [pathname])

  const handleComplete = () => setLoaderType("none")

  if (loaderType === "none") return null

  if (loaderType === "home-preloader") {
    return (
      <Preloader
        key={key}
        words={HOME_WORDS}
        targetDuration={3}
        onComplete={handleComplete}
      />
    )
  }

  if (loaderType === "dashboard-first") {
    return (
      <Preloader
        key={key}
        words={DASHBOARD_FIRST_WORDS}
        targetDuration={10}
        onComplete={handleComplete}
      />
    )
  }

  if (loaderType === "dashboard-nav") {
    return (
      <DashboardLoader
        key={key}
        duration={2.5}
        onComplete={handleComplete}
      />
    )
  }

  return null
}
