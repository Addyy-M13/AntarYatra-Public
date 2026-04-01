"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"

export function InteractiveDemo() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [journalEntry, setJournalEntry] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [selectedMood, setSelectedMood] = useState<number | null>(null)

  const moods = ["😊", "😌", "😐", "😔", "😢"]

  async function handleSaveEntry() {
    if (!journalEntry.trim()) return
    setAiLoading(true)
    setAiResponse("")
    setCurrentIndex(2) // jump to insights screen

    try {
      const res = await fetch("/api/ai/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "feedback", entry: journalEntry }),
      })

      if (!res.ok) {
        setAiResponse("Couldn't connect to AI right now. Try again in a moment.")
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          accumulated += decoder.decode(value, { stream: true })
          setAiResponse(accumulated)
        }
      }
    } catch {
      setAiResponse("Something went wrong. Please try again.")
    } finally {
      setAiLoading(false)
    }
  }

  const demoScreens = [
    {
      title: "Start Journaling",
      content: (
        <div className="space-y-4">
          <textarea
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            placeholder="How are you feeling today? Share anything on your mind…"
            className="w-full h-32 p-4 rounded-lg border focus:ring-2 focus:ring-primary resize-none"
          />
          <div className="flex space-x-2">
            <Button onClick={handleSaveEntry} disabled={!journalEntry.trim() || aiLoading}>
              {aiLoading ? "Thinking…" : "Save & Get AI Insight"}
            </Button>
            <Button variant="outline" onClick={() => setCurrentIndex(1)}>
              Add Mood
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Track Your Mood",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">How are you feeling right now?</p>
          <div className="grid grid-cols-5 gap-4">
            {moods.map((emoji, i) => (
              <Button
                key={i}
                variant={selectedMood === i ? "default" : "outline"}
                className="text-2xl p-4 hover:bg-primary/10"
                onClick={() => setSelectedMood(i)}
              >
                {emoji}
              </Button>
            ))}
          </div>
          {selectedMood !== null && (
            <p className="text-sm text-center text-muted-foreground">
              Mood logged {moods[selectedMood]}
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Your AI Insight",
      content: (
        <div className="space-y-4">
          {aiLoading && !aiResponse ? (
            <div className="h-40 bg-primary/10 rounded-lg flex items-center justify-center text-muted-foreground animate-pulse">
              Claude is reading your entry…
            </div>
          ) : aiResponse ? (
            <div className="rounded-lg border bg-card p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {aiResponse}
            </div>
          ) : (
            <div className="h-40 bg-primary/10 rounded-lg flex items-center justify-center text-muted-foreground text-sm text-center px-4">
              Write a journal entry on the first screen to get a real AI insight here.
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-medium">Weekly Mood</h4>
              <p className="text-2xl">{selectedMood !== null ? moods[selectedMood] : "😊"} Positive</p>
            </Card>
            <Card className="p-4">
              <h4 className="font-medium">Journal Streak</h4>
              <p className="text-2xl">🔥 7 days</p>
            </Card>
          </div>
        </div>
      ),
    },
  ]

  const next = () => setCurrentIndex((prev) => (prev + 1) % demoScreens.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + demoScreens.length) % demoScreens.length)

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative bg-card rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6">{demoScreens[currentIndex].title}</h2>

        <div className="transition-all duration-300 ease-in-out">
          {demoScreens[currentIndex].content}
        </div>

        <div className="absolute top-1/2 -left-4 -translate-y-1/2">
          <Button variant="ghost" size="icon" onClick={prev} className="rounded-full shadow-lg">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute top-1/2 -right-4 -translate-y-1/2">
          <Button variant="ghost" size="icon" onClick={next} className="rounded-full shadow-lg">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center space-x-2 mt-6">
          {demoScreens.map((_, i) => (
            <Button
              key={i}
              variant="ghost"
              size="icon"
              className={`w-2 h-2 rounded-full ${i === currentIndex ? "bg-primary" : "bg-primary/20"}`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
