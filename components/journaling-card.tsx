"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function JournalingCard() {
  const [open, setOpen] = useState(false)
  const [entry, setEntry] = useState("")
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function requestAI(mode: "prompt" | "feedback") {
    if (!entry.trim() && mode === "feedback") {
      // ask user to write something first
      toast({ title: "Write an entry first", description: "Please write a short journal entry to get feedback.", variant: "default" })
      return
    }

    setLoading(true)
    setAiResponse(null)

    try {
      const res = await fetch("/api/ai/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, entry }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || "AI request failed")
      }

      if (mode === "prompt") {
        const data = await res.json()
        setAiResponse(data.text)
      } else {
        // feedback mode returns a streamed plain-text response
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
      }
    } catch (err: any) {
      console.error("AI request error:", err)
      toast({ title: "AI request failed", description: err?.message || "Try again later.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // Listen for a custom event to open the journaling card from elsewhere on the page
  useEffect(() => {
    const handleOpenJournaling = () => {
      setOpen(true)
      // scroll into view after a small delay to allow layout
      setTimeout(() => {
        const el = document.getElementById("ai-journaling")
        el?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 80)
    }

    window.addEventListener("open-journaling", handleOpenJournaling)
    return () => window.removeEventListener("open-journaling", handleOpenJournaling)
  }, [])

  return (
    <div id="ai-journaling" className="max-w-xl mx-auto">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((s) => !s)}
        onKeyDown={(e) => e.key === "Enter" && setOpen((s) => !s)}
        className="cursor-pointer p-6 rounded-2xl border bg-gradient-to-br from-muted/30 to-transparent hover:shadow-lg transition"
      >
        <h3 className="text-lg font-semibold">AI-Guided Journaling</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Smart prompts that adapt to your emotional state and help you explore deeper.
        </p>
      </div>

      {open && (
        <div className="mt-4 p-4 border rounded-lg bg-card/60">
          <label className="block text-sm font-medium text-muted-foreground">Your entry</label>
          <textarea
            value={entry}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEntry(e.target.value)}
            rows={6}
            className="mt-2 w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />

          <div className="flex gap-3 mt-3">
            <Button onClick={() => requestAI("prompt")} disabled={loading} className="flex-1">
              {loading ? "Thinking…" : "Request AI Prompt"}
            </Button>
            <Button variant="ghost" onClick={() => requestAI("feedback")} disabled={loading} className="flex-1">
              {loading ? "Thinking…" : "Get AI Feedback"}
            </Button>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium">AI Response</h4>
            <div className="mt-2 p-3 bg-background rounded-md min-h-[80px]">
              {aiResponse ? (
                <p className="whitespace-pre-wrap">{aiResponse}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No response yet. Request a prompt or feedback.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JournalingCard

