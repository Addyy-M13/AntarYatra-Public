"use client"

import React, { useEffect, useState } from "react"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { Users, BookText, Sparkles } from "lucide-react"

// Demo data with random increments for realistic feel
export function RealTimeStats() {
  const [stats, setStats] = useState({
    todayEntries: 87,
    activeUsers: 64,
    totalJournals: 428
  })

  useEffect(() => {
    // Simulate real-time updates with random increments
    const interval = setInterval(() => {
      setStats(prev => ({
        todayEntries: prev.todayEntries + Math.floor(Math.random() * 2),
        activeUsers: prev.activeUsers + (Math.random() > 0.7 ? 1 : 0),
        totalJournals: prev.totalJournals + Math.floor(Math.random() * 3)
      }))
    }, 10000) // Update every 10 seconds instead of 5

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <BookText className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Today&apos;s Entries</h3>
          <Badge variant="secondary" className="ml-auto">
            Live
          </Badge>
        </div>
        <p className="mt-2 text-2xl font-bold">{stats.todayEntries}</p>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Active Users</h3>
          <Badge variant="secondary" className="ml-auto">
            24h
          </Badge>
        </div>
        <p className="mt-2 text-2xl font-bold">{stats.activeUsers}</p>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Total Journals</h3>
          <Badge variant="secondary" className="ml-auto">
            All Time
          </Badge>
        </div>
        <p className="mt-2 text-2xl font-bold">{stats.totalJournals}</p>
      </Card>
    </div>
  )
}
