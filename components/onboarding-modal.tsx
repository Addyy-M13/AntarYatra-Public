"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

const STORAGE_KEY = "antaryatra_onboarded"

export function OnboardingModal() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState("")
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const onboarded = localStorage.getItem(STORAGE_KEY)
      if (!onboarded) setOpen(true)
    }
  }, [])

  const handleGetStarted = () => setStep(2)

  const handleContinue = async () => {
    if (!username.trim()) {
      setStep(3)
      return
    }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        username: username.trim(),
        updated_at: new Date().toISOString(),
      })
    }
    setSaving(false)
    setStep(3)
  }

  const handleFinish = () => {
    localStorage.setItem(STORAGE_KEY, "1")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="max-w-md">
        {step === 1 && (
          <div className="flex flex-col items-center gap-6 py-4 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Sparkles className="h-16 w-16 text-primary animate-pulse" />
              </div>
              <DialogTitle className="text-2xl font-bold">Welcome to AntarYatra</DialogTitle>
              <p className="text-muted-foreground">
                Your personal sanctuary for mental wellness, journaling, and self-discovery. Begin your inner journey today.
              </p>
            </div>
            <Button size="lg" onClick={handleGetStarted} className="w-full">
              Get Started ✨
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6 py-4">
            <div className="text-center">
              <DialogTitle className="text-xl font-bold">Set Your Name</DialogTitle>
              <p className="text-muted-foreground text-sm mt-1">How should we address you?</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="onboarding-username">Your name or nickname</Label>
              <Input
                id="onboarding-username"
                placeholder="e.g. Arjun, Priya, Traveller..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
              />
            </div>
            <Button onClick={handleContinue} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Continue →"}
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6 py-4">
            <div className="text-center">
              <DialogTitle className="text-xl font-bold">Your First Steps</DialogTitle>
              <p className="text-muted-foreground text-sm mt-1">Here's how to begin your journey</p>
            </div>
            <div className="rounded-xl border bg-card p-4 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✍️</span>
                <div>
                  <p className="font-medium">Write a journal entry</p>
                  <p className="text-muted-foreground text-xs">+10 points</p>
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center gap-3">
                <span className="text-2xl">😊</span>
                <div>
                  <p className="font-medium">Track your mood</p>
                  <p className="text-muted-foreground text-xs">+5 points</p>
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤝</span>
                <div>
                  <p className="font-medium">Join the community</p>
                  <p className="text-muted-foreground text-xs">Share and connect with others</p>
                </div>
              </div>
            </div>
            <Button onClick={handleFinish} className="w-full" size="lg">
              Start My Journey 🌟
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
