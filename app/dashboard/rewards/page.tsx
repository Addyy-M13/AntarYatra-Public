"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trophy, Star, Award, Zap, Target, Crown, Gift, LayoutGrid, List } from "lucide-react"
import { ACHIEVEMENTS, UserAchievement } from "@/lib/types/dashboard"
import { format } from "date-fns"
import confetti from "canvas-confetti"
import { motion } from "framer-motion"

export default function RewardsPage() {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'list' | 'gallery'>('gallery')
  const [stats, setStats] = useState({
    journalCount: 0,
    moodCount: 0,
    currentStreak: 0,
    communityPosts: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    loadRewardsData()
  }, [])

  const loadRewardsData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      window.location.href = '/login'
      return
    }

    // Load user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("total_points, current_streak")
      .eq("id", user.id)
      .single()

    if (profile) {
      setTotalPoints(profile.total_points || 0)
    }

    // Load achievements
    const { data: achievements } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", user.id)
      .order("unlocked_at", { ascending: false })

    if (achievements) {
      setUserAchievements(achievements)
    }

    // No point_transactions table - removed
    setRecentTransactions([])

    // Load stats for progress tracking
    const { count: journalCount } = await supabase
      .from("journal_entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    const { count: moodCount } = await supabase
      .from("mood_entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Get chat message count
    const { count: chatCount } = await supabase
      .from("chat_messages")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Get voice message count
    const { count: voiceCount } = await supabase
      .from("chat_messages")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .not("voice_url", "is", null)

    // Get community posts count
    const { count: communityPostsCount } = await supabase
      .from("community_posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    setStats({
      journalCount: journalCount || 0,
      moodCount: moodCount || 0,
      currentStreak: profile?.current_streak || 0,
      communityPosts: communityPostsCount || 0,
    })

    // Check for new achievements
    await checkAchievements(user.id, {
      journalCount: journalCount || 0,
      moodCount: moodCount || 0,
      currentStreak: profile?.current_streak || 0,
      communityPosts: communityPostsCount || 0,
      chatCount: chatCount || 0,
      voiceCount: voiceCount || 0,
    }, achievements || [])

    setLoading(false)
  }

  const checkAchievements = async (
    userId: string,
    stats: any,
    existingAchievements: UserAchievement[]
  ) => {
    const existingIds = existingAchievements.map(a => a.achievement_id)
    const newAchievements: any[] = []

    for (const achievement of ACHIEVEMENTS) {
      if (existingIds.includes(achievement.id)) continue

      let unlocked = false

      switch (achievement.type) {
        case 'journal':
          if (stats.journalCount >= achievement.requirement) unlocked = true
          break
        case 'mood':
          if (stats.moodCount >= achievement.requirement) unlocked = true
          break
        case 'streak':
          if (stats.currentStreak >= achievement.requirement) unlocked = true
          break
        case 'community':
          // Check for chat-specific achievements
          if (achievement.id === 'chat_newcomer' || achievement.id === 'chat_regular' || achievement.id === 'chat_veteran') {
            if (stats.chatCount >= achievement.requirement) unlocked = true
          } else if (achievement.id === 'voice_communicator') {
            if (stats.voiceCount >= achievement.requirement) unlocked = true
          } else if (stats.communityPosts >= achievement.requirement) {
            unlocked = true
          }
          break
      }

      if (unlocked) {
        newAchievements.push({
          user_id: userId,
          achievement_id: achievement.id,
          achievement_name: achievement.name,
          achievement_description: achievement.description,
          points_earned: achievement.points,
          icon: achievement.icon,
        })
      }
    }

    // Save new achievements
    if (newAchievements.length > 0) {
      const { error } = await supabase
        .from("user_achievements")
        .insert(newAchievements)

      if (!error) {
        // Award points directly to profiles table
        const totalNewPoints = newAchievements.reduce((sum, a) => sum + a.points_earned, 0)
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("total_points")
          .eq("id", userId)
          .single()

        if (profile) {
          await supabase
            .from("profiles")
            .update({ 
              total_points: (profile.total_points || 0) + totalNewPoints,
              updated_at: new Date().toISOString()
            })
            .eq("id", userId)
        }

        // Show confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })

        // Reload data
        loadRewardsData()
      }
    }
  }

  const getAchievementProgress = (achievement: typeof ACHIEVEMENTS[0]) => {
    let current = 0
    switch (achievement.type) {
      case 'journal':
        current = stats.journalCount
        break
      case 'mood':
        current = stats.moodCount
        break
      case 'streak':
        current = stats.currentStreak
        break
      case 'community':
        current = stats.communityPosts
        break
    }
    return { current, total: achievement.requirement }
  }

  const unlockedIds = userAchievements.map(a => a.achievement_id)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Trophy className="h-8 w-8 animate-pulse text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Rewards & Achievements</h1>
        <p className="text-muted-foreground mt-1">
          Celebrate your mental wellness journey
        </p>
      </motion.div>

      {/* Points Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 100, damping: 18 }}
      >
        <Card className="border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Crown className="h-6 w-6 text-yellow-500" />
              Your Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-5xl font-bold text-yellow-500"
              key={totalPoints}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {totalPoints}
            </motion.div>
            <p className="text-muted-foreground mt-2">
              Keep going! Every entry and mood tracked earns you points.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievements */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Achievements</h2>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {userAchievements.length} / {ACHIEVEMENTS.length} Unlocked
            </Badge>
            <button
              onClick={() => setViewMode('gallery')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'gallery' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              aria-label="Gallery view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {viewMode === 'gallery' ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedIds.includes(achievement.id)
              return (
                <div
                  key={achievement.id}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center ${isUnlocked ? 'border-primary bg-primary/10' : 'border-border opacity-50 grayscale'}`}
                >
                  <span className="text-3xl">{achievement.icon}</span>
                  <span className="text-xs font-medium">{achievement.name}</span>
                  {isUnlocked && <span className="text-xs text-yellow-500">⭐ {achievement.points}</span>}
                </div>
              )
            })}
          </div>
        ) : (
          <motion.div
            className="grid gap-4 md:grid-cols-2"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
          >
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = unlockedIds.includes(achievement.id)
              const progress = getAchievementProgress(achievement)
              const percentage = Math.min((progress.current / progress.total) * 100, 100)

              return (
                <motion.div
                  key={achievement.id}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.96 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 90, damping: 18 } },
                  }}
                  animate={isUnlocked ? { borderColor: "hsl(var(--primary))" } : {}}
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                >
                  <Card className={isUnlocked ? "border-primary bg-primary/5 h-full" : "opacity-75 h-full"}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="text-4xl"
                            animate={isUnlocked ? { scale: [1, 1.3, 1], rotate: [0, -8, 8, 0] } : {}}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          >
                            {achievement.icon}
                          </motion.div>
                          <div>
                            <CardTitle className="text-lg">{achievement.name}</CardTitle>
                            <CardDescription>{achievement.description}</CardDescription>
                          </div>
                        </div>
                        {isUnlocked && (
                          <motion.div
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.2 }}
                          >
                            <Badge className="bg-yellow-500">
                              <Star className="h-3 w-3 mr-1" />
                              {achievement.points}
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {!isUnlocked ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                              {progress.current} / {progress.total}
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Trophy className="h-4 w-4" />
                          <span>
                            Unlocked {format(new Date(userAchievements.find(a => a.achievement_id === achievement.id)!.unlocked_at), "PPP")}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your latest point earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                  <div>
                    <p className="font-medium">{formatReason(transaction.reason)}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.created_at), "PPp")}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-lg">
                    +{transaction.points}
                  </Badge>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Start journaling or tracking your mood to earn points!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle>Earn More Points</CardTitle>
          <CardDescription>Complete these actions to boost your score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <p className="font-medium text-sm">Journal Entry</p>
                <p className="text-xs text-muted-foreground">+10 points</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
              <Zap className="h-5 w-5 text-pink-500" />
              <div className="flex-1">
                <p className="font-medium text-sm">Track Mood</p>
                <p className="text-xs text-muted-foreground">+5 points</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
              <Zap className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-sm">Community Post</p>
                <p className="text-xs text-muted-foreground">+15 points</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
              <Zap className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="font-medium text-sm">Community Reply</p>
                <p className="text-xs text-muted-foreground">+3 points</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function formatReason(reason: string): string {
  const reasonMap: Record<string, string> = {
    journal_entry: "Journal Entry",
    mood_tracking: "Mood Tracked",
    community_post: "Community Post",
    community_reply: "Community Reply",
  }

  if (reason.startsWith("achievement_")) {
    return `Achievement Unlocked: ${reason.replace("achievement_", "").replace(/_/g, " ")}`
  }

  return reasonMap[reason] || reason.replace(/_/g, " ")
}
