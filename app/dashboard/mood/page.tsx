"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MOOD_CONFIG, COMMON_ACTIVITIES, MoodEntry, MoodTrendData } from "@/lib/types/dashboard"
import { toast } from "sonner"
import { format, subDays, startOfMonth, endOfMonth, startOfWeek } from "date-fns"
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend, Cell,
} from "recharts"
import {
  Heart, TrendingUp, Calendar as CalendarIcon, Activity, Sparkles, Loader2,
  Flame, BookOpen, Award, Target, Download,
} from "lucide-react"
import { MoodHeatmap } from "@/components/mood-heatmap"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

export default function WellnessPage() {
  const supabase = createClient()

  // ── Mood Tracker State ─────────────────────────────────────────────────
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [chartData, setChartData] = useState<MoodTrendData[]>([])
  const [currentMood, setCurrentMood] = useState({
    mood_value: 3, energy_level: 3, stress_level: 3, anxiety_level: 3,
    activities: [] as string[], notes: "",
  })
  const [moodSaving, setMoodSaving] = useState(false)
  const [todayTracked, setTodayTracked] = useState(false)
  const [moodArt, setMoodArt] = useState<{ url: string; prompt: string } | null>(null)

  // ── Progress State ─────────────────────────────────────────────────────
  const [progressLoading, setProgressLoading] = useState(true)
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [loadingExport, setLoadingExport] = useState(false)
  const [stats, setStats] = useState({ totalJournals: 0, totalMoods: 0, currentStreak: 0, longestStreak: 0, totalPoints: 0, weeklyAverage: 0 })
  const [moodTrends, setMoodTrends] = useState<any[]>([])
  const [journalFrequency, setJournalFrequency] = useState<any[]>([])
  const [activityData, setActivityData] = useState<any[]>([])
  const [insights, setInsights] = useState<string[]>([])
  const [growthReport, setGrowthReport] = useState<any>(null)
  const [loadingGrowth, setLoadingGrowth] = useState(false)
  const [wrappedData, setWrappedData] = useState<any>(null)
  const [loadingWrapped, setLoadingWrapped] = useState(false)

  const COLORS = ['#8b5cf6', '#22c55e', '#f59e0b', '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#6366f1']

  useEffect(() => {
    loadMoodData()
    loadProgressData()
  }, [])

  // ── Mood Handlers ──────────────────────────────────────────────────────

  const loadMoodData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const thirtyDaysAgo = subDays(new Date(), 30)
      const { data } = await supabase.from("mood_entries").select("*").eq("user_id", user.id).gte("date", format(thirtyDaysAgo, "yyyy-MM-dd")).order("date", { ascending: true })
      if (data) {
        setMoodEntries(data)
        setChartData(data.map((e: any) => ({ date: format(new Date(e.date), "MMM dd"), mood: e.mood_value, energy: e.energy_level || 0, stress: e.stress_level || 0, anxiety: e.anxiety_level || 0 })))
        setTodayTracked(data.some((e: any) => e.date === format(new Date(), "yyyy-MM-dd")))
      }
    } catch (err) { console.error("Mood load error:", err) }
  }

  const saveMoodEntry = async () => {
    setMoodSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const today = format(new Date(), "yyyy-MM-dd")
      const moodLabel = MOOD_CONFIG[currentMood.mood_value as keyof typeof MOOD_CONFIG].label
      const { error } = await supabase.from("mood_entries").upsert({ user_id: user.id, date: today, mood_value: currentMood.mood_value, mood_label: moodLabel, energy_level: currentMood.energy_level, stress_level: currentMood.stress_level, anxiety_level: currentMood.anxiety_level, activities: currentMood.activities.length > 0 ? currentMood.activities : null, notes: currentMood.notes || null })
      if (error) { toast.error("Failed to save mood entry") }
      else {
        const { data: profile } = await supabase.from("profiles").select("total_points").eq("id", user.id).single()
        if (profile) await supabase.from("profiles").update({ total_points: (profile.total_points || 0) + 5, updated_at: new Date().toISOString() }).eq("id", user.id)
        toast.success("Mood tracked! +5 points")
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
        setTodayTracked(true)
        loadMoodData()
        const moodName = MOOD_CONFIG[currentMood.mood_value as keyof typeof MOOD_CONFIG].name
        const activities = currentMood.activities.slice(0, 2).join(" and ") || "peaceful rest"
        const artPrompt = `abstract expressionist art, ${moodName.toLowerCase()} mood, ${activities}, soft watercolor, dreamy Indian aesthetic, no text, 4k`
        const artUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(artPrompt)}?width=512&height=512&seed=${Date.now()}&nologo=true`
        setMoodArt({ url: artUrl, prompt: artPrompt })
        supabase.from("mood_art").insert({ user_id: user.id, mood_value: currentMood.mood_value, art_prompt: artPrompt, art_url: artUrl })
      }
    } catch (err) { console.error("saveMoodEntry error:", err); toast.error("Failed to save mood entry") }
    setMoodSaving(false)
  }

  const toggleActivity = (activity: string) => {
    setCurrentMood(prev => ({ ...prev, activities: prev.activities.includes(activity) ? prev.activities.filter(a => a !== activity) : [...prev.activities, activity] }))
  }

  const getMoodStats = () => {
    if (moodEntries.length === 0) return { average: 0, trend: "neutral", best: 0 }
    const moods = moodEntries.map(e => e.mood_value)
    const average = moods.reduce((s, m) => s + m, 0) / moods.length
    const best = Math.max(...moods)
    const mid = Math.floor(moods.length / 2)
    const firstAvg = moods.slice(0, mid).reduce((s, m) => s + m, 0) / Math.max(1, mid)
    const secondAvg = moods.slice(mid).reduce((s, m) => s + m, 0) / Math.max(1, moods.length - mid)
    const trend = secondAvg > firstAvg + 0.3 ? "improving" : secondAvg < firstAvg - 0.3 ? "declining" : "neutral"
    return { average, trend, best }
  }

  // ── Progress Handlers ──────────────────────────────────────────────────

  const loadProgressData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from("profiles").select("current_streak, longest_streak, total_points").eq("id", user.id).single()
    const { count: journalCount } = await supabase.from("journal_entries").select("*", { count: "exact", head: true }).eq("user_id", user.id)
    const { count: moodCount } = await supabase.from("mood_entries").select("*", { count: "exact", head: true }).eq("user_id", user.id)

    const ninetyDaysAgo = subDays(new Date(), 90)
    const { data: moodData } = await supabase.from("mood_entries").select("*").eq("user_id", user.id).gte("date", format(ninetyDaysAgo, "yyyy-MM-dd")).order("date", { ascending: true })
    const { data: journalData } = await supabase.from("journal_entries").select("created_at").eq("user_id", user.id)

    // Weekly mood trends
    const weeklyMoods: any = {}
    moodData?.forEach(entry => {
      const week = format(startOfWeek(new Date(entry.date)), "MMM dd")
      if (!weeklyMoods[week]) weeklyMoods[week] = { moods: [], energy: [], stress: [], anxiety: [] }
      weeklyMoods[week].moods.push(entry.mood_value)
      if (entry.energy_level) weeklyMoods[week].energy.push(entry.energy_level)
      if (entry.stress_level) weeklyMoods[week].stress.push(entry.stress_level)
      if (entry.anxiety_level) weeklyMoods[week].anxiety.push(entry.anxiety_level)
    })
    const trendData = Object.entries(weeklyMoods).map(([week, d]: [string, any]) => ({
      week,
      mood: (d.moods.reduce((a: number, b: number) => a + b, 0) / d.moods.length).toFixed(1),
      energy: d.energy.length > 0 ? (d.energy.reduce((a: number, b: number) => a + b, 0) / d.energy.length).toFixed(1) : 0,
      stress: d.stress.length > 0 ? (d.stress.reduce((a: number, b: number) => a + b, 0) / d.stress.length).toFixed(1) : 0,
      anxiety: d.anxiety.length > 0 ? (d.anxiety.reduce((a: number, b: number) => a + b, 0) / d.anxiety.length).toFixed(1) : 0,
    }))

    // Journal frequency by day
    const dayFreq: any = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 }
    journalData?.forEach(e => { dayFreq[format(new Date(e.created_at), "EEEE")]++ })

    // Activity frequency
    const actCount: any = {}
    moodData?.forEach(e => e.activities?.forEach((a: string) => { actCount[a] = (actCount[a] || 0) + 1 }))
    const actChartData = Object.entries(actCount).sort(([, a]: any, [, b]: any) => b - a).slice(0, 8).map(([activity, count]) => ({ activity, count }))

    setStats({ totalJournals: journalCount || 0, totalMoods: moodCount || 0, currentStreak: profile?.current_streak || 0, longestStreak: profile?.longest_streak || 0, totalPoints: profile?.total_points || 0, weeklyAverage: trendData.length > 0 ? parseFloat(trendData[trendData.length - 1].mood) : 0 })
    setMoodTrends(trendData)
    setJournalFrequency(Object.entries(dayFreq).map(([day, count]) => ({ day, count })))
    setActivityData(actChartData)
    setProgressLoading(false)

    // AI weekly insights
    setLoadingInsights(true)
    try {
      const last7 = moodData?.slice(-7) ?? []
      const weekJournals = journalData?.filter(e => new Date(e.created_at) >= subDays(new Date(), 7)).length ?? 0
      const res = await fetch("/api/ai/insights", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "weekly", moodData: last7, journalCount: weekJournals, streak: profile?.current_streak || 0 }) })
      const aiData = await res.json()
      if (Array.isArray(aiData.insights)) setInsights(aiData.insights)
    } catch { /* silently fall back */ }
    finally { setLoadingInsights(false) }
  }

  const loadGrowthReport = async () => {
    setLoadingGrowth(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: entries } = await supabase.from("journal_entries").select("content, created_at, title").eq("user_id", user.id).order("created_at", { ascending: true })
      if (!entries || entries.length < 3) { setGrowthReport({ error: "You need at least 3 journal entries to generate a growth report." }); return }
      const res = await fetch("/api/ai/growth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ earlyEntries: entries.slice(0, 3), recentEntries: entries.slice(-3) }) })
      setGrowthReport(await res.json())
    } catch { setGrowthReport({ error: "Failed to generate report. Try again." }) }
    finally { setLoadingGrowth(false) }
  }

  const loadWrapped = async () => {
    setLoadingWrapped(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const start = format(startOfMonth(new Date()), "yyyy-MM-dd")
      const end = format(endOfMonth(new Date()), "yyyy-MM-dd")
      const [{ data: moods }, { count: journalCount }, { data: hugsData }, { data: profile }] = await Promise.all([
        supabase.from("mood_entries").select("*").eq("user_id", user.id).gte("date", start).lte("date", end),
        supabase.from("journal_entries").select("content", { count: "exact" }).eq("user_id", user.id).gte("created_at", start).lte("created_at", end + "T23:59:59"),
        supabase.from("post_hugs").select("post_id, community_posts!inner(user_id)").eq("community_posts.user_id", user.id),
        supabase.from("profiles").select("current_streak, longest_streak, total_points").eq("id", user.id).single(),
      ])
      const moodCounts: Record<number, number> = {}
      moods?.forEach(m => { moodCounts[m.mood_value] = (moodCounts[m.mood_value] || 0) + 1 })
      const topMoodValue = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0]
      const topMood = topMoodValue ? MOOD_CONFIG[Number(topMoodValue) as keyof typeof MOOD_CONFIG] : null
      const { data: journalEntries } = await supabase.from("journal_entries").select("content").eq("user_id", user.id).gte("created_at", start).lte("created_at", end + "T23:59:59")
      const totalWords = journalEntries?.reduce((sum, e) => sum + e.content.split(" ").length, 0) || 0
      const actCounts: Record<string, number> = {}
      moods?.forEach(m => m.activities?.forEach((a: string) => { actCounts[a] = (actCounts[a] || 0) + 1 }))
      const topActivities = Object.entries(actCounts).sort(([, a], [, b]) => b - a).slice(0, 3).map(([a]) => a)
      setWrappedData({ topMood, topMoodCount: topMoodValue ? moodCounts[Number(topMoodValue)] : 0, moodEntries: moods?.length || 0, journalCount: journalCount || 0, totalWords, topActivities, hugsReceived: hugsData?.length || 0, streak: profile?.current_streak || 0, longestStreak: profile?.longest_streak || 0, totalPoints: profile?.total_points || 0 })
    } catch (err) { console.error("Wrapped error:", err) }
    finally { setLoadingWrapped(false) }
  }

  const exportData = async () => {
    setLoadingExport(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [{ data: journals }, { data: moods }] = await Promise.all([
        supabase.from("journal_entries").select("title, content, created_at, ai_sentiment").eq("user_id", user.id),
        supabase.from("mood_entries").select("date, mood_value, mood_label, energy_level, stress_level, notes").eq("user_id", user.id),
      ])
      const download = (csv: string, filename: string) => {
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = filename; a.click()
        URL.revokeObjectURL(url)
      }
      download(["title,content,created_at,ai_sentiment", ...(journals || []).map(j => [j.title, j.content, j.created_at, j.ai_sentiment].map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))].join("\n"), "antaryatra-journals.csv")
      download(["date,mood_value,mood_label,energy_level,stress_level,notes", ...(moods || []).map(m => [m.date, m.mood_value, m.mood_label, m.energy_level, m.stress_level, m.notes].map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))].join("\n"), "antaryatra-moods.csv")
      toast.success("Data exported!")
    } catch { toast.error("Export failed") }
    finally { setLoadingExport(false) }
  }

  const moodStats = getMoodStats()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wellness</h1>
          <p className="text-muted-foreground mt-1">Track your mood and visualize your mental wellness journey</p>
        </div>
        <Button variant="outline" onClick={exportData} disabled={loadingExport}>
          {loadingExport ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="track" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="track">Track Mood</TabsTrigger>
          <TabsTrigger value="analytics">Progress & Analytics</TabsTrigger>
        </TabsList>

        {/* ── Track Mood ── */}
        <TabsContent value="track" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Average Mood</CardTitle><Heart className="h-4 w-4 text-pink-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{moodStats.average.toFixed(1)}/5</div><p className="text-xs text-muted-foreground">Last 30 days</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Trend</CardTitle><TrendingUp className="h-4 w-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold capitalize">{moodStats.trend}</div><p className="text-xs text-muted-foreground">Overall direction</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Best Day</CardTitle><span className="text-2xl">{MOOD_CONFIG[moodStats.best as keyof typeof MOOD_CONFIG]?.emoji || ""}</span></CardHeader><CardContent><div className="text-2xl font-bold">{moodStats.best}/5</div><p className="text-xs text-muted-foreground">Your peak mood</p></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Entries</CardTitle><CalendarIcon className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{moodEntries.length}</div><p className="text-xs text-muted-foreground">Total tracked</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Mood Trends</CardTitle><CardDescription>Your emotional patterns over recent days</CardDescription></CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} /><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} /></linearGradient>
                      <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis domain={[0, 5]} /><Tooltip /><Legend />
                    <Area type="monotone" dataKey="mood" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMood)" name="Mood" />
                    <Area type="monotone" dataKey="energy" stroke="#22c55e" fillOpacity={1} fill="url(#colorEnergy)" name="Energy" />
                    <Line type="monotone" dataKey="stress" stroke="#ef4444" name="Stress" />
                    <Line type="monotone" dataKey="anxiety" stroke="#f59e0b" name="Anxiety" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-muted-foreground"><Heart className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No mood data yet. Start tracking today!</p></div>
              )}
            </CardContent>
          </Card>

          {moodArt && (
            <Card className="border-primary/30 overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Today's Mood Art</CardTitle>
                <CardDescription>AI-generated art reflecting your emotional state</CardDescription>
              </CardHeader>
              <CardContent>
                <img src={moodArt.url} alt="Mood art" className="w-full rounded-lg max-h-64 object-cover" />
                <p className="text-xs text-muted-foreground mt-2 italic">"{moodArt.prompt.slice(0, 80)}..."</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Mood Calendar</CardTitle><CardDescription>Your emotional patterns at a glance</CardDescription></CardHeader>
            <CardContent><MoodHeatmap entries={moodEntries} /></CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Track Your Mood</CardTitle>
              <CardDescription>{todayTracked ? "You've already tracked today — you can update it below." : "How are you feeling today?"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold">Overall Mood</Label>
                <div className="flex justify-around" role="radiogroup">
                  {Object.entries(MOOD_CONFIG).map(([value, config]) => (
                    <button key={value} onClick={() => setCurrentMood(prev => ({ ...prev, mood_value: Number(value) }))}
                      aria-pressed={currentMood.mood_value === Number(value)} aria-label={`Set mood to ${config.name}`}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentMood.mood_value === Number(value) ? "bg-accent ring-2 ring-primary" : ""}`}>
                      <span className="text-4xl">{config.emoji}</span>
                      <span className="text-xs font-medium">{config.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Energy Level: {currentMood.energy_level}/5</Label>
                <Slider value={[currentMood.energy_level]} onValueChange={([v]) => setCurrentMood(prev => ({ ...prev, energy_level: v }))} min={1} max={5} step={1} />
                <div className="flex justify-between text-xs text-muted-foreground"><span>Exhausted</span><span>Energized</span></div>
              </div>
              <div className="space-y-2">
                <Label>Stress Level: {currentMood.stress_level}/5</Label>
                <Slider value={[currentMood.stress_level]} onValueChange={([v]) => setCurrentMood(prev => ({ ...prev, stress_level: v }))} min={1} max={5} step={1} />
                <div className="flex justify-between text-xs text-muted-foreground"><span>Relaxed</span><span>Very Stressed</span></div>
              </div>
              <div className="space-y-2">
                <Label>Anxiety Level: {currentMood.anxiety_level}/5</Label>
                <Slider value={[currentMood.anxiety_level]} onValueChange={([v]) => setCurrentMood(prev => ({ ...prev, anxiety_level: v }))} min={1} max={5} step={1} />
                <div className="flex justify-between text-xs text-muted-foreground"><span>Calm</span><span>Very Anxious</span></div>
              </div>
              <div className="space-y-3">
                <Label className="text-base font-semibold">Activities Today</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {COMMON_ACTIVITIES.map(activity => (
                    <div key={activity} className="flex items-center space-x-2">
                      <Checkbox id={activity} checked={currentMood.activities.includes(activity)} onCheckedChange={() => toggleActivity(activity)} />
                      <label htmlFor={activity} className="text-sm font-medium leading-none cursor-pointer">{activity}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea placeholder="Any additional thoughts or observations..." value={currentMood.notes} onChange={e => setCurrentMood(prev => ({ ...prev, notes: e.target.value }))} rows={3} />
              </div>
              <Button onClick={saveMoodEntry} disabled={moodSaving} className="w-full" size="lg">
                <Activity className="h-4 w-4 mr-2" />{moodSaving ? "Saving..." : "Track Mood (+5 points)"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Progress & Analytics ── */}
        <TabsContent value="analytics" className="space-y-6">
          {progressLoading ? (
            <div className="flex items-center justify-center h-64">
              <TrendingUp className="h-8 w-8 animate-pulse text-primary" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Current Streak</CardTitle><Flame className="h-4 w-4 text-orange-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.currentStreak}</div><p className="text-xs text-muted-foreground">days</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Longest Streak</CardTitle><Award className="h-4 w-4 text-yellow-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.longestStreak}</div><p className="text-xs text-muted-foreground">days</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Journals</CardTitle><BookOpen className="h-4 w-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalJournals}</div><p className="text-xs text-muted-foreground">entries</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Mood Entries</CardTitle><Heart className="h-4 w-4 text-pink-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalMoods}</div><p className="text-xs text-muted-foreground">tracked</p></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">This Week</CardTitle><TrendingUp className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.weeklyAverage}/5</div><p className="text-xs text-muted-foreground">avg mood</p></CardContent></Card>
              </div>

              <Card className="border-primary/50">
                <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> AI Weekly Insights</CardTitle></CardHeader>
                <CardContent>
                  {loadingInsights ? (
                    <div className="flex items-center gap-3 py-4 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /><span className="text-sm">Generating your personalized insights...</span></div>
                  ) : insights.length > 0 ? (
                    <div className="grid gap-3">{insights.map((insight, i) => <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-primary/10"><Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" /><p className="text-sm">{insight}</p></div>)}</div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">Start tracking your mood and journaling to unlock personalized AI insights.</p>
                  )}
                </CardContent>
              </Card>

              <Tabs defaultValue="trends" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="trends">Mood Trends</TabsTrigger>
                  <TabsTrigger value="frequency">Journal Frequency</TabsTrigger>
                  <TabsTrigger value="activities">Activities</TabsTrigger>
                  <TabsTrigger value="wrapped">Monthly Wrapped</TabsTrigger>
                </TabsList>

                <TabsContent value="trends">
                  <Card>
                    <CardHeader><CardTitle>Weekly Mood Trends</CardTitle><CardDescription>Your emotional patterns over time</CardDescription></CardHeader>
                    <CardContent>
                      {moodTrends.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                          <LineChart data={moodTrends}>
                            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="week" /><YAxis domain={[0, 5]} /><Tooltip /><Legend />
                            <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2} name="Mood" />
                            <Line type="monotone" dataKey="energy" stroke="#22c55e" strokeWidth={2} name="Energy" />
                            <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} name="Stress" />
                            <Line type="monotone" dataKey="anxiety" stroke="#f59e0b" strokeWidth={2} name="Anxiety" />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : <div className="text-center py-12 text-muted-foreground"><TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Track your mood for at least a week to see trends</p></div>}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="frequency">
                  <Card>
                    <CardHeader><CardTitle>Journaling Frequency by Day</CardTitle><CardDescription>Which days do you journal most?</CardDescription></CardHeader>
                    <CardContent>
                      {journalFrequency.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={journalFrequency}>
                            <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip />
                            <Bar dataKey="count" fill="#8b5cf6" name="Journal Entries" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : <div className="text-center py-12 text-muted-foreground"><CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Start journaling to see your patterns</p></div>}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activities">
                  <Card>
                    <CardHeader><CardTitle>Most Frequent Activities</CardTitle><CardDescription>What activities do you do most?</CardDescription></CardHeader>
                    <CardContent>
                      {activityData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={activityData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="activity" type="category" width={100} /><Tooltip />
                            <Bar dataKey="count" name="Times Done">{activityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : <div className="text-center py-12 text-muted-foreground"><Target className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Track activities with your mood to see patterns</p></div>}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="wrapped" className="space-y-4">
                  {!wrappedData ? (
                    <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2"><span className="text-2xl">🎁</span> Monthly Wrapped</CardTitle><CardDescription>Your emotional highlights for {format(new Date(), "MMMM yyyy")}</CardDescription></CardHeader>
                      <CardContent className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Generate your personal monthly summary</p>
                        <Button onClick={loadWrapped} disabled={loadingWrapped} size="lg">
                          {loadingWrapped ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <>Generate My Wrapped <Sparkles className="h-4 w-4 ml-2" /></>}
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-linear-to-br from-violet-500/20 to-purple-600/20 border-violet-500/30"><CardContent className="pt-6 text-center"><div className="text-4xl mb-2">{wrappedData.topMood?.emoji || "😐"}</div><div className="text-lg font-bold">{wrappedData.topMood?.name || "Neutral"}</div><p className="text-xs text-muted-foreground mt-1">Most felt mood · {wrappedData.topMoodCount}×</p></CardContent></Card>
                        <Card className="bg-linear-to-br from-blue-500/20 to-cyan-600/20 border-blue-500/30"><CardContent className="pt-6 text-center"><div className="text-3xl font-bold text-blue-400">{wrappedData.totalWords.toLocaleString()}</div><div className="text-sm font-medium mt-1">Words Journaled</div><p className="text-xs text-muted-foreground mt-1">Across {wrappedData.journalCount} entries</p></CardContent></Card>
                        <Card className="bg-linear-to-br from-orange-500/20 to-red-600/20 border-orange-500/30"><CardContent className="pt-6 text-center"><div className="text-3xl font-bold text-orange-400">{wrappedData.streak}</div><div className="text-sm font-medium mt-1">Day Streak 🔥</div><p className="text-xs text-muted-foreground mt-1">Best: {wrappedData.longestStreak} days</p></CardContent></Card>
                        <Card className="bg-linear-to-br from-pink-500/20 to-rose-600/20 border-pink-500/30"><CardContent className="pt-6 text-center"><div className="text-3xl font-bold text-pink-400">{wrappedData.hugsReceived}</div><div className="text-sm font-medium mt-1">Hugs Received 🤗</div><p className="text-xs text-muted-foreground mt-1">From the community</p></CardContent></Card>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card><CardHeader><CardTitle className="text-base">Top Activities This Month</CardTitle></CardHeader><CardContent>{wrappedData.topActivities.length > 0 ? <div className="space-y-2">{wrappedData.topActivities.map((a: string, i: number) => <div key={a} className="flex items-center gap-3"><span className="text-lg font-bold text-muted-foreground/50">#{i + 1}</span><span className="font-medium">{a}</span></div>)}</div> : <p className="text-sm text-muted-foreground">No activities tracked yet</p>}</CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-base">Month at a Glance</CardTitle></CardHeader><CardContent className="space-y-3"><div className="flex justify-between"><span className="text-sm text-muted-foreground">Mood entries</span><span className="font-medium">{wrappedData.moodEntries}</span></div><div className="flex justify-between"><span className="text-sm text-muted-foreground">Total points earned</span><span className="font-medium text-yellow-500">⭐ {wrappedData.totalPoints}</span></div></CardContent></Card>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Growth Report */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500" /> How Far I've Come</CardTitle>
                  <CardDescription>AI analysis of your emotional growth journey</CardDescription>
                </CardHeader>
                <CardContent>
                  {!growthReport ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">Our AI will compare your earliest and most recent journal entries</p>
                      <Button onClick={loadGrowthReport} disabled={loadingGrowth}>
                        {loadingGrowth ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <>Generate Growth Report <Sparkles className="h-4 w-4 ml-2" /></>}
                      </Button>
                    </div>
                  ) : growthReport.error ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">{growthReport.error}</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                        <p className="text-sm leading-relaxed">{growthReport.growthSummary}</p>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card><CardHeader><CardTitle className="text-base">💪 Strengths Gained</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground leading-relaxed">{growthReport.strengthsGained}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-base">✅ Themes Resolved</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground leading-relaxed">{growthReport.themesResolved}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle className="text-base">🌱 Still Growing</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground leading-relaxed">{growthReport.stillGrowing}</p></CardContent></Card>
                        <Card className="bg-linear-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30"><CardHeader><CardTitle className="text-base">🎉 Celebration</CardTitle></CardHeader><CardContent><p className="text-sm font-medium leading-relaxed">{growthReport.celebrationMessage}</p></CardContent></Card>
                      </div>
                      <Button variant="outline" onClick={() => setGrowthReport(null)} className="w-full">Regenerate Report</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
