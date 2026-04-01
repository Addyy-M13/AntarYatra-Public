"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setUsername } from "@/lib/actions/profile"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Sparkles, User, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function UsernameSetup() {
  const [username, setUsernameInput] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      toast.error("Please enter a username")
      return
    }

    setLoading(true)

    try {
      const result = await setUsername(username.trim())

      if (result.success) {
        toast.success("Welcome to AntarYatra! 🎉", {
          description: "Your profile has been set up successfully",
          duration: 3000,
        })
        
        // Redirect to dashboard after brief delay
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1000)
      } else {
        toast.error(result.error || "Failed to set username")
      }
    } catch (error) {
      console.error("Error setting username:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-lg border-2">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">
              Welcome to AntarYatra! 🎉
            </h1>
            
            <p className="text-muted-foreground">
              Let's personalize your experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-base font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Choose Your Username
              </Label>
              
              <Input
                id="username"
                type="text"
                placeholder="e.g., mindful_warrior"
                value={username}
                onChange={(e) => setUsernameInput(e.target.value.toLowerCase())}
                className="h-12 text-lg"
                autoFocus
                autoComplete="off"
                disabled={loading}
                maxLength={20}
              />
              
              <p className="text-xs text-muted-foreground mt-2">
                3-20 characters • Letters, numbers, and underscores only
              </p>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Privacy:</strong> Your username is private and only visible to you. 
                We respect your anonymity and keep your data secure.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 text-base font-semibold"
              disabled={loading || username.length < 3}
            >
              {loading ? (
                <>
                  <span className="animate-pulse">Setting up...</span>
                </>
              ) : (
                <>
                  Continue to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
