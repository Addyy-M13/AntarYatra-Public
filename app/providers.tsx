"use client"

import type React from "react"
import { Suspense } from "react"
import { ThemeProvider } from "next-themes"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { AnalyticsProvider } from "@/components/analytics-provider"
import { LanguageProvider } from "@/lib/i18n/context"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { ScrollProgressBar } from "@/components/scroll-progress-bar"
import { DottedSurfaceClient } from "@/components/dotted-surface-client"
import { CookieConsent } from "@/components/cookie-consent"
import { FloatingActionButton } from "@/components/floating-action-button"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ScrollProgressBar />
      <DottedSurfaceClient />
      <LanguageProvider>
        <AnalyticsProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster />
          <SonnerToaster position="top-center" theme="dark" richColors />
          <CookieConsent />
          <FloatingActionButton />
        </AnalyticsProvider>
      </LanguageProvider>
      <Analytics />
      <SpeedInsights />
    </ThemeProvider>
  )
}