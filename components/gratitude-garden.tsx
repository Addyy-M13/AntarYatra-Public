"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface GratitudeEntry {
  id: string
  content: string
  created_at: string
}

const PLANT_STAGES = [
  { min: 0,  max: 3,  emoji: "🌱", label: "Seedling",  color: "text-lime-400" },
  { min: 3,  max: 8,  emoji: "🌿", label: "Sprouting", color: "text-green-400" },
  { min: 8,  max: 15, emoji: "🌺", label: "Blooming",  color: "text-pink-400" },
  { min: 15, max: 30, emoji: "🌸", label: "Flourishing",color: "text-rose-400" },
  { min: 30, max: Infinity, emoji: "🌳", label: "Ancient Garden", color: "text-emerald-400" },
]

const PLANT_EMOJIS = ["🌻", "🌼", "🌸", "🌺", "🪷", "🌹", "🌷", "💐", "🍀", "🌿", "🌱", "🪴"]

function getStage(count: number) {
  return PLANT_STAGES.find(s => count >= s.min && count < s.max) ?? PLANT_STAGES[PLANT_STAGES.length - 1]
}

function generateGarden(count: number): string[] {
  const plants: string[] = []
  for (let i = 0; i < Math.min(count, 24); i++) {
    plants.push(PLANT_EMOJIS[i % PLANT_EMOJIS.length])
  }
  return plants
}

export function GratitudeGarden() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [newGratitude, setNewGratitude] = useState("")
  const [loading, setLoading] = useState(false)
  const [bloom, setBloom] = useState(false)
  const supabase = createClient()

  useEffect(() => { loadEntries() }, [])

  const loadEntries = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from("gratitude_entries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
    if (data) setEntries(data)
  }

  const addGratitude = async () => {
    if (!newGratitude.trim()) { toast.error("What are you grateful for?"); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from("gratitude_entries").insert({ user_id: user.id, content: newGratitude })
    if (error) { toast.error("Failed to plant gratitude") }
    else {
      toast.success("A new flower bloomed in your garden! 🌸")
      setNewGratitude("")
      setBloom(true)
      setTimeout(() => setBloom(false), 1500)
      loadEntries()
    }
    setLoading(false)
  }

  const count = entries.length
  const stage = getStage(count)
  const garden = generateGarden(count)

  return (
    <div className="space-y-4">
      {/* Garden Stage Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className={`text-2xl font-bold ${stage.color}`}>{stage.emoji} {stage.label}</span>
          <p className="text-xs text-muted-foreground mt-0.5">{count} gratitude{count !== 1 ? "s" : ""} planted</p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          {count < 30 ? `${30 - count} more to reach Ancient Garden` : "Maximum bloom achieved!"}
        </div>
      </div>

      {/* Garden Display */}
      <div className="relative min-h-32 bg-gradient-to-b from-sky-500/10 to-emerald-500/10 rounded-xl border border-emerald-500/20 p-4 overflow-hidden">
        <div className="flex flex-wrap gap-1">
          <AnimatePresence>
            {garden.map((plant, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.03, type: "spring", stiffness: 300 }}
                className="text-2xl cursor-default select-none"
                title={entries[i]?.content}
              >
                {plant}
              </motion.span>
            ))}
          </AnimatePresence>
          {count === 0 && (
            <div className="w-full text-center py-4 text-muted-foreground text-sm">
              Plant your first gratitude to grow your garden 🌱
            </div>
          )}
        </div>

        {/* Bloom animation */}
        <AnimatePresence>
          {bloom && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none text-4xl"
            >
              🌸
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add gratitude */}
      <div className="flex gap-2">
        <Input
          placeholder="I'm grateful for..."
          value={newGratitude}
          onChange={e => setNewGratitude(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") addGratitude() }}
        />
        <Button onClick={addGratitude} disabled={loading}>
          {loading ? "Planting..." : "Plant 🌱"}
        </Button>
      </div>

      {/* Recent gratitudes */}
      {entries.slice(0, 3).length > 0 && (
        <div className="space-y-1">
          {entries.slice(0, 3).map(e => (
            <p key={e.id} className="text-xs text-muted-foreground truncate">
              ✦ {e.content}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
