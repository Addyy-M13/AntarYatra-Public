"use client"

import { useState } from "react"
import { format, subDays, startOfDay } from "date-fns"
import { cn } from "@/lib/utils"

interface HeatmapEntry {
  date: string
  mood_value: number
}

interface MoodHeatmapProps {
  entries: HeatmapEntry[]
}

const MOOD_LABELS: Record<number, string> = {
  1: "Very Bad",
  2: "Bad",
  3: "Neutral",
  4: "Good",
  5: "Great",
}

const MOOD_COLORS: Record<number, string> = {
  0: "bg-muted",
  1: "bg-red-500/60",
  2: "bg-orange-400/60",
  3: "bg-yellow-400/60",
  4: "bg-green-400/60",
  5: "bg-emerald-500/80",
}

export function MoodHeatmap({ entries }: MoodHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ date: string; mood: number } | null>(null)

  const today = startOfDay(new Date())
  const days = Array.from({ length: 84 }, (_, i) => subDays(today, 83 - i))

  const moodByDate: Record<string, number> = {}
  entries.forEach((e) => {
    moodByDate[e.date] = e.mood_value
  })

  // Split into 12 weeks of 7 days
  const weeks: Date[][] = []
  for (let w = 0; w < 12; w++) {
    weeks.push(days.slice(w * 7, w * 7 + 7))
  }

  const dayLabels = ["Mon", "", "Wed", "", "Fri", "", ""]

  return (
    <div className="space-y-3">
      {/* Day-of-week labels */}
      <div className="flex gap-1 ml-0">
        <div className="flex flex-col gap-1 mr-1">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-4 w-8 text-xs text-muted-foreground flex items-center">
              {label}
            </div>
          ))}
        </div>
        {/* Grid */}
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => {
                const dateStr = format(day, "yyyy-MM-dd")
                const mood = moodByDate[dateStr] ?? 0
                return (
                  <div
                    key={di}
                    className={cn(
                      "w-4 h-4 rounded-sm cursor-pointer transition-opacity hover:opacity-80",
                      MOOD_COLORS[mood]
                    )}
                    onMouseEnter={() => setTooltip({ date: dateStr, mood })}
                    onMouseLeave={() => setTooltip(null)}
                    title={mood ? `${dateStr}: ${MOOD_LABELS[mood]}` : `${dateStr}: No data`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <p className="text-xs text-muted-foreground">
          {tooltip.date}: {tooltip.mood ? MOOD_LABELS[tooltip.mood] : "No data"}
        </p>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4, 5].map((v) => (
          <div key={v} className={cn("w-3 h-3 rounded-sm", MOOD_COLORS[v])} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
