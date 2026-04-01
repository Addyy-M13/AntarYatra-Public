"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Lock, Shield } from "lucide-react"

export default function AdminLogin() {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        // Store token and expiry (24 hours from now)
        const expiryTime = Date.now() + 24 * 60 * 60 * 1000
        sessionStorage.setItem("admin_token", data.token)
        sessionStorage.setItem("admin_expiry", expiryTime.toString())

        toast({ title: "Access granted", description: "Welcome back, admin." })
        router.push("/admin")
      } else {
        toast({
          title: "Access denied",
          description: "Invalid password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setPassword("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Admin Access</h1>
          <p className="text-sm text-muted-foreground">
            This area is restricted to authorized developers only.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                autoFocus
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !password}>
            {isLoading ? "Verifying..." : "Access Dashboard"}
          </Button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          <p>⚠️ Unauthorized access attempts are logged and monitored.</p>
        </div>
      </Card>
    </div>
  )
}
