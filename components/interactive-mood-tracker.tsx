"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Smile, Meh, Frown, Heart, Zap, Cloud } from "lucide-react"
import { motion } from "framer-motion"

export function InteractiveMoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [journalEntry, setJournalEntry] = useState("")
  const [showResponse, setShowResponse] = useState(false)

  const moods = [
    { icon: Smile, label: "Happy", color: "text-green-500", bg: "bg-green-500/10" },
    { icon: Heart, label: "Grateful", color: "text-pink-500", bg: "bg-pink-500/10" },
    { icon: Meh, label: "Neutral", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { icon: Cloud, label: "Anxious", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: Frown, label: "Sad", color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: Zap, label: "Stressed", color: "text-red-500", bg: "bg-red-500/10" },
  ]

  const handleSubmit = () => {
    if (selectedMood && journalEntry) {
      setShowResponse(true)
    }
  }

  const aiResponse = `Thank you for sharing how you're feeling. It's completely normal to feel ${selectedMood?.toLowerCase()}. Remember, acknowledging your emotions is the first step toward understanding them better. Would you like to explore some coping strategies or talk more about what's on your mind?`

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Try Our Mood Tracker</h3>
        <p className="text-muted-foreground">Select your mood and write a quick note</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => {
              setSelectedMood(mood.label)
              setShowResponse(false)
            }}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              selectedMood === mood.label
                ? `${mood.bg} border-current ${mood.color}`
                : "border-border hover:border-primary/30"
            }`}
          >
            <mood.icon size={32} className={selectedMood === mood.label ? mood.color : "text-muted-foreground"} />
            <span className="text-xs font-medium">{mood.label}</span>
          </button>
        ))}
      </div>

      <Textarea
        placeholder="How are you feeling today? Write a few words..."
        value={journalEntry}
        onChange={(e) => {
          setJournalEntry(e.target.value)
          setShowResponse(false)
        }}
        className="min-h-32 resize-none"
      />

      <Button onClick={handleSubmit} disabled={!selectedMood || !journalEntry} className="w-full">
        Get AI Insights
      </Button>

      {showResponse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-primary/5 border border-primary/20"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Zap className="text-primary" size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">AI Response</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{aiResponse}</p>
            </div>
          </div>
        </motion.div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        This is a demo. Sign up to save your entries and get personalized insights!
      </p>
    </div>
  )
}

