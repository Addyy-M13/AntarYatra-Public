"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"
import { motion } from "framer-motion"
import { getUserCount } from "@/lib/actions/users"

export function ActiveUsersCounter() {
  const [count, setCount] = useState(37) // Starting count
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserCount() {
      try {
        const result = await getUserCount()
        if (result.success && result.count) {
          setCount(result.count)
        }
      } catch (error) {
        console.error("Failed to fetch user count:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserCount()
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUserCount, 30000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary animate-pulse" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2"
    >
      <Users className="h-5 w-5 text-primary" />
      <span className="text-sm text-muted-foreground">
        <span className="text-primary font-bold">{count.toLocaleString()}</span> active users
      </span>
    </motion.div>
  )
}
