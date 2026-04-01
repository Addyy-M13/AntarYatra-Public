"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n/context"
import { languages, type Language } from "@/lib/i18n/translations"
import { motion } from "framer-motion"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [showPulse, setShowPulse] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  const sortedLanguages = Object.entries(languages).sort(([, nameA], [, nameB]) => nameA.localeCompare(nameB))

  useEffect(() => {
    setIsHydrated(true)
    const pulseShown = localStorage.getItem("languageSelectorPulseShown")
    if (!pulseShown) {
      setShowPulse(true)
      localStorage.setItem("languageSelectorPulseShown", "true")
      setTimeout(() => setShowPulse(false), 5000)
    }
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          animate={showPulse ? { scale: [1, 1.08, 1, 1.08, 1], boxShadow: ["0 0 0 0 rgba(139, 92, 246, 0)", "0 0 0 8px rgba(139, 92, 246, 0.4)", "0 0 0 0 rgba(139, 92, 246, 0)", "0 0 0 8px rgba(139, 92, 246, 0.4)", "0 0 0 0 rgba(139, 92, 246, 0)"] } : {}}
          transition={{ duration: 2, repeat: showPulse ? 1 : 0, repeatDelay: 0.3 }}
          className="inline-block rounded-md"
        >
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            aria-label={`Language selector, current: ${isHydrated ? languages[language] : "English"}`}
            title={`Language: ${isHydrated ? languages[language] : "English"}`}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden md:inline">{isHydrated ? languages[language] : "English"}</span>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto">
        {sortedLanguages.map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code as Language)}
            className={language === code ? "bg-primary/10" : ""}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

