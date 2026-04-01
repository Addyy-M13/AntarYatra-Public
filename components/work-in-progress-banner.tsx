"use client"

import { useLanguage } from "@/lib/i18n/context"
import { AlertCircle } from "lucide-react"

export function WorkInProgressBanner() {
  const { language } = useLanguage()

  // Only show for languages that aren't fully translated
  if (language === "en") {
    return null
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md mx-auto px-4">
      <div className="bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 rounded-lg shadow-lg p-3 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            Translation in Progress
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
            We are actively improving {language.charAt(0).toUpperCase() + language.slice(1)} translations. Some content may appear in English.
          </p>
        </div>
      </div>
    </div>
  )
}
