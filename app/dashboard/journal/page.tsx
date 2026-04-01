"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ScrambledTitle } from "@/components/ui/modern-animated-hero-section"
import {
  Sparkles, Save, Star, Trash2, Calendar, Lightbulb, RefreshCw,
  BookOpen, Search, ChevronLeft, ChevronRight, Mic, MicOff, Loader2, Moon,
} from "lucide-react"
import { MOOD_CONFIG, JournalEntry } from "@/lib/types/dashboard"
import { toast } from "sonner"
import { format } from "date-fns"
import confetti from "canvas-confetti"
import { motion } from "framer-motion"

const DREAM_EMOTIONS = ["Fearful", "Joyful", "Confused", "Peaceful", "Anxious", "Excited", "Sad", "Surreal", "Nostalgic", "Powerful"]

interface DreamEntry {
  id: string
  title: string | null
  content: string
  emotions: string[] | null
  ai_interpretation: string | null
  created_at: string
}

function MatrixHeaderRain() {
  const [chars, setChars] = useState<{ char: string; x: number; y: number; speed: number; opacity: number }[]>([])

  useEffect(() => {
    const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    setChars(Array.from({ length: 80 }, () => ({
      char: allChars[Math.floor(Math.random() * allChars.length)],
      x: Math.random() * 100, y: Math.random() * 100,
      speed: 0.08 + Math.random() * 0.18, opacity: 0.1 + Math.random() * 0.3,
    })))
  }, [])

  useEffect(() => {
    let id: number
    const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const tick = () => {
      setChars(prev => prev.map(c => ({
        ...c, y: c.y >= 100 ? -5 : c.y + c.speed,
        ...(c.y >= 100 && { x: Math.random() * 100, char: allChars[Math.floor(Math.random() * allChars.length)], opacity: 0.1 + Math.random() * 0.3 }),
      })))
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {chars.map((c, i) => (
        <span key={i} className="absolute text-[#00ff00] font-mono text-xs select-none"
          style={{ left: `${c.x}%`, top: `${c.y}%`, opacity: c.opacity, fontSize: "0.75rem" }}>
          {c.char}
        </span>
      ))}
    </div>
  )
}

export default function JournalPage() {
  const PAGE_SIZE = 10
  const supabase = createClient()

  // === Daily Journal State ===
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [totalEntries, setTotalEntries] = useState(0)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentEntry, setCurrentEntry] = useState({ title: "", content: "", mood_at_start: null as number | null })
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [journalSaving, setJournalSaving] = useState(false)
  const [loadingAI, setLoadingAI] = useState(false)
  const [dailyPrompt, setDailyPrompt] = useState("")
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)
  const [prompts, setPrompts] = useState<string[]>([])
  const [loadingPrompts, setLoadingPrompts] = useState(false)
  const [showPrompts, setShowPrompts] = useState(false)

  // === Dream Journal State ===
  const [dreamEntries, setDreamEntries] = useState<DreamEntry[]>([])
  const [currentDream, setCurrentDream] = useState({ title: "", content: "", emotions: [] as string[] })
  const [interpretation, setInterpretation] = useState<any>(null)
  const [dreamSaving, setDreamSaving] = useState(false)
  const [interpretingLoading, setInterpretingLoading] = useState(false)
  const [selectedDream, setSelectedDream] = useState<DreamEntry | null>(null)

  useEffect(() => {
    loadEntries(1, "")
    loadDailyPrompt()
    fetchAIPrompts()
    loadDreamEntries()
  }, [])

  // ── Daily Journal Handlers ──────────────────────────────────────────────

  const fetchAIPrompts = async () => {
    setLoadingPrompts(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: recentEntries } = await supabase.from("journal_entries").select("mood_at_start").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1)
      const res = await fetch("/api/ai/prompts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ recentMood: recentEntries?.[0]?.mood_at_start ?? null }) })
      const data = await res.json()
      if (Array.isArray(data.prompts)) setPrompts(data.prompts)
    } catch { /* silently fail */ }
    finally { setLoadingPrompts(false) }
  }

  const loadEntries = async (targetPage: number = page, search: string = searchQuery) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const offset = (targetPage - 1) * PAGE_SIZE
    let query = supabase.from("journal_entries").select("*", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).range(offset, offset + PAGE_SIZE - 1)
    if (search.trim()) query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    const { data, count } = await query
    if (data) { setEntries(data); setTotalEntries(count || 0) }
  }

  const loadDailyPrompt = async () => {
    const { data } = await supabase.from("journaling_prompts").select("*").eq("is_active", true).limit(10)
    if (data && data.length > 0) setDailyPrompt(data[Math.floor(Math.random() * data.length)].prompt)
  }

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) { toast.error("Voice input not supported. Try Chrome."); return }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return }
    const recognition = new SpeechRecognition()
    recognition.continuous = true; recognition.interimResults = true; recognition.lang = "en-IN"
    recognition.onresult = (event: any) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) transcript += event.results[i][0].transcript
      setCurrentEntry(prev => ({ ...prev, content: prev.content + (prev.content && !prev.content.endsWith(" ") ? " " : "") + transcript }))
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => { setIsListening(false); toast.error("Voice input stopped") }
    recognitionRef.current = recognition
    recognition.start(); setIsListening(true)
    toast.success("Listening... speak your thoughts")
  }

  const getAIInsights = async () => {
    if (!currentEntry.content.trim()) { toast.error("Write something first!"); return }
    setLoadingAI(true)
    try {
      const response = await fetch("/api/ai/insights", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: currentEntry.content, mood: currentEntry.mood_at_start }) })
      const data = await response.json()
      if (data.error) toast.error("AI insights unavailable right now")
      else { setAiInsights(data); toast.success("AI insights generated!") }
    } catch { toast.error("Failed to get AI insights") }
    finally { setLoadingAI(false) }
  }

  const saveEntry = async () => {
    if (!currentEntry.content.trim()) { toast.error("Please write something first"); return }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setJournalSaving(true)
    const { error } = await supabase.from("journal_entries").insert({ user_id: user.id, title: currentEntry.title || null, content: currentEntry.content, mood_at_start: currentEntry.mood_at_start, ai_prompt: dailyPrompt || null, ai_insights: aiInsights?.insights || null, ai_sentiment: aiInsights?.sentiment || null })
    if (error) { toast.error("Failed to save entry") }
    else {
      const { data: profile } = await supabase.from("profiles").select("total_points").eq("id", user.id).single()
      if (profile) await supabase.from("profiles").update({ total_points: (profile.total_points || 0) + 10, updated_at: new Date().toISOString() }).eq("id", user.id)
      toast.success("Journal entry saved! +10 points")
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
      setCurrentEntry({ title: "", content: "", mood_at_start: null }); setAiInsights(null); setPage(1)
      loadEntries(1, searchQuery); loadDailyPrompt()
    }
    setJournalSaving(false)
  }

  const deleteEntry = async (id: string) => {
    const { error } = await supabase.from("journal_entries").delete().eq("id", id)
    if (error) toast.error("Failed to delete entry")
    else { toast.success("Entry deleted"); loadEntries(page, searchQuery) }
  }

  const toggleFavorite = async (entry: JournalEntry) => {
    const { error } = await supabase.from("journal_entries").update({ is_favorite: !entry.is_favorite }).eq("id", entry.id)
    if (!error) { loadEntries(); toast.success(entry.is_favorite ? "Removed from favorites" : "Added to favorites") }
  }

  // ── Dream Journal Handlers ──────────────────────────────────────────────

  const loadDreamEntries = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from("dream_entries").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
    if (data) setDreamEntries(data)
  }

  const interpretDream = async () => {
    if (!currentDream.content.trim()) { toast.error("Describe your dream first"); return }
    setInterpretingLoading(true)
    try {
      const res = await fetch("/api/ai/dream", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: currentDream.content, emotions: currentDream.emotions }) })
      setInterpretation(await res.json())
      toast.success("Dream interpreted!")
    } catch { toast.error("Failed to interpret dream") }
    finally { setInterpretingLoading(false) }
  }

  const saveDream = async () => {
    if (!currentDream.content.trim()) { toast.error("Please describe your dream"); return }
    setDreamSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from("dream_entries").insert({ user_id: user.id, title: currentDream.title || null, content: currentDream.content, emotions: currentDream.emotions.length > 0 ? currentDream.emotions : null, ai_interpretation: interpretation ? JSON.stringify(interpretation) : null })
    if (error) toast.error("Failed to save dream")
    else { toast.success("Dream saved!"); setCurrentDream({ title: "", content: "", emotions: [] }); setInterpretation(null); loadDreamEntries() }
    setDreamSaving(false)
  }

  const toggleEmotion = (emotion: string) => {
    setCurrentDream(prev => ({ ...prev, emotions: prev.emotions.includes(emotion) ? prev.emotions.filter(e => e !== emotion) : [...prev.emotions, emotion] }))
  }

  // ── Styles ──────────────────────────────────────────────────────────────

  const glassStyle: React.CSSProperties = {
    backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.6)",
    border: "1px solid rgba(0,255,0,0.12)", boxShadow: "inset 1px 1px 0 rgba(0,255,0,0.06), 0 8px 32px rgba(0,0,0,0.4)",
  }
  const inputStyle: React.CSSProperties = {
    backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.5)",
    border: "1px solid rgba(0,255,0,0.15)", color: "rgba(255,255,255,0.85)",
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Matrix Header */}
      <div className="relative rounded-2xl overflow-hidden" style={{ background: "#000", border: "1px solid rgba(0,255,0,0.2)", minHeight: "140px" }}>
        <MatrixHeaderRain />
        <div className="relative z-10 flex flex-col items-center justify-center py-8 px-6">
          <ScrambledTitle phrases={["AI-POWERED JOURNAL", "WRITE YOUR THOUGHTS", "RECORD YOUR DREAMS", "EXPRESS YOURSELF", "YOUR SAFE SPACE"]} />
          <p className="mt-3 text-sm tracking-widest uppercase" style={{ color: "rgba(0,255,0,0.5)", fontFamily: "monospace" }}>
            &gt; daily journal &gt; dream journal &gt; ai insights
          </p>
        </div>
        <style jsx global>{`.dud { color: #0f0; opacity: 0.7; }`}</style>
      </div>

      {/* Outer: Daily vs Dream */}
      <Tabs defaultValue="journal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2" style={{ background: "rgba(0,0,0,0.6)", border: "1px solid rgba(0,255,0,0.15)" }}>
          <TabsTrigger value="journal" className="data-[state=active]:text-[#00ff00] data-[state=active]:bg-[rgba(0,255,0,0.08)] text-white/50 font-mono tracking-widest uppercase text-xs flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Daily Journal
          </TabsTrigger>
          <TabsTrigger value="dream" className="data-[state=active]:text-[#00ff00] data-[state=active]:bg-[rgba(0,255,0,0.08)] text-white/50 font-mono tracking-widest uppercase text-xs flex items-center gap-2">
            <Moon className="h-4 w-4" /> Dream Journal
          </TabsTrigger>
        </TabsList>

        {/* ── Daily Journal ── */}
        <TabsContent value="journal" className="space-y-4">
          <Tabs defaultValue="write" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,255,0,0.1)" }}>
              <TabsTrigger value="write" className="data-[state=active]:text-[#00ff00] data-[state=active]:bg-[rgba(0,255,0,0.08)] text-white/50 font-mono text-xs uppercase tracking-wider">&gt; Write</TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:text-[#00ff00] data-[state=active]:bg-[rgba(0,255,0,0.08)] text-white/50 font-mono text-xs uppercase tracking-wider">&gt; History [{totalEntries}]</TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="space-y-5">
              {dailyPrompt && (
                <div className="rounded-xl p-4" style={glassStyle}>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-[#00ff00]" />
                    <span className="text-xs text-[#00ff00] font-mono tracking-widest uppercase">Today's Prompt</span>
                  </div>
                  <p className="text-white/60 text-sm italic">{dailyPrompt}</p>
                  <button onClick={loadDailyPrompt} className="mt-2 flex items-center gap-1.5 text-xs text-white/40 hover:text-[#00ff00] transition-colors font-mono">
                    <RefreshCw className="h-3 w-3" /> Get another prompt
                  </button>
                </div>
              )}

              <div className="rounded-xl p-4" style={glassStyle}>
                <p className="text-xs text-[#00ff00] font-mono tracking-widest uppercase mb-3">&gt; How are you feeling?</p>
                <div className="flex justify-around">
                  {Object.entries(MOOD_CONFIG).map(([value, config]) => {
                    const selected = currentEntry.mood_at_start === Number(value)
                    return (
                      <button key={value} onClick={() => setCurrentEntry(prev => ({ ...prev, mood_at_start: Number(value) }))}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg transition-all hover:scale-110"
                        style={selected ? { background: "rgba(0,255,0,0.1)", border: "1px solid rgba(0,255,0,0.3)" } : { background: "transparent", border: "1px solid transparent" }}>
                        <span className="text-2xl">{config.emoji}</span>
                        <span className="text-xs font-mono" style={{ color: selected ? "#00ff00" : "rgba(255,255,255,0.4)" }}>{config.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-xl p-4 space-y-4" style={glassStyle}>
                <p className="text-xs text-[#00ff00] font-mono tracking-widest uppercase">&gt; Your Entry</p>
                <Input placeholder="// title (optional)" value={currentEntry.title} onChange={e => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))} className="font-mono text-sm placeholder:text-white/25" style={inputStyle} />
                <div className="space-y-2">
                  <button onClick={() => setShowPrompts(!showPrompts)} className="flex items-center gap-1.5 text-xs font-mono text-white/40 hover:text-[#00ff00] transition-colors">
                    <Lightbulb className="h-3.5 w-3.5" />
                    {loadingPrompts ? "loading prompts..." : `${showPrompts ? "hide" : "show"} writing prompts`}
                  </button>
                  {showPrompts && prompts.length > 0 && (
                    <div className="space-y-1.5">
                      {prompts.map((p, i) => (
                        <button key={i} onClick={() => setCurrentEntry(prev => ({ ...prev, content: p }))}
                          className="w-full text-left text-xs p-2.5 rounded-lg font-mono transition-colors hover:border-[#00ff00]/30"
                          style={{ background: "rgba(0,255,0,0.04)", border: "1px solid rgba(0,255,0,0.1)", color: "rgba(255,255,255,0.6)" }}>
                          &gt; {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Textarea placeholder="// start writing your thoughts, feelings, or experiences..." value={currentEntry.content} onChange={e => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))} rows={12} className="resize-none pr-12 font-mono text-sm placeholder:text-white/20 leading-relaxed" style={inputStyle} />
                  <button onClick={toggleVoice} className="absolute top-3 right-3 p-2 rounded-lg transition-all"
                    style={isListening ? { background: "rgba(255,0,0,0.3)", border: "1px solid rgba(255,0,0,0.5)", color: "#ff4444" } : { background: "rgba(0,255,0,0.08)", border: "1px solid rgba(0,255,0,0.2)", color: "rgba(0,255,0,0.6)" }}>
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                </div>
                {isListening && (
                  <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "#ff4444" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> listening... speak your thoughts
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={getAIInsights} disabled={loadingAI} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all hover:brightness-110 disabled:opacity-50"
                    style={{ background: "rgba(0,255,0,0.08)", border: "1px solid rgba(0,255,0,0.25)", color: "#00ff00", boxShadow: "0 0 12px rgba(0,255,0,0.08)" }}>
                    {loadingAI ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {loadingAI ? "analyzing..." : "get ai insights"}
                  </button>
                  <button onClick={saveEntry} disabled={journalSaving} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-mono font-medium transition-all hover:brightness-110 disabled:opacity-50"
                    style={{ background: "rgba(139,92,246,0.25)", border: "1px solid rgba(139,92,246,0.4)", color: "rgba(196,181,253,0.9)", boxShadow: "0 0 12px rgba(139,92,246,0.1)" }}>
                    {journalSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {journalSaving ? "saving..." : "save entry (+10 pts)"}
                  </button>
                </div>
              </div>

              {aiInsights && (
                <div className="rounded-xl p-4 space-y-4" style={{ backdropFilter: "blur(16px)", background: "rgba(0,10,0,0.7)", border: "1px solid rgba(0,255,0,0.3)", boxShadow: "0 0 24px rgba(0,255,0,0.08)" }}>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#00ff00]" />
                    <span className="text-xs text-[#00ff00] font-mono tracking-widest uppercase">AI Insights</span>
                    {aiInsights.sentiment && <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded-full" style={{ background: "rgba(0,255,0,0.1)", border: "1px solid rgba(0,255,0,0.2)", color: "#00ff00" }}>{aiInsights.sentiment}</span>}
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{aiInsights.insights}</p>
                  {aiInsights.suggestions?.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-mono text-white/40 tracking-widest uppercase">Suggestions</p>
                      <ul className="space-y-1.5">
                        {aiInsights.suggestions.map((s: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-white/60 font-mono"><span className="text-[#00ff00] mt-0.5">&gt;</span>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              <div className="rounded-xl p-4 space-y-4" style={glassStyle}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(0,255,0,0.5)" }} />
                  <Input placeholder="// search your journal..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(1); loadEntries(1, e.target.value) }} className="pl-9 font-mono text-sm placeholder:text-white/25" style={inputStyle} />
                </div>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3 pr-2">
                    {entries.map(entry => (
                      <div key={entry.id} className="rounded-xl overflow-hidden" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,255,0,0.1)" }}>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-mono text-sm text-white/85 truncate">{entry.title || "// untitled entry"}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="h-3 w-3 text-white/30" />
                                <span className="text-xs font-mono text-white/30">{format(new Date(entry.created_at), "PPP")}</span>
                                {entry.mood_at_start && <span className="text-sm">{MOOD_CONFIG[entry.mood_at_start as keyof typeof MOOD_CONFIG].emoji}</span>}
                                {entry.ai_sentiment && <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(0,255,0,0.08)", color: "rgba(0,255,0,0.6)", border: "1px solid rgba(0,255,0,0.15)" }}>{entry.ai_sentiment}</span>}
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button onClick={() => toggleFavorite(entry)} className="p-1.5 rounded-lg transition-colors hover:bg-white/10">
                                <Star className={`h-3.5 w-3.5 ${entry.is_favorite ? "fill-yellow-400 text-yellow-400" : "text-white/30"}`} />
                              </button>
                              <button onClick={() => deleteEntry(entry.id)} className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10">
                                <Trash2 className="h-3.5 w-3.5 text-white/30 hover:text-red-400" />
                              </button>
                            </div>
                          </div>
                          <p className="mt-3 text-xs text-white/50 font-mono leading-relaxed whitespace-pre-wrap">{entry.content.substring(0, 200)}{entry.content.length > 200 && "..."}</p>
                          {entry.ai_insights && (
                            <div className="mt-3 p-2.5 rounded-lg flex items-start gap-2" style={{ background: "rgba(0,255,0,0.05)", border: "1px solid rgba(0,255,0,0.12)" }}>
                              <Sparkles className="h-3.5 w-3.5 text-[#00ff00] mt-0.5 shrink-0" />
                              <p className="text-xs text-white/50 font-mono">{entry.ai_insights}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {entries.length === 0 && (
                      <div className="text-center py-16">
                        <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-20 text-[#00ff00]" />
                        <p className="text-xs font-mono text-white/25">{searchQuery ? "// no entries match your search" : "// no journal entries yet. start writing!"}</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                {totalEntries > PAGE_SIZE && (
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(0,255,0,0.1)" }}>
                    <span className="text-xs font-mono text-white/30">page {page} / {Math.ceil(totalEntries / PAGE_SIZE)}</span>
                    <div className="flex gap-2">
                      <button onClick={() => { setPage(p => p - 1); loadEntries(page - 1, searchQuery) }} disabled={page === 1} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors disabled:opacity-30" style={{ background: "rgba(0,255,0,0.05)", border: "1px solid rgba(0,255,0,0.12)", color: "rgba(0,255,0,0.7)" }}>
                        <ChevronLeft className="h-3.5 w-3.5" /> prev
                      </button>
                      <button onClick={() => { setPage(p => p + 1); loadEntries(page + 1, searchQuery) }} disabled={page >= Math.ceil(totalEntries / PAGE_SIZE)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors disabled:opacity-30" style={{ background: "rgba(0,255,0,0.05)", border: "1px solid rgba(0,255,0,0.12)", color: "rgba(0,255,0,0.7)" }}>
                        next <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* ── Dream Journal ── */}
        <TabsContent value="dream" className="space-y-4">
          <Tabs defaultValue="record" className="space-y-6">
            <TabsList>
              <TabsTrigger value="record">Record Dream</TabsTrigger>
              <TabsTrigger value="history">Dream History ({dreamEntries.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="record" className="space-y-4">
              <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Moon className="h-5 w-5 text-indigo-400" /> Describe Your Dream</CardTitle>
                  <CardDescription>Write down everything you remember, no matter how fragmented.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Dream title (optional)" value={currentDream.title} onChange={e => setCurrentDream(prev => ({ ...prev, title: e.target.value }))} />
                  <Textarea placeholder="I was in a place that looked like my childhood home but also felt completely unfamiliar..." value={currentDream.content} onChange={e => setCurrentDream(prev => ({ ...prev, content: e.target.value }))} rows={8} className="resize-none" />
                  <div>
                    <p className="text-sm font-medium mb-2">How did you feel in the dream?</p>
                    <div className="flex flex-wrap gap-2">
                      {DREAM_EMOTIONS.map(emotion => (
                        <button key={emotion} onClick={() => toggleEmotion(emotion)}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${currentDream.emotions.includes(emotion) ? "bg-indigo-500 text-white" : "bg-muted text-muted-foreground hover:bg-indigo-500/20"}`}>
                          {emotion}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={interpretDream} disabled={interpretingLoading} className="flex-1">
                      {interpretingLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Interpreting...</> : <><Sparkles className="h-4 w-4 mr-2" />Interpret Dream</>}
                    </Button>
                    <Button onClick={saveDream} disabled={dreamSaving} className="flex-1">
                      {dreamSaving ? "Saving..." : "Save Dream"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {interpretation && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="border-indigo-500/40 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-indigo-400" /> Dream Interpretation</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      {interpretation.themes && (
                        <div>
                          <p className="text-sm font-medium mb-2">Themes</p>
                          <div className="flex gap-2 flex-wrap">{interpretation.themes.map((t: string) => <Badge key={t} className="bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">{t}</Badge>)}</div>
                        </div>
                      )}
                      {interpretation.symbols && (
                        <div>
                          <p className="text-sm font-medium mb-2">Symbols</p>
                          <div className="space-y-2">
                            {interpretation.symbols.map((s: any, i: number) => (
                              <div key={i} className="flex gap-2 text-sm">
                                <span className="font-medium text-indigo-400">✦ {s.symbol}:</span>
                                <span className="text-muted-foreground">{s.meaning}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {interpretation.interpretation && <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20"><p className="text-sm leading-relaxed">{interpretation.interpretation}</p></div>}
                      {interpretation.message && <div className="text-center py-2"><p className="text-sm font-medium italic text-indigo-400">"{interpretation.message}"</p></div>}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px] p-4">
                    {dreamEntries.length === 0 ? (
                      <div className="text-center py-16 text-muted-foreground">
                        <Moon className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p>No dreams recorded yet. Sweet dreams await!</p>
                      </div>
                    ) : selectedDream ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedDream(null)}>← Back</Button>
                        <div>
                          <h2 className="text-xl font-bold">{selectedDream.title || "Untitled Dream"}</h2>
                          <p className="text-xs text-muted-foreground mt-1">{format(new Date(selectedDream.created_at), "PPPp")}</p>
                          {selectedDream.emotions && <div className="flex gap-2 mt-2 flex-wrap">{selectedDream.emotions.map(e => <Badge key={e} variant="outline" className="text-xs">{e}</Badge>)}</div>}
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedDream.content}</p>
                        {selectedDream.ai_interpretation && (() => {
                          try {
                            const interp = JSON.parse(selectedDream.ai_interpretation)
                            return (
                              <Card className="border-indigo-500/30 bg-indigo-500/5">
                                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-indigo-400" />Interpretation</CardTitle></CardHeader>
                                <CardContent className="text-sm space-y-2">
                                  {interp.themes && <div className="flex gap-1 flex-wrap">{interp.themes.map((t: string) => <Badge key={t} className="text-xs bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">{t}</Badge>)}</div>}
                                  {interp.interpretation && <p className="text-muted-foreground">{interp.interpretation}</p>}
                                  {interp.message && <p className="italic text-indigo-400 text-center">"{interp.message}"</p>}
                                </CardContent>
                              </Card>
                            )
                          } catch { return null }
                        })()}
                      </motion.div>
                    ) : (
                      <div className="space-y-3">
                        {dreamEntries.map(entry => (
                          <Card key={entry.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedDream(entry)}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-base">{entry.title || "Untitled Dream"}</CardTitle>
                                  <p className="text-xs text-muted-foreground mt-1">{format(new Date(entry.created_at), "PPP")}</p>
                                  {entry.emotions && <div className="flex gap-1 mt-1 flex-wrap">{entry.emotions.slice(0, 3).map(e => <Badge key={e} variant="outline" className="text-xs">{e}</Badge>)}</div>}
                                </div>
                                {entry.ai_interpretation && <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />}
                              </div>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
