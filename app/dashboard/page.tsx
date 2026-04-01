"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ensureProfile } from "@/lib/actions/profile"
import { Textarea } from "@/components/ui/textarea"
import { GlassCard, GlassStatCard } from "@/components/ui/liquid-glass"
import { renderCanvas, TypeWriter, ShineBorder } from "@/components/ui/hero-designali"
import {
  Flame,
  BookOpen,
  Trophy,
  TrendingUp,
  Heart,
  Sparkles,
  Plus,
  Calendar,
  Wind,
  Brain,
  Loader2,
} from "lucide-react"
import { MOOD_CONFIG } from "@/lib/types/dashboard"
import Link from "next/link"
import { toast } from "sonner"
import dynamic from "next/dynamic"
import { useTranslation } from "@/lib/i18n/context"
import { motion, stagger, useAnimate } from "framer-motion"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"

const loader = <div className="flex items-center justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-white/60" /></div>

const wellnessImages = [
  {
    url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop",
    alt: "Mindful meditation in nature",
  },
  {
    url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=400&auto=format&fit=crop",
    alt: "Serene mountain lake reflection",
  },
  {
    url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=400&auto=format&fit=crop",
    alt: "Journaling and self-reflection",
  },
  {
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=400&auto=format&fit=crop",
    alt: "Peaceful forest with light",
  },
  {
    url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&auto=format&fit=crop",
    alt: "Yoga and mindfulness practice",
  },
  {
    url: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=400&auto=format&fit=crop",
    alt: "Sunrise over mountains, new beginnings",
  },
  {
    url: "https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?q=80&w=400&auto=format&fit=crop",
    alt: "Lotus flower, inner peace",
  },
  {
    url: "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?q=80&w=400&auto=format&fit=crop",
    alt: "Starry night sky, wonder and calm",
  },
]

function WellnessParallaxSection() {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate(
      "img",
      { opacity: [0, 1] },
      { duration: 0.6, delay: stagger(0.12) }
    )
  }, [])

  const taglines = ["Breathe · Reflect · Grow", "Find Your Inner Peace", "One Day at a Time", "You Are Not Alone"]

  return (
    <div
      ref={scope}
      className="relative w-full rounded-3xl overflow-hidden"
      style={{ minHeight: "340px" }}
    >
      {/* Background gradient matching app's deep midnight blue theme */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 60% 50%, rgba(88,28,220,0.18) 0%, rgba(15,10,40,0.95) 70%)",
          backdropFilter: "blur(2px)",
        }}
      />

      {/* Subtle grid overlay — designali style */}
      <div
        className="absolute inset-0 z-[1] opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #a8a29e 1px, transparent 1px), linear-gradient(to bottom, #a8a29e 1px, transparent 1px)",
          backgroundSize: "3rem 3rem",
          maskImage:
            "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 110%)",
        }}
      />

      {/* Soft glow orbs */}
      <div className="absolute top-8 left-1/3 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.60 0.18 280)" }} />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.65 0.15 200)" }} />

      {/* Center headline — designali style with Plus corners */}
      <motion.div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center gap-3 pointer-events-none"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.2 }}
      >
        {/* Bordered box with Plus corner markers */}
        <div
          className="relative mx-auto px-8 py-6 pointer-events-none"
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(8px)",
            borderRadius: "1rem",
          }}
        >
          <Plus strokeWidth={4} className="absolute -left-3 -top-3 h-6 w-6 text-violet-400" />
          <Plus strokeWidth={4} className="absolute -right-3 -top-3 h-6 w-6 text-violet-400" />
          <Plus strokeWidth={4} className="absolute -left-3 -bottom-3 h-6 w-6 text-violet-400" />
          <Plus strokeWidth={4} className="absolute -right-3 -bottom-3 h-6 w-6 text-violet-400" />

          <p
            className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-bricolage, sans-serif)", textShadow: "0 2px 24px rgba(0,0,0,0.6)" }}
          >
            AntarYatra
          </p>
          <p className="text-sm md:text-base text-white/55 font-light tracking-widest uppercase mt-1">
            Your Inner Journey
          </p>
        </div>

        {/* TypeWriter tagline */}
        <div
          className="mt-2 px-5 py-2 rounded-full text-sm font-medium text-violet-300 pointer-events-auto"
          style={{
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.3)",
            backdropFilter: "blur(8px)",
          }}
        >
          <TypeWriter strings={taglines} />
        </div>

        {/* Pulsing active indicator */}
        <div className="flex items-center gap-2 mt-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
          </span>
          <span className="text-xs text-green-400">Active Now</span>
        </div>
      </motion.div>

      {/* Parallax floating images */}
      <Floating sensitivity={-0.8} easingFactor={0.04} className="overflow-hidden rounded-3xl">

        <FloatingElement depth={0.6} className="top-[6%] left-[4%]">
          <motion.img initial={{ opacity: 0 }} src={wellnessImages[0].url} alt={wellnessImages[0].alt}
            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-2xl opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300 shadow-lg"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }} />
        </FloatingElement>

        <FloatingElement depth={1.2} className="top-[5%] left-[22%]">
          <motion.img initial={{ opacity: 0 }} src={wellnessImages[1].url} alt={wellnessImages[1].alt}
            className="w-20 h-24 md:w-28 md:h-32 object-cover rounded-2xl opacity-75 hover:opacity-100 hover:scale-105 transition-all duration-300"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }} />
        </FloatingElement>

        <FloatingElement depth={2} className="top-[3%] left-[55%]">
          <motion.img initial={{ opacity: 0 }} src={wellnessImages[2].url} alt={wellnessImages[2].alt}
            className="w-24 h-32 md:w-32 md:h-44 object-cover rounded-2xl opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-300"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }} />
        </FloatingElement>

        <FloatingElement depth={0.8} className="top-[4%] left-[80%]">
          <motion.img initial={{ opacity: 0 }} src={wellnessImages[3].url} alt={wellnessImages[3].alt}
            className="w-16 h-16 md:w-22 md:h-22 object-cover rounded-2xl opacity-75 hover:opacity-100 hover:scale-105 transition-all duration-300"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }} />
        </FloatingElement>

        <FloatingElement depth={1.5} className="top-[55%] left-[2%]">
          <motion.img initial={{ opacity: 0 }} src={wellnessImages[4].url} alt={wellnessImages[4].alt}
            className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-2xl opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-300"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }} />
        </FloatingElement>

        <FloatingElement depth={3} className="top-[60%] left-[18%]">
          <motion.img initial={{ opacity: 0 }} src={wellnessImages[5].url} alt={wellnessImages[5].alt}
            className="w-28 md:w-36 h-20 md:h-24 object-cover rounded-2xl opacity-65 hover:opacity-100 hover:scale-105 transition-all duration-300"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }} />
        </FloatingElement>

        <FloatingElement depth={1} className="top-[58%] left-[68%]">
          <motion.img initial={{ opacity: 0 }} src={wellnessImages[6].url} alt={wellnessImages[6].alt}
            className="w-20 h-28 md:w-28 md:h-36 object-cover rounded-2xl opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-300"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }} />
        </FloatingElement>

        <FloatingElement depth={0.5} className="top-[62%] left-[86%]">
          <motion.img initial={{ opacity: 0 }} src={wellnessImages[7].url} alt={wellnessImages[7].alt}
            className="w-14 h-14 md:w-18 md:h-18 object-cover rounded-2xl opacity-65 hover:opacity-100 hover:scale-105 transition-all duration-300"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }} />
        </FloatingElement>

      </Floating>

      {/* Bottom edge fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-10"
        style={{ background: "linear-gradient(to top, rgba(9,7,30,0.5), transparent)" }} />
    </div>
  )
}

// 3 featured wellness tools shown on the dashboard
const BreathingExercises = dynamic(() => import("@/components/breathing-exercises").then(mod => ({ default: mod.BreathingExercises })), { loading: () => loader })
const EmotionWheel       = dynamic(() => import("@/components/emotion-wheel").then(mod => ({ default: mod.EmotionWheel })),             { loading: () => loader })
const GroundingTechnique = dynamic(() => import("@/components/grounding-technique").then(mod => ({ default: mod.GroundingTechnique })), { loading: () => loader })

export default function DashboardPage() {
  const { t } = useTranslation()
  const [loading, setLoading]             = useState(true)
  const [stats, setStats]                 = useState({
    currentStreak: 0,
    totalJournals: 0,
    totalPoints:   0,
    moodAverage:   0,
  })
  const [todayMood, setTodayMood]         = useState<number | null>(null)
  const [quickJournal, setQuickJournal]   = useState("")
  const [recentInsights, setRecentInsights] = useState<any[]>([])
  const [dailyPrompt, setDailyPrompt]     = useState<string>("")
  const [memoryLane, setMemoryLane]       = useState<any | null>(null)
  const [crisisWarning, setCrisisWarning] = useState(false)

  const supabase = createClient()

  // Canvas mouse-trail animation
  useEffect(() => {
    renderCanvas()
  }, [])

  useEffect(() => {
    checkUsernameAndLoadData()
  }, [])

  const checkUsernameAndLoadData = async () => {
    const profileResult = await ensureProfile()
    if (!profileResult.success) {
      setLoading(false)
      return
    }
    loadDashboardData()
  }

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      const oneYearAgo     = new Date(); oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      const oneYearAgoPlus = new Date(oneYearAgo); oneYearAgoPlus.setDate(oneYearAgoPlus.getDate() + 2)

      const [moodData, journalData, profileData, memoryData, recentMoods] = await Promise.all([
        supabase
          .from('mood_entries')
          .select('mood_value')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),

        supabase
          .from('journal_entries')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),

        supabase
          .from('profiles')
          .select('current_streak, total_points, username')
          .eq('id', user.id)
          .single(),

        supabase
          .from('journal_entries')
          .select('id, title, content, created_at')
          .eq('user_id', user.id)
          .gte('created_at', oneYearAgo.toISOString())
          .lte('created_at', oneYearAgoPlus.toISOString())
          .limit(1)
          .maybeSingle(),

        supabase
          .from('mood_entries')
          .select('mood_value')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      const moodAvg = moodData.data && moodData.data.length > 0
        ? moodData.data.reduce((sum, entry) => sum + entry.mood_value, 0) / moodData.data.length
        : 0

      const today = new Date().toISOString().split('T')[0]
      const { data: todayMoodData } = await supabase
        .from('mood_entries')
        .select('mood_value')
        .eq('user_id', user.id)
        .gte('created_at', new Date(today).toISOString())
        .single()

      if (todayMoodData) setTodayMood(todayMoodData.mood_value)

      setStats({
        currentStreak: profileData.data?.current_streak || 0,
        totalJournals: journalData.count || 0,
        totalPoints:   profileData.data?.total_points   || 0,
        moodAverage:   moodAvg,
      })

      setDailyPrompt("What are three things you're grateful for today?")
      setRecentInsights([
        {
          id:      '1',
          title:   `Welcome ${profileData.data?.username || 'back'}! 🌟`,
          content: `You've logged ${journalData.count || 0} journal entries. Consistency is key to mental wellness.`,
        },
      ])

      if (memoryData.data) setMemoryLane(memoryData.data)

      const lastMoods       = recentMoods.data?.map((m: any) => m.mood_value) ?? []
      const dismissedUntil  = typeof window !== 'undefined' ? localStorage.getItem('crisis_dismissed_until') : null
      const isDismissed     = dismissedUntil && new Date(dismissedUntil) > new Date()
      if (!isDismissed && lastMoods.length >= 3 && lastMoods.slice(0, 3).every((v: number) => v <= 2)) {
        setCrisisWarning(true)
      }
    } catch (error) {
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const calculateAndUpdateStreak = async (userId: string) => {
    const { data: entries } = await supabase
      .from('journal_entries')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!entries || entries.length === 0) return 0

    const uniqueDates = Array.from(
      new Set(entries.map(e => e.created_at.split('T')[0]))
    ).sort().reverse()

    const today = new Date().toISOString().split('T')[0]
    let streak    = 0
    let checkDate = today

    for (const date of uniqueDates) {
      if (date === checkDate) {
        streak++
        const prev = new Date(checkDate)
        prev.setDate(prev.getDate() - 1)
        checkDate = prev.toISOString().split('T')[0]
      } else if (date < checkDate) {
        break
      }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('longest_streak')
      .eq('id', userId)
      .single()

    const longestStreak = Math.max(streak, profile?.longest_streak || 0)

    await supabase
      .from('profiles')
      .update({ current_streak: streak, longest_streak: longestStreak })
      .eq('id', userId)

    return streak
  }

  const handleQuickJournal = async () => {
    if (!quickJournal.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Please sign in to save journal entries")
        return
      }

      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content: quickJournal,
          mood:    todayMood || undefined,
        })
        .select()

      if (error) {
        toast.error(`Failed to save: ${error.message || error.hint || 'Check console for details'}`)
        return
      }

      toast.success("Journal entry saved! +10 points")
      setQuickJournal("")

      const { data: profile } = await supabase
        .from("profiles")
        .select("total_points")
        .eq("id", user.id)
        .maybeSingle()

      if (profile) {
        await supabase
          .from("profiles")
          .update({
            total_points: (profile.total_points || 0) + 10,
            updated_at:   new Date().toISOString(),
          })
          .eq("id", user.id)

        const newStreak = await calculateAndUpdateStreak(user.id)

        setStats(prev => ({
          ...prev,
          totalJournals: prev.totalJournals + 1,
          totalPoints:   prev.totalPoints + 10,
          currentStreak: newStreak,
        }))
      }
    } catch (error) {
      toast.error("Failed to save journal entry")
    }
  }

  const handleMoodSelect = async (moodValue: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Please sign in to track your mood")
        return
      }

      const { error } = await supabase
        .from('mood_entries')
        .insert({ user_id: user.id, mood_value: moodValue })

      if (error) throw error

      setTodayMood(moodValue)
      toast.success("Mood tracked! +5 points")

      const { data: profile } = await supabase
        .from("profiles")
        .select("total_points")
        .eq("id", user.id)
        .maybeSingle()

      if (profile) {
        await supabase
          .from("profiles")
          .update({
            total_points: (profile.total_points || 0) + 5,
            updated_at:   new Date().toISOString(),
          })
          .eq("id", user.id)

        setStats(prev => ({
          ...prev,
          totalPoints: (profile.total_points || 0) + 5,
        }))
      }

      setTodayMood(moodValue)
    } catch (error) {
      toast.error("Failed to track mood")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-pulse text-white/60" />
      </div>
    )
  }

  return (
    <div className="relative space-y-8">

      {/* ── Canvas mouse-trail (designali) ─────────────────────────────────── */}
      <canvas
        className="pointer-events-none fixed inset-0 z-0"
        id="canvas"
      />

      {/* ── Header with Language Selector ──────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between">
        <div>
          {/* Pulsing "online" dot next to the welcome heading */}
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <p className="text-xs text-green-500">Available Now</p>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{t("dashboard.welcome")}</h1>
          <p className="text-white/50 mt-1">{t("dashboard.subtitle")}</p>
        </div>
      </div>

      {/* ── Crisis Warning Banner ───────────────────────────────────────────── */}
      {crisisWarning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 rounded-2xl p-4 flex items-start justify-between gap-4"
          style={{
            backdropFilter: "blur(16px)",
            background:     "rgba(244, 63, 94, 0.12)",
            border:         "1px solid rgba(244, 63, 94, 0.3)",
            boxShadow:      "inset 1px 1px 0 rgba(255,255,255,0.1), 0 8px 24px rgba(244,63,94,0.15)",
          }}
        >
          <div>
            <p className="font-semibold text-rose-300">We noticed you've been having a tough time 💙</p>
            <p className="text-sm text-white/50 mt-1">
              Your recent mood entries suggest you may be struggling. You're not alone.{" "}
              <a href="/crisis" className="text-rose-400 underline font-medium">Visit our Crisis Support page</a> for resources and help.
            </p>
          </div>
          <button
            onClick={() => {
              setCrisisWarning(false)
              const until = new Date(); until.setHours(until.getHours() + 24)
              localStorage.setItem('crisis_dismissed_until', until.toISOString())
            }}
            className="text-white/40 hover:text-white/80 text-xl leading-none shrink-0 transition-colors"
          >
            ×
          </button>
        </motion.div>
      )}

      {/* ── Memory Lane ────────────────────────────────────────────────────── */}
      {memoryLane && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <GlassCard title={<><span className="text-lg">📅</span> One year ago today, you wrote...</>}>
            <p className="text-sm text-white/55 italic">
              &quot;{memoryLane.content.slice(0, 180)}{memoryLane.content.length > 180 ? '...' : ''}&quot;
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-white/35">{new Date(memoryLane.created_at).toLocaleDateString()}</span>
              <a href="/dashboard/journal" className="text-xs text-white/60 hover:text-white transition-colors">Read full entry →</a>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ── Stats Grid — with grid-background (designali) ───────────────────── */}
      <div className="relative z-10">
        {/* Designali-style grid bg behind stats */}
        <div
          className="absolute -inset-4 -z-10 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #57534e 1px, transparent 1px), linear-gradient(to bottom, #57534e 1px, transparent 1px)",
            backgroundSize: "3rem 3rem",
            maskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 110%)",
          }}
        />
        <motion.div
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {[
            { title: t("dashboard.currentStreak"),  value: `${stats.currentStreak} ${t("dashboard.days")}`, sub: t("dashboard.keepGoing"),       icon: <Flame    className="h-5 w-5 text-orange-400" /> },
            { title: t("dashboard.journalEntries"), value: stats.totalJournals,                              sub: t("dashboard.thoughtsCaptured"), icon: <BookOpen className="h-5 w-5 text-blue-400"   /> },
            { title: t("dashboard.totalPoints"),    value: stats.totalPoints,                               sub: t("dashboard.keepEarning"),      icon: <Trophy   className="h-5 w-5 text-yellow-400" /> },
            { title: t("dashboard.moodAverage"),    value: stats.moodAverage > 0 ? stats.moodAverage.toFixed(1) : "N/A", sub: t("dashboard.last7Days"), icon: <Heart className="h-5 w-5 text-pink-400" /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 18 } } }}
            >
              <GlassStatCard title={stat.title} value={stat.value} sub={stat.sub} icon={stat.icon} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Wellness Parallax Hero ──────────────────────────────────────────── */}
      <div className="relative z-10">
        <WellnessParallaxSection />
      </div>

      {/* ── Mood Check + Quick Journal ──────────────────────────────────────── */}
      <div className="relative z-10 grid gap-6 lg:grid-cols-2">

        {/* Quick Mood Check */}
        <GlassCard
          title={<><Heart className="h-5 w-5 text-pink-400" /> How are you feeling today?</>}
          description={todayMood ? "You've already tracked your mood today!" : "Take a moment to check in with yourself"}
        >
          <div className="flex justify-around">
            {Object.entries(MOOD_CONFIG).map(([value, config]) => {
              const isSelected = todayMood === Number(value)
              return (
                <motion.button
                  key={value}
                  onClick={() => handleMoodSelect(Number(value))}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                  style={
                    isSelected
                      ? { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }
                      : { background: "transparent",           border: "1px solid transparent" }
                  }
                  animate={isSelected
                    ? { scale: 1.25, filter: "brightness(1.15)" }
                    : { scale: 1,    filter: "brightness(0.75)" }}
                  whileTap={{ scale: 0.88 }}
                  whileHover={!isSelected ? { scale: 1.1, filter: "brightness(1)" } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 16 }}
                >
                  <span className="text-3xl">{config.emoji}</span>
                  <span className="text-xs text-white/60">{config.name}</span>
                </motion.button>
              )
            })}
          </div>
          {todayMood && (
            <div className="mt-4 text-center">
              <span
                className="inline-block px-3 py-1 rounded-full text-sm text-white/80"
                style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                Today's mood: {MOOD_CONFIG[todayMood as keyof typeof MOOD_CONFIG].name}
              </span>
            </div>
          )}
        </GlassCard>

        {/* Quick Journal */}
        <GlassCard
          title={<><Sparkles className="h-5 w-5 text-violet-400" /> Quick Journal Entry</>}
          description={dailyPrompt || "What's on your mind today?"}
        >
          <div className="space-y-4">
            <Textarea
              placeholder="Start writing your thoughts..."
              value={quickJournal}
              onChange={(e) => setQuickJournal(e.target.value)}
              rows={4}
              className="text-white/80 placeholder:text-white/30 resize-none"
              style={{
                backdropFilter: "blur(8px)",
                background:     "rgba(255,255,255,0.06)",
                border:         "1px solid rgba(255,255,255,0.12)",
              }}
            />
            <div className="flex gap-2">
              {/* ShineBorder on Save Entry button */}
              <ShineBorder
                borderWidth={2}
                borderRadius={12}
                color={["#8B5CF6", "#06B6D4", "#8B5CF6"]}
                className="flex-1 p-0 bg-transparent dark:bg-transparent rounded-xl"
              >
                <button
                  onClick={handleQuickJournal}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:brightness-110"
                  style={{
                    background: "rgba(139, 92, 246, 0.4)",
                    border:     "1px solid rgba(139, 92, 246, 0.5)",
                    boxShadow:  "inset 1px 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Save Entry
                </button>
              </ShineBorder>
              <Link
                href="/dashboard/journal"
                className="flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 transition-all duration-200 hover:text-white"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border:     "1px solid rgba(255,255,255,0.12)",
                }}
              >
                Full Journal
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ── Recent Insights ─────────────────────────────────────────────────── */}
      {recentInsights.length > 0 && (
        <div className="relative z-10">
          <GlassCard
            title={<><TrendingUp className="h-5 w-5 text-blue-400" /> AI Insights</>}
            description="Personalized insights based on your journey"
          >
            <div className="space-y-3">
              {recentInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border:     "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Sparkles className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-white/90">{insight.title}</h4>
                    <p className="text-sm text-white/50 mt-1">{insight.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── Quick Actions — ShineBorder cards (designali) ───────────────────── */}
      <div className="relative z-10 grid gap-4 md:grid-cols-3">
        {[
          { href: "/dashboard/journal",   icon: <BookOpen  className="h-6 w-6" />, label: "New Journal Entry",  color: ["#3B82F6", "#06B6D4", "#3B82F6"] as string[] },
          { href: "/dashboard/mood",      icon: <Calendar  className="h-6 w-6" />, label: "View Mood History",  color: ["#EC4899", "#F97316", "#EC4899"] as string[] },
          { href: "/dashboard/community", icon: <Sparkles  className="h-6 w-6" />, label: "Join Community",     color: ["#8B5CF6", "#06B6D4", "#8B5CF6"] as string[] },
        ].map((action) => (
          <Link key={action.href} href={action.href} className="block">
            <ShineBorder
              borderWidth={2}
              borderRadius={16}
              color={action.color}
              className="h-24 bg-white/5 dark:bg-white/5 backdrop-blur-md"
            >
              <div className="flex flex-col items-center justify-center gap-3 h-full text-white/70 hover:text-white transition-colors duration-300">
                {action.icon}
                <span className="text-sm font-medium">{action.label}</span>
              </div>
            </ShineBorder>
          </Link>
        ))}
      </div>

      {/* ── Featured Wellness Tools ─────────────────────────────────────────── */}
      <div className="relative z-10 space-y-4">
        {/* Section header with Plus corner markers */}
        <div
          className="relative flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{
            border:     "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <Plus strokeWidth={3} className="absolute -left-2.5 -top-2.5 h-5 w-5 text-violet-400" />
          <Plus strokeWidth={3} className="absolute -right-2.5 -top-2.5 h-5 w-5 text-violet-400" />
          <Sparkles className="h-4 w-4 text-violet-400" />
          <h2 className="text-sm font-semibold text-white/70 tracking-wide uppercase">Featured Tools</h2>
          <Link href="/dashboard/breathe" className="ml-auto text-xs text-white/35 hover:text-white/70 transition-colors">
            View all →
          </Link>
        </div>

        <GlassCard
          title={<><Wind className="h-5 w-5 text-cyan-400" /> Breathing Exercises</>}
          description="Instant calm & stress relief with clinically-proven techniques"
        >
          <BreathingExercises />
        </GlassCard>

        <GlassCard
          title={<><Brain className="h-5 w-5 text-purple-400" /> Emotion Wheel</>}
          description="Identify and understand your feelings with emotional intelligence"
        >
          <EmotionWheel />
        </GlassCard>

        <GlassCard
          title={<><Sparkles className="h-5 w-5 text-amber-400" /> Grounding Technique</>}
          description="The 5-4-3-2-1 method to ground yourself in the present moment"
        >
          <GroundingTechnique />
        </GlassCard>
      </div>
    </div>
  )
}