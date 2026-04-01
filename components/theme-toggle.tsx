"use client"

import { Moon, Sun } from "lucide-react"
import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme, themes } = useTheme()
  const [mounted, setMounted] = useState(false)

  // List of available themes
  const availableThemes = ["light", "dark"]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="w-9 h-9" />
  }

  // Cycle to next theme
  const handleToggle = () => {
    const currentIndex = availableThemes.indexOf(theme || "light")
    const nextIndex = (currentIndex + 1) % availableThemes.length
    setTheme(availableThemes[nextIndex])
  }

  // Icon for each theme
  const themeIcons: Record<string, React.ReactElement> = {
    light: <Sun className="w-4 h-4" />,
    dark: <Moon className="w-4 h-4" />,
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="w-9 h-9"
    >
      {themeIcons[theme || "light"]}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

