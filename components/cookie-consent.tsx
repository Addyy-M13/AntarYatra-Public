"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Cookie } from "lucide-react"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-card border border-primary/20 rounded-2xl shadow-lg p-6">
        <div className="flex items-start gap-4">
          <Cookie className="w-6 h-6 text-primary shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-2">Cookie Preferences</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We use cookies to enhance your experience, analyze site traffic, and personalize content. By clicking
              "Accept", you consent to our use of cookies.
            </p>
            <div className="flex gap-3">
              <Button onClick={handleAccept} size="sm" className="flex-1">
                Accept
              </Button>
              <Button onClick={handleDecline} size="sm" variant="outline" className="flex-1 bg-transparent">
                Decline
              </Button>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0" onClick={handleDecline}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

