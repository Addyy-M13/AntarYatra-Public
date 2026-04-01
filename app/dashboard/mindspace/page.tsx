"use client"

import { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain, Send, Loader2, RotateCcw, Mail, Lock, Unlock, Calendar, Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { format, isPast, parseISO } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

// ── CBT Types & Data ───────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant"
  content: string
}

const TECHNIQUES = [
  { id: "thought-record",       label: "Thought Record",       emoji: "📝", description: "Identify & challenge negative thoughts" },
  { id: "behavioral-activation",label: "Behavioral Activation",emoji: "⚡", description: "Break the cycle of avoidance & low mood" },
  { id: "grounding",            label: "5-4-3-2-1 Grounding",  emoji: "🌿", description: "Anchor yourself in the present moment" },
  { id: "reframing",            label: "Cognitive Reframing",  emoji: "🔄", description: "Find a more balanced perspective" },
]

const STARTERS: Record<string, string> = {
  "thought-record":        "I'm having a difficult thought pattern and would like help working through it.",
  "behavioral-activation": "I've been feeling low and avoiding things I used to enjoy.",
  "grounding":             "I'm feeling anxious or overwhelmed right now and need to ground myself.",
  "reframing":             "I'm stuck in a negative thought and want help seeing it differently.",
}

// ── Letter Type ────────────────────────────────────────────────────────────

interface FutureLetter {
  id: string
  title: string
  content: string
  unlock_date: string
  is_read: boolean
  created_at: string
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function MindspacePage() {
  const supabase = createClient()

  // ── CBT State ──────────────────────────────────────────────────────────
  const [technique, setTechnique] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [cbtLoading, setCbtLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // ── Letters State ──────────────────────────────────────────────────────
  const [letters, setLetters] = useState<FutureLetter[]>([])
  const [newLetter, setNewLetter] = useState({ title: "", content: "", unlock_date: "" })
  const [letterSaving, setLetterSaving] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<FutureLetter | null>(null)

  useEffect(() => {
    loadLetters()
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ── CBT Handlers ───────────────────────────────────────────────────────

  const startSession = (id: string) => {
    setTechnique(id)
    setMessages([])
    sendMessage(STARTERS[id], id, [])
  }

  const sendMessage = async (text: string, currentTechnique: string, currentMessages: Message[]) => {
    setCbtLoading(true)
    const updatedMessages = [...currentMessages, { role: "user" as const, content: text }]
    setMessages(updatedMessages)
    try {
      const res = await fetch("/api/ai/cbt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, technique: currentTechnique }),
      })
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      if (!res.body) throw new Error("No response body")
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ""
      setMessages(prev => [...prev, { role: "assistant", content: "" }])
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantText += decoder.decode(value)
        setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: "assistant", content: assistantText }; return u })
      }
    } catch { toast.error("Failed to get response") }
    finally { setCbtLoading(false); setInput("") }
  }

  const handleSend = () => {
    if (!input.trim() || !technique) return
    sendMessage(input, technique, messages)
  }

  const resetSession = () => { setTechnique(null); setMessages([]); setInput("") }

  // ── Letter Handlers ────────────────────────────────────────────────────

  const loadLetters = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from("future_letters").select("*").eq("user_id", user.id).order("unlock_date", { ascending: true })
    if (data) {
      setLetters(data)
      const newlyUnlocked = data.filter(l => isPast(parseISO(l.unlock_date)) && !l.is_read)
      if (newlyUnlocked.length > 0) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 } })
        toast.success(`${newlyUnlocked.length} letter${newlyUnlocked.length > 1 ? "s" : ""} just unlocked for you!`)
      }
    }
  }

  const saveLetter = async () => {
    if (!newLetter.title.trim() || !newLetter.content.trim() || !newLetter.unlock_date) {
      toast.error("Please fill in all fields including the unlock date"); return
    }
    const selectedDate = parseISO(newLetter.unlock_date)
    if (isPast(selectedDate)) { toast.error("Unlock date must be in the future"); return }
    setLetterSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from("future_letters").insert({ user_id: user.id, ...newLetter })
    if (error) toast.error("Failed to seal your letter")
    else {
      toast.success("Letter sealed! It will unlock on " + format(selectedDate, "PPP"))
      setNewLetter({ title: "", content: "", unlock_date: "" })
      loadLetters()
    }
    setLetterSaving(false)
  }

  const markAsRead = async (id: string) => {
    await supabase.from("future_letters").update({ is_read: true }).eq("id", id)
    setLetters(prev => prev.map(l => l.id === id ? { ...l, is_read: true } : l))
  }

  const unlockedLetters = letters.filter(l => isPast(parseISO(l.unlock_date)))
  const lockedLetters = letters.filter(l => !isPast(parseISO(l.unlock_date)))
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = format(tomorrow, "yyyy-MM-dd")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-violet-500" />
          Mindspace
        </h1>
        <p className="text-muted-foreground mt-1">
          Heal your present self. Nurture your future self.
        </p>
      </div>

      <Tabs defaultValue="cbt" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cbt" className="flex items-center gap-2">
            <Brain className="h-4 w-4" /> CBT Companion
          </TabsTrigger>
          <TabsTrigger value="letters" className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Future Letters
          </TabsTrigger>
        </TabsList>

        {/* ── CBT Companion ── */}
        <TabsContent value="cbt" className="space-y-4">
          {!technique ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                {TECHNIQUES.map(t => (
                  <motion.div key={t.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card className="cursor-pointer hover:bg-accent/50 hover:border-primary/50 transition-all" onClick={() => startSession(t.id)}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <span className="text-3xl">{t.emoji}</span>
                          {t.label}
                        </CardTitle>
                        <CardDescription>{t.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">Begin Session</Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Card className="border-amber-500/20 bg-amber-500/5">
                <CardContent className="pt-4 text-sm text-muted-foreground">
                  <strong className="text-amber-600 dark:text-amber-400">Important:</strong> This AI companion uses evidence-based CBT/DBT techniques to support your mental wellness. It is not a substitute for professional mental health care.
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-2xl">{TECHNIQUES.find(t => t.id === technique)?.emoji}</span>
                    {TECHNIQUES.find(t => t.id === technique)?.label}
                  </h2>
                  <p className="text-sm text-muted-foreground">{TECHNIQUES.find(t => t.id === technique)?.description}</p>
                </div>
                <Button variant="outline" size="sm" onClick={resetSession}>
                  <RotateCcw className="h-4 w-4 mr-2" /> New Session
                </Button>
              </div>

              <Card className="flex flex-col" style={{ height: "calc(100vh - 340px)", minHeight: "400px" }}>
                <CardContent className="flex flex-col h-full p-0">
                  <ScrollArea className="flex-1 p-4">
                    <AnimatePresence>
                      {messages.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className={`flex mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words overflow-hidden ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-emerald-500/10 border border-emerald-500/20 text-foreground rounded-bl-sm"
                          }`}>
                            {msg.role === "assistant" && (
                              <div className="flex items-center gap-1 mb-1">
                                <Brain className="h-3 w-3 text-emerald-500" />
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">CBT Companion</span>
                              </div>
                            )}
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          </div>
                        </motion.div>
                      ))}
                      {cbtLoading && messages[messages.length - 1]?.role === "user" && (
                        <div className="flex justify-start mb-4">
                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl rounded-bl-sm px-4 py-3">
                            <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                          </div>
                        </div>
                      )}
                    </AnimatePresence>
                    <div ref={scrollRef} />
                  </ScrollArea>
                  <div className="border-t p-4 flex gap-2">
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                      rows={2}
                      className="resize-none"
                      disabled={cbtLoading}
                    />
                    <Button onClick={handleSend} disabled={cbtLoading || !input.trim()} size="icon" className="h-auto">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* ── Future Letters ── */}
        <TabsContent value="letters">
          <Tabs defaultValue="write" className="space-y-6">
            <TabsList>
              <TabsTrigger value="write">Write a Letter</TabsTrigger>
              <TabsTrigger value="unlocked">
                Unlocked {unlockedLetters.length > 0 && <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">{unlockedLetters.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="sealed">Sealed ({lockedLetters.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="write" className="space-y-4">
              <Card className="border-primary/30 bg-linear-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" /> Compose Your Letter</CardTitle>
                  <CardDescription>Write to your future self. Be honest, kind, and hopeful.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Letter title (e.g. 'To myself in one year...')" value={newLetter.title} onChange={e => setNewLetter(prev => ({ ...prev, title: e.target.value }))} />
                  <Textarea placeholder={"Dear Future Me,\n\nI want you to know that right now..."} value={newLetter.content} onChange={e => setNewLetter(prev => ({ ...prev, content: e.target.value }))} rows={12} className="resize-none" />
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Unlock Date — when should future you receive this?
                    </label>
                    <Input type="date" min={minDate} value={newLetter.unlock_date} onChange={e => setNewLetter(prev => ({ ...prev, unlock_date: e.target.value }))} />
                  </div>
                  <Button onClick={saveLetter} disabled={letterSaving} className="w-full" size="lg">
                    <Send className="h-4 w-4 mr-2" />{letterSaving ? "Sealing..." : "Seal & Send to Future Self"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unlocked" className="space-y-4">
              {unlockedLetters.length === 0 ? (
                <Card><CardContent className="py-16 text-center text-muted-foreground"><Unlock className="h-12 w-12 mx-auto mb-4 opacity-30" /><p>No unlocked letters yet. Write one to your future self!</p></CardContent></Card>
              ) : selectedLetter ? (
                <AnimatePresence>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="border-primary/40 bg-linear-to-br from-primary/5 to-amber-500/5">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge className="mb-2 bg-amber-500/20 text-amber-700 dark:text-amber-300">Written {format(parseISO(selectedLetter.created_at), "PPP")}</Badge>
                            <CardTitle className="text-2xl">{selectedLetter.title}</CardTitle>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedLetter(null)}>Close</Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="whitespace-pre-wrap text-base leading-relaxed">{selectedLetter.content}</p>
                        {!selectedLetter.is_read && (
                          <Button className="mt-6" onClick={() => { markAsRead(selectedLetter.id); setSelectedLetter(prev => prev ? { ...prev, is_read: true } : null) }}>
                            Mark as Read
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="space-y-3">
                  {unlockedLetters.map(letter => (
                    <Card key={letter.id} className="cursor-pointer hover:bg-accent/50 transition-colors border-amber-500/30 bg-amber-500/5" onClick={() => setSelectedLetter(letter)}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Unlock className="h-4 w-4 text-amber-500" />
                              <span className="text-xs text-muted-foreground">Unlocked {format(parseISO(letter.unlock_date), "PPP")}</span>
                              {!letter.is_read && <Badge className="text-xs bg-amber-500">New</Badge>}
                            </div>
                            <CardTitle className="text-lg">{letter.title}</CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sealed" className="space-y-3">
              {lockedLetters.length === 0 ? (
                <Card><CardContent className="py-16 text-center text-muted-foreground"><Lock className="h-12 w-12 mx-auto mb-4 opacity-30" /><p>No sealed letters. Write one to your future self!</p></CardContent></Card>
              ) : lockedLetters.map(letter => (
                <Card key={letter.id} className="opacity-80">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-muted"><Lock className="h-4 w-4 text-muted-foreground" /></div>
                        <div>
                          <p className="font-medium">{letter.title}</p>
                          <p className="text-xs text-muted-foreground">Unlocks {format(parseISO(letter.unlock_date), "PPP")}</p>
                        </div>
                      </div>
                      <Badge variant="outline">Sealed</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
