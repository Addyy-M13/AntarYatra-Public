"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated
    const adminToken = sessionStorage.getItem("admin_token")
    const adminExpiry = sessionStorage.getItem("admin_expiry")

    if (pathname === "/admin/login") {
      setIsLoading(false)
      return
    }

    if (!adminToken || !adminExpiry) {
      router.push("/admin/login")
      return
    }

    // Check if token is expired
    const expiryTime = parseInt(adminExpiry)
    if (Date.now() > expiryTime) {
      sessionStorage.removeItem("admin_token")
      sessionStorage.removeItem("admin_expiry")
      router.push("/admin/login")
      return
    }

    setIsAuthenticated(true)
    setIsLoading(false)
  }, [pathname, router])

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token")
    sessionStorage.removeItem("admin_expiry")
    router.push("/admin/login")
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Admin Access</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      {children}
    </div>
  )
}
