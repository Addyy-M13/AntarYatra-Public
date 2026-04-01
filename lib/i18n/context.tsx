'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { translations, Language, TranslationKey } from './translations'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey, defaultValue?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage && (translations as Record<string, any>)[savedLanguage]) {
      setLanguageState(savedLanguage)
    } else {
      // Reset to English if stored language doesn't exist in translations
      localStorage.removeItem('language')
    }
    setMounted(true)
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }, [])

  const t = useCallback((key: TranslationKey, defaultValue?: string): string => {
    const langTranslations = (translations as Record<string, any>)[language]
    if (langTranslations && langTranslations[key]) {
      return langTranslations[key]
    }

    // Fallback to English
    const englishTranslations = (translations as Record<string, any>)['en']
    if (englishTranslations && englishTranslations[key]) {
      return englishTranslations[key]
    }

    return defaultValue || key
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider')
  }
  return { t: context.t }
}
